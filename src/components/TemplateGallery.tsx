import { useTerraformStore } from '../store';
import { ARCHITECTURE_TEMPLATES } from '../data/templates';
import { Layout, X, ArrowRight } from 'lucide-react';

interface TemplateGalleryProps {
  onClose: () => void;
}

export function TemplateGallery({ onClose }: TemplateGalleryProps) {
  const { loadTemplate } = useTerraformStore();

  const handleSelect = (id: string) => {
    loadTemplate(id);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-600 text-white">
        <div className="flex items-center gap-3">
          <Layout className="w-6 h-6" />
          <h2 className="text-xl font-bold">Architecture Templates</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-gray-500 mb-6">
          Choose a pre-configured architecture template to kickstart your infrastructure project.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARCHITECTURE_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="group border border-gray-100 rounded-xl p-5 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer flex flex-col justify-between"
              onClick={() => handleSelect(template.id)}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {template.name}
                  </h3>
                  <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Template
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {template.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.resources.map((r, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {r.type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center text-emerald-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Use this template
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 text-gray-600 font-semibold hover:text-gray-900 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
