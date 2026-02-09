import { Cloud, Info } from 'lucide-react';

interface HeaderProps {
  onOpenAbout: () => void;
}

export function Header({ onOpenAbout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Cloud className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">TerraForm Builder</h1>
      </div>
      <div className="flex items-center gap-4">
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