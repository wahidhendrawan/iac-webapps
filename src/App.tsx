import { useState, useEffect } from 'react';
import { useTerraformStore } from './store';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ConfigurationForm } from './components/ConfigurationForm';
import { CodePreview } from './components/CodePreview';
import { BackendSettings } from './components/BackendSettings';
import { TemplateGallery } from './components/TemplateGallery';
import { VisualDesigner } from './components/VisualDesigner';
import { DevOpsSettings } from './components/DevOpsSettings';
import { About } from './components/About';
import { SecurityReport } from './components/SecurityReport';
import { AICopilot } from './components/AICopilot';
import { Layout as LayoutIcon, Settings as SettingsIcon } from 'lucide-react';

function App() {
  const { theme } = useTerraformStore();
  const [showAbout, setShowAbout] = useState(false);
  const [showBackend, setShowBackend] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDevOps, setShowDevOps] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'visual'>('visual');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden relative transition-colors">
      <Header 
        onOpenAbout={() => setShowAbout(true)} 
        onOpenBackend={() => setShowBackend(true)}
        onOpenTemplates={() => setShowTemplates(true)}
        onOpenDevOps={() => setShowDevOps(true)}
      />

      {showAbout && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <About onClose={() => setShowAbout(false)} />
        </div>
      )}

      {showBackend && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <BackendSettings onClose={() => setShowBackend(false)} />
        </div>
      )}

      {showTemplates && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <TemplateGallery onClose={() => setShowTemplates(false)} />
        </div>
      )}

      {showDevOps && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <DevOpsSettings onClose={() => setShowDevOps(false)} />
        </div>
      )}

      {showSecurity && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <SecurityReport onClose={() => setShowSecurity(false)} />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden relative">
            {/* View Mode Toggle */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-1 rounded-xl border border-gray-200 dark:border-slate-800 shadow-lg transition-all">
                <button
                    onClick={() => setViewMode('form')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                        viewMode === 'form' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 dark:text-slate-400 hover:text-indigo-600'
                    }`}
                >
                    <SettingsIcon className="w-4 h-4" />
                    Form View
                </button>
                <button
                    onClick={() => setViewMode('visual')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                        viewMode === 'visual' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 dark:text-slate-400 hover:text-indigo-600'
                    }`}
                >
                    <LayoutIcon className="w-4 h-4" />
                    Visual Designer
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {viewMode === 'form' ? (
                    <ConfigurationForm />
                ) : (
                    <VisualDesigner />
                )}
                
                <div className="w-1/3 min-w-[300px] max-w-[500px] border-l border-gray-200 dark:border-slate-800 hidden xl:block h-full">
                    <CodePreview onOpenSecurity={() => setShowSecurity(true)} />
                </div>
            </div>
        </main>
      </div>
      <AICopilot />
    </div>
  );
}

export default App;
