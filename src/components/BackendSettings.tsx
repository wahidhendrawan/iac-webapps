import { useTerraformStore } from '../store';
import { Database, Shield, X } from 'lucide-react';
import type { BackendType } from '../types';

const BACKEND_TYPES: { id: BackendType; name: string; description: string }[] = [
  { id: 's3', name: 'AWS S3', description: 'Store state in an Amazon S3 bucket.' },
  { id: 'gcs', name: 'Google Cloud Storage', description: 'Store state in a GCS bucket.' },
  { id: 'azurerm', name: 'Azure Resource Manager', description: 'Store state in Azure Blob Storage.' },
  { id: 'kubernetes', name: 'Kubernetes', description: 'Store state in a Kubernetes secret.' },
  { id: 'local', name: 'Local', description: 'Local state storage (default).' },
];

const BACKEND_FIELDS: Record<BackendType, { name: string; label: string; placeholder: string }[]> = {
  s3: [
    { name: 'bucket', label: 'Bucket Name', placeholder: 'my-terraform-state' },
    { name: 'key', label: 'Key', placeholder: 'network/terraform.tfstate' },
    { name: 'region', label: 'Region', placeholder: 'us-east-1' },
  ],
  gcs: [
    { name: 'bucket', label: 'Bucket Name', placeholder: 'my-terraform-state' },
    { name: 'prefix', label: 'Prefix', placeholder: 'terraform/state' },
  ],
  azurerm: [
    { name: 'resource_group_name', label: 'Resource Group', placeholder: 'my-resource-group' },
    { name: 'storage_account_name', label: 'Storage Account', placeholder: 'mystorageaccount' },
    { name: 'container_name', label: 'Container Name', placeholder: 'tfstate' },
    { name: 'key', label: 'Key', placeholder: 'terraform.tfstate' },
  ],
  kubernetes: [
    { name: 'secret_suffix', label: 'Secret Suffix', placeholder: 'state' },
    { name: 'namespace', label: 'Namespace', placeholder: 'kube-system' },
  ],
  local: [
    { name: 'path', label: 'Path', placeholder: 'terraform.tfstate' },
  ],
  remote: [], // Terraform Cloud/Enterprise
};

interface BackendSettingsProps {
  onClose: () => void;
}

export function BackendSettings({ onClose }: BackendSettingsProps) {
  const { backend, updateBackend } = useTerraformStore();

  const handleTypeChange = (type: BackendType) => {
    if (type === 'local') {
        updateBackend(null);
        return;
    }
    updateBackend({
      type,
      properties: {},
    });
  };

  const handlePropertyChange = (key: string, value: string) => {
    if (!backend) return;
    updateBackend({
      ...backend,
      properties: {
        ...backend.properties,
        [key]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6" />
          <h2 className="text-xl font-bold">Remote Backend Configuration</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Select Backend Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BACKEND_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  (backend?.type === type.id) || (!backend && type.id === 'local')
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-bold text-gray-900">{type.name}</div>
                <div className="text-xs text-gray-500 mt-1">{type.description}</div>
              </button>
            ))}
          </div>
        </section>

        {backend && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {backend.type.toUpperCase()} Configuration
            </h3>
            <div className="space-y-4">
              {BACKEND_FIELDS[backend.type]?.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={(backend.properties[field.name] as string) ?? ''}
                    onChange={(e) => handlePropertyChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
              <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <strong>Note:</strong> Sensitive credentials (like AWS Access Keys) should be configured via environment variables or CLI, not hardcoded in the backend block.
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
