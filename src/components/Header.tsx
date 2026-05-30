import { Cloud, Info, Database, Layout, Rocket, ChevronDown, Sun, Moon, CircleDollarSign, FileUp } from 'lucide-react';
import { useTerraformStore } from '../store';
import { calculateMonthlyCost } from '../data/pricing';
import { parseHCL } from '../utils/hclParser';
import type { IaCTool } from '../types';

interface HeaderProps {
  onOpenAbout: () => void;
  onOpenBackend: () => void;
  onOpenTemplates: () => void;
  onOpenDevOps: () => void;
}

export function Header({ onOpenAbout, onOpenBackend, onOpenTemplates, onOpenDevOps }: HeaderProps) {
  const { iacTool, setIaCTool, theme, toggleTheme, resources, setResources } = useTerraformStore();
  const totalCost = calculateMonthlyCost(resources);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const importedResources = parseHCL(content);
        if (importedResources.length > 0) {
            setResources(importedResources);
        } else {
            alert("No valid Terraform resources found in the file.");
        }
      } catch (err) {
        console.error("Import failed", err);
        alert("Failed to parse the .tf file. Please ensure it's a valid Terraform configuration.");
      }
    };
    reader.readAsText(file);
  };

  const tools: { id: IaCTool; name: string }[] = [
    { id: 'terraform', name: 'Terraform' },
    { id: 'opentofu', name: 'OpenTofu' },
    { id: 'pulumi', name: 'Pulumi (TS)' },
    { id: 'helm', name: 'Helm Chart' },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-16 flex items-center px-6 justify-between shrink-0 z-10 transition-colors">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">IaC WebApps</h1>
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-slate-800" />

        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800/30 transition-all">
            <CircleDollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-emerald-500 uppercase leading-none">Est. Cost</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">${totalCost.toFixed(2)}<span className="text-[10px] font-normal opacity-70">/mo</span></span>
            </div>
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-slate-800" />

        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Tool</span>
            <div className="relative group">
                <select
                    value={iacTool}
                    onChange={(e) => setIaCTool(e.target.value as IaCTool)}
                    className="appearance-none bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-8 py-1.5 cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-all outline-none"
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
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <button
          onClick={onOpenDevOps}
          className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Rocket className="w-5 h-5" />
          <span className="text-sm font-medium">Export</span>
        </button>

        <label className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
          <FileUp className="w-5 h-5" />
          <span className="text-sm font-medium">Import</span>
          <input type="file" accept=".tf" onChange={handleImport} className="hidden" />
        </label>

        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Layout className="w-5 h-5" />
          <span className="text-sm font-medium">Templates</span>
        </button>
        <button
          onClick={onOpenBackend}
          className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Database className="w-5 h-5" />
          <span className="text-sm font-medium">Backend</span>
        </button>
        <button
          onClick={onOpenAbout}
          className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Info className="w-5 h-5" />
          <span className="text-sm font-medium">About</span>
        </button>
      </div>
    </header>
  );
}
