import { useTerraformStore } from '../store';
import { Bot, Key, Shield, X, ExternalLink, Info, AlertTriangle } from 'lucide-react';
import type { AIProvider } from '../types';

interface AISettingsProps {
  onClose: () => void;
}

const AI_PROVIDERS: { id: AIProvider; name: string; description: string; url?: string }[] = [
  { 
    id: 'simulation', 
    name: 'Built-in Simulator', 
    description: 'Basic resource addition based on keywords. No API key required.' 
  },
  { 
    id: 'deepseek', 
    name: 'DeepSeek AI', 
    description: 'Advanced reasoning and code generation using DeepSeek-V3.',
    url: 'https://platform.deepseek.com/'
  },
  { 
    id: 'openai', 
    name: 'OpenAI (GPT-4)', 
    description: 'Industry standard for complex infrastructure design.',
    url: 'https://platform.openai.com/'
  }
];

export function AISettings({ onClose }: AISettingsProps) {
  const { aiSettings, updateAISettings } = useTerraformStore();

  const handleProviderChange = (provider: AIProvider) => {
    updateAISettings({ provider });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors border border-gray-100 dark:border-slate-800">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-indigo-600 text-white">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6" />
          <h2 className="text-xl font-bold">AI Copilot Settings</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <h3 className="text-sm font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4">Select Intelligence Provider</h3>
          <div className="grid grid-cols-1 gap-3">
            {AI_PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  aiSettings.provider === provider.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                    : 'border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-900 dark:text-white">{provider.name}</div>
                    {provider.url && (
                        <a 
                          href={provider.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                            Get API Key <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
                <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">{provider.description}</div>
              </button>
            ))}
          </div>
        </section>

        {aiSettings.provider !== 'simulation' && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 mb-4">
                <Key className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  Authentication
                </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">API Key</label>
                <div className="relative">
                    <input
                        type="password"
                        value={aiSettings.apiKey}
                        onChange={(e) => updateAISettings({ apiKey: e.target.value })}
                        placeholder={`Paste your ${aiSettings.provider} API key here...`}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                </div>
                <p className="mt-2 text-xs text-gray-400">Your API key is kept in memory for this browser session only and is discarded on reload. It is used exclusively to call the selected provider.</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/20 flex gap-3">
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
              <div className="text-sm text-amber-800 dark:text-amber-400">
                <strong>Privacy Note:</strong> Using external AI providers will send your current infrastructure metadata to their servers for processing.
              </div>
            </div>

            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0" />
              <div className="text-sm text-red-800 dark:text-red-400">
                <strong>Security Notice:</strong> The API key is held in memory only for this browser tab and is not saved to storage. Re-enter it after reload. For production, prefer a backend proxy that keeps the key server-side.
              </div>
            </div>
          </section>
        )}

        {aiSettings.provider === 'simulation' && (
           <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20 flex gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-400">
                The simulator is free and works offline. For better results and smarter architecture design, consider using DeepSeek or OpenAI.
              </p>
           </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg"
        >
          Save AI Settings
        </button>
      </div>
    </div>
  );
}
