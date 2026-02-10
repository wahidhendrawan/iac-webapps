import { useState, useMemo } from 'react';
import { useTerraformStore } from '../store';
import { generateHCL } from '../utils/generator';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Download, Code as CodeIcon } from 'lucide-react';
import clsx from 'clsx';

export function CodePreview() {
  // Menggabungkan resources dan providerSettings dari store
  const { resources, providerSettings } = useTerraformStore();
  const [copied, setCopied] = useState(false);

  // Menggunakan useMemo untuk performa yang lebih baik,
  // bergantung pada resources DAN providerSettings
  const hcl = useMemo(() => 
    generateHCL(resources, providerSettings), 
    [resources, providerSettings]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(hcl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([hcl], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.tf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700 overflow-hidden">
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between shadow-sm flex-shrink-0">
        <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <CodeIcon className="w-4 h-4 text-indigo-400" />
          Live Preview
        </h2>
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
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <SyntaxHighlighter
          language="hcl"
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.875rem', lineHeight: '1.5' }}
          wrapLines={true}
          showLineNumbers={true}
          lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#4b5563', textAlign: 'right' }}
        >
          {hcl || '# Add resources to see generated code'}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}