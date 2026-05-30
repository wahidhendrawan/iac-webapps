import { useMemo, useState } from 'react';
import { useTerraformStore } from '../store';
import { PROVIDERS } from '../data/providers';
import { Info, Settings, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { ProviderSettings } from './ProviderSettings';

export function ConfigurationForm() {
  const { resources, selectedResourceId, updateResource } = useTerraformStore();
  const [showRefHelper, setShowRefHelper] = useState<string | null>(null);

  const selectedResource = useMemo(
    () => resources.find((r) => r.id === selectedResourceId) || null,
    [resources, selectedResourceId]
  );

  // Available references for interpolation
  const availableRefs = useMemo(() => {
    return resources
      .filter(r => r.id !== selectedResourceId)
      .map(r => `${r.type}.${r.name}.id`);
  }, [resources, selectedResourceId]);

  const schema = useMemo(() => {
    if (!selectedResource) return null;
    return PROVIDERS.flatMap((p) => p.resources).find((r) => r.type === selectedResource.type) || null;
  }, [selectedResource]);

  const handleChange = (name: string, value: any) => {
    if (selectedResourceId && selectedResourceId !== '__settings__') {
      updateResource(selectedResourceId, { properties: { ...selectedResource?.properties, [name]: value } });
    }
  };

  if (selectedResourceId === '__settings__') {
    return <ProviderSettings />;
  }

  if (!selectedResource || !schema) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 transition-colors">
        <Settings className="w-16 h-16 text-gray-200 dark:text-slate-800 mb-4" />
        <p className="text-lg font-medium text-gray-500 dark:text-slate-400">Select a resource to configure.</p>
        <p className="text-sm mt-2 text-gray-400 dark:text-slate-500">Choose from the sidebar on the left.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 overflow-y-auto p-8 relative transition-colors">
      <div className="mb-8 border-b dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{schema.name}</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">{schema.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        {schema.fields.map((field) => (
          <div key={field.name} className="relative group">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500 text-xs ml-1" title="Required">*</span>}
            </label>
            
            {field.description && (
              <p className="mb-2 text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed italic border-l-2 border-indigo-100 dark:border-indigo-900/50 pl-2">
                {field.description}
              </p>
            )}

            {field.type === 'select' ? (
              <select
                value={selectedResource.properties[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              >
                <option value="" disabled={field.required}>Select {field.label}</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : field.type === 'boolean' ? (
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={!!selectedResource.properties[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-slate-700 dark:bg-slate-800 rounded"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-slate-400">Enabled</span>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={selectedResource.properties[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onFocus={() => setShowRefHelper(field.name)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
                
                {showRefHelper === field.name && availableRefs.length > 0 && field.type === 'text' && (
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      <LinkIcon className="w-3 h-3" />
                      Reference other resources
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableRefs.map((ref) => (
                        <button
                          key={ref}
                          onClick={() => {
                            handleChange(field.name, ref);
                            setShowRefHelper(null);
                          }}
                          className="text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded transition-all flex items-center gap-1"
                        >
                          <ChevronRight className="w-3 h-3 text-indigo-400" />
                          {ref}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Helper text if needed */}
            {field.description && (
              <p className="mt-1 text-xs text-gray-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {field.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
