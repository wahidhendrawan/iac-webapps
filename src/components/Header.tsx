import { Cloud, Terminal } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Cloud className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">TerraForm Builder</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
          <Terminal className="w-5 h-5" />
          <span className="text-sm font-medium">Docs</span>
        </button>
      </div>
    </header>
  );
}
