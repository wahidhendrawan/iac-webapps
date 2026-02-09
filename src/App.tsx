import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ConfigurationForm } from './components/ConfigurationForm';
import { CodePreview } from './components/CodePreview';
import { About } from './components/About';

function App() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden relative">
      <Header onOpenAbout={() => setShowAbout(true)} />

      {showAbout && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <About onClose={() => setShowAbout(false)} />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />

        <main className="flex-1 flex overflow-hidden">
            <ConfigurationForm />
            <div className="w-1/3 min-w-[300px] max-w-[500px] border-l border-gray-200 hidden xl:block h-full">
                <CodePreview />
            </div>
        </main>
      </div>
    </div>
  );
}

export default App;