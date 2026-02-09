import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ConfigurationForm } from './components/ConfigurationForm';
import { CodePreview } from './components/CodePreview';

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header />
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
