import { useState, useMemo } from 'react';
import { useTerraformStore } from '../store';
import { generateHCL, generateTerraformFiles, validateResources } from '../utils/generator';
import { scanResources } from '../utils/securityScanner';
import { generatePulumiFiles } from '../utils/pulumiGenerator';
import { generateHelmFiles } from '../utils/helmGenerator';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Download, Code as CodeIcon, FolderArchive, AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import JSZip from 'jszip';

interface CodePreviewProps {
  onOpenSecurity: () => void;
}

export function CodePreview({ onOpenSecurity }: CodePreviewProps) {
  // Menggabungkan resources, providerSettings, backend, devopsSettings, dan iacTool dari store
  const { resources, providerSettings, backend, devopsSettings, iacTool } = useTerraformStore();
  const [copied, setCopied] = useState(false);

  // Determine which files and HCL/Code to show based on tool
  const files = useMemo(() => {
    if (iacTool === 'pulumi') {
        return generatePulumiFiles(resources);
    }
    if (iacTool === 'helm') {
        return generateHelmFiles(resources);
    }
    // For terraform and opentofu, it's the same files but different README/CI
    return generateTerraformFiles(resources, providerSettings, backend, devopsSettings, iacTool);
  }, [resources, providerSettings, backend, devopsSettings, iacTool]);


  const code = useMemo(() => {
    if (iacTool === 'pulumi') {
        return files.find(f => f.filename === 'index.ts')?.content || '';
    }
    if (iacTool === 'helm') {
        return files.find(f => f.filename === 'values.yaml')?.content || '';
    }
    return generateHCL(resources, providerSettings, backend, devopsSettings, iacTool);
  }, [resources, providerSettings, backend, devopsSettings, iacTool, files]);

  const language = iacTool === 'pulumi' ? 'typescript' : (iacTool === 'helm' ? 'yaml' : 'hcl');

  const validationErrors = useMemo(() => validateResources(resources), [resources]);
  const securityFindings = useMemo(() => scanResources(resources), [resources]);

  const maxSecuritySeverity = useMemo(() => {
    if (securityFindings.length === 0) return null;
    if (securityFindings.some(f => f.severity === 'critical')) return 'critical';
    if (securityFindings.some(f => f.severity === 'high')) return 'high';
    if (securityFindings.some(f => f.severity === 'medium')) return 'medium';
    return 'low';
  }, [securityFindings]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let filename = 'main.tf';
    if (iacTool === 'pulumi') filename = 'index.ts';
    else if (iacTool === 'helm') filename = 'values.yaml';

    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();

    files.forEach(file => {
      zip.file(file.filename, file.content);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${iacTool}-project.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 dark:bg-slate-950 border-l border-gray-700 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="px-4 py-3 bg-gray-800 dark:bg-slate-900 border-b border-gray-700 dark:border-slate-800 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <CodeIcon className="w-4 h-4 text-indigo-400" />
            Live Preview
          </h2>
          
          <div className="flex items-center gap-2">
            <div className="relative group/validation">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-900/50 dark:bg-slate-950/50 border border-gray-700 dark:border-slate-800 cursor-help transition-all hover:bg-gray-800">
                    {validationErrors.length > 0 ? (
                    <>
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[10px] font-bold text-amber-500 uppercase">{validationErrors.length} Errors</span>
                    </>
                    ) : (
                    <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Valid</span>
                    </>
                    )}
                </div>
                
                {validationErrors.length > 0 && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 p-3 z-50 invisible group-hover/validation:visible animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2 border-b dark:border-slate-700 pb-1">Validation Errors</div>
                        <ul className="space-y-2">
                            {validationErrors.map((error, i) => {
                                const res = resources.find(r => r.id === error.id);
                                return (
                                    <li key={i} className="text-[11px] text-gray-600 dark:text-slate-300 flex items-start gap-2">
                                        <div className="w-1 h-1 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                                        <span>
                                            <strong className="text-amber-600 dark:text-amber-400">{res?.name || 'Resource'}:</strong> {error.field} is required.
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>

            <button 
                onClick={onOpenSecurity}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-900/50 dark:bg-slate-950/50 border transition-all hover:bg-gray-800 dark:hover:bg-slate-800 ${
                maxSecuritySeverity === 'critical' || maxSecuritySeverity === 'high' ? 'border-red-500/50' : 
                maxSecuritySeverity === 'medium' ? 'border-amber-500/50' : 'border-gray-700 dark:border-slate-800'
            }`}>
                {securityFindings.length > 0 ? (
                <>
                    <ShieldAlert className={`w-3.5 h-3.5 ${
                        maxSecuritySeverity === 'critical' || maxSecuritySeverity === 'high' ? 'text-red-500' : 'text-amber-500'
                    }`} />
                    <span className={`text-[10px] font-bold uppercase ${
                        maxSecuritySeverity === 'critical' || maxSecuritySeverity === 'high' ? 'text-red-500' : 'text-amber-500'
                    }`}>{securityFindings.length} Alerts</span>
                </>
                ) : (
                <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Secure</span>
                </>
                )}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={clsx(
              "p-1.5 rounded-md transition-colors text-xs font-medium flex items-center gap-1",
              copied ? "text-green-400 bg-green-900/20" : "text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-slate-800"
            )}
            title="Copy to clipboard"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied' : ''}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-slate-800 transition-colors"
            title="Download .tf file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
           <button
            onClick={handleDownloadZip}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-slate-800 transition-colors"
            title="Download Project (ZIP)"
          >
            <FolderArchive className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.875rem', lineHeight: '1.5' }}
          wrapLines={true}
          showLineNumbers={true}
          lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#4b5563', textAlign: 'right' }}
        >
          {code || `# Add resources to see generated code`}
        </SyntaxHighlighter>

      </div>
    </div>
  );
}
