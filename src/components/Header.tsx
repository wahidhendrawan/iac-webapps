import { Cloud, Info, Database, Layout, Rocket, ChevronDown } from 'lucide-react';
import { useTerraformStore } from '../store';
import type { IaCTool } from '../types';

interface HeaderProps {
  onOpenAbout: () => void;
  onOpenBackend: () => void;
  onOpenTemplates: () => void;
  onOpenDevOps: () => void;
}

export function Header({ onOpenAbout, onOpenBackend, onOpenTemplates, onOpenDevOps }: HeaderProps) {
  const { iacTool, setIaCTool } = useTerraformStore();

  const tools: { id: IaCTool; name: string }[] = [
    { id: 'terraform', name: 'Terraform' },
    { id: 'opentofu', name: 'OpenTofu' },
    { id: 'pulumi', name: 'Pulumi (TS)' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between shrink-0 z-10">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">IaC WebApps</h1>
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Tool</span>
            <div className="relative group">
                <select
                    value={iacTool}
                    onChange={(e) => setIaCTool(e.target.value as IaCTool)}
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-8 py-1.5 cursor-pointer hover:bg-white transition-all outline-none"
                >
                    {tools.map(tool => (
                        <option key={tool.id} value={tool.id}>{tool.name}</option>
                    ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenDevOps}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <Rocket className="w-5 h-5" />
          <span className="text-sm font-medium">Export</span>
        </button>
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <Layout className="w-5 h-5" />
          <span className="text-sm font-medium">Templates</span>
        </button>
        <button
          onClick={onOpenBackend}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <Database className="w-5 h-5" />
          <span className="text-sm font-medium">Backend</span>
        </button>
        <button
          onClick={onOpenAbout}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <Info className="w-5 h-5" />
          <span className="text-sm font-medium">About</span>
        </button>
      </div>
    </header>
  );
}
