import { useState, useMemo } from 'react';
import { useTerraformStore } from '../store';
import { generateHCL, generateTerraformFiles, validateResources } from '../utils/generator';
import { generatePulumiFiles } from '../utils/pulumiGenerator';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Download, Code as CodeIcon, FolderArchive, AlertCircle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import JSZip from 'jszip';

export function CodePreview() {
  // Menggabungkan resources, providerSettings, backend, devopsSettings, dan iacTool dari store
  const { resources, providerSettings, backend, devopsSettings, iacTool } = useTerraformStore();
  const [copied, setCopied] = useState(false);

  // Determine which files and HCL/Code to show based on tool
  const files = useMemo(() => {
    if (iacTool === 'pulumi') {
        return generatePulumiFiles(resources);
    }
    // For terraform and opentofu, it's the same files but different README/CI
    return generateTerraformFiles(resources, providerSettings, backend, devopsSettings, iacTool);
  }, [resources, providerSettings, backend, devopsSettings, iacTool]);


  const code = useMemo(() => {
    if (iacTool === 'pulumi') {
        return files.find(f => f.filename === 'index.ts')?.content || '';
    }
    return generateHCL(resources, providerSettings, backend, devopsSettings);
  }, [resources, providerSettings, backend, devopsSettings, iacTool, files]);

  const language = iacTool === 'pulumi' ? 'typescript' : 'hcl';

  const validationErrors = useMemo(() => validateResources(resources), [resources]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = iacTool === 'pulumi' ? 'index.ts' : 'main.tf';
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
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700 overflow-hidden">
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <CodeIcon className="w-4 h-4 text-indigo-400" />
            Live Preview
          </h2>
          
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-900/50 border border-gray-700">
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
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={clsx(
              "p-1.5 rounded-md transition-colors text-xs font-medium flex items-center gap-1",
              copied ? "text-green-400 bg-green-900/20" : "text-gray-400 hover:text-white hover:bg-gray-700"
            )}
            title="Copy to clipboard"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied' : ''}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            title="Download .tf file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
           <button
            onClick={handleDownloadZip}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
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