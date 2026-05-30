import { useState, useEffect } from 'react';
import { Cloud, Info, Database, Layout, Rocket, ChevronDown, Sun, Moon, CircleDollarSign, FileUp, RefreshCw } from 'lucide-react';
import { useTerraformStore } from '../store';
import { calculateTotalCost } from '../data/pricing';
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
  const [exchangeRate, setExchangeRate] = useState(16250);
  const [isRateLoading, setIsRateLoading] = useState(true);
  
  const cost = calculateTotalCost(resources, exchangeRate);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        if (data && data.rates && data.rates.IDR) {
          setExchangeRate(data.rates.IDR);
        }
      } catch (err) {
        console.error('Failed to fetch exchange rate', err);
      } finally {
        setIsRateLoading(false);
      }
    };
    fetchRate();
  }, []);

  const formatCurrency = (val: number, curr: string) => {
    if (curr === 'IDR') return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

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

        <div className="relative group/cost">
            <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800/30 cursor-help transition-all">
                <CircleDollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-emerald-500 uppercase leading-none">Est. Cost</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {formatCurrency(cost.usd.monthly, 'USD')}
                        <span className="text-[10px] font-normal opacity-70 ml-1">/mo</span>
                    </span>
                </div>
            </div>
            
            {/* Cost Breakdown Tooltip */}
            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-4 z-50 invisible group-hover/cost:visible animate-in fade-in slide-in-from-top-2 duration-200">
                <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 border-b dark:border-slate-700 pb-2">Estimated Cost Breakdown</h3>
                
                <div className="space-y-4">
                    <section>
                        <div className="text-[10px] font-bold text-indigo-500 uppercase mb-2">USD Breakdown</div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col"><span className="text-[9px] text-gray-400 uppercase">Hourly</span><span className="text-xs font-bold dark:text-white">${cost.usd.hourly.toFixed(3)}</span></div>
                            <div className="flex flex-col"><span className="text-[9px] text-gray-400 uppercase">Daily</span><span className="text-xs font-bold dark:text-white">${cost.usd.daily.toFixed(2)}</span></div>
                            <div className="flex flex-col"><span className="text-[9px] text-gray-400 uppercase">Monthly</span><span className="text-xs font-bold dark:text-white">${cost.usd.monthly.toFixed(2)}</span></div>
                        </div>
                    </section>

                    <section className="pt-2 border-t dark:border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-[10px] font-bold text-emerald-500 uppercase">IDR (Real-time)</div>
                            {isRateLoading ? (
                                <RefreshCw className="w-2.5 h-2.5 animate-spin text-gray-400" />
                            ) : (
                                <span className="text-[8px] text-gray-400 font-medium">Rate: 1 USD = {formatCurrency(exchangeRate, 'IDR')}</span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                             <div className="flex justify-between text-xs dark:text-white"><span>Hourly</span><strong>{formatCurrency(cost.idr.hourly, 'IDR')}</strong></div>
                             <div className="flex justify-between text-xs dark:text-white"><span>Daily</span><strong>{formatCurrency(cost.idr.daily, 'IDR')}</strong></div>
                             <div className="flex justify-between text-xs dark:text-white"><span>Monthly</span><strong>{formatCurrency(cost.idr.monthly, 'IDR')}</strong></div>
                        </div>
                    </section>
                </div>
                <p className="mt-4 text-[9px] text-gray-400 italic leading-tight">Prices are based on average static estimates. Use cloud specific calculators for billing-ready quotes.</p>
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
