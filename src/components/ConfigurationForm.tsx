import { useMemo, useState } from 'react';
import { useTerraformStore } from '../store';
import { PROVIDERS } from '../data/providers';
import { HelpCircle, Info, Settings, Link as LinkIcon, ChevronRight } from 'lucide-react';
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
    // Menggunakan pendekatan flatMap dari branch perf-optimize 
    // untuk pencarian schema yang lebih ringkas
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
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white border-l border-gray-200">
        <Settings className="w-16 h-16 text-gray-200 mb-4" />
        <p className="text-lg font-medium text-gray-500">Select a resource to configure.</p>
        <p className="text-sm mt-2 text-gray-400">Choose from the sidebar on the left.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white border-l border-gray-200 overflow-y-auto p-8 relative">
      <div className="mb-8 border-b pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{schema.name}</h2>
            <p className="text-sm text-gray-500">{schema.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        {schema.fields.map((field) => (
          <div key={field.name} className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500 text-xs ml-1" title="Required">*</span>}
              {field.description && (
                <span title={field.description} className="cursor-help ml-1">
                  <HelpCircle className="w-3 h-3 text-gray-400" />
                </span>
              )}
            </label>

            {field.type === 'select' ? (
              <select
                value={selectedResource.properties[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
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
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Enabled</span>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={selectedResource.properties[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onFocus={() => setShowRefHelper(field.name)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
                
                {showRefHelper === field.name && availableRefs.length > 0 && field.type === 'text' && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
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
                          className="text-xs bg-white border border-gray-200 hover:border-indigo-400 hover:text-indigo-600 px-2 py-1 rounded transition-all flex items-center gap-1"
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
              <p className="mt-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {field.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}