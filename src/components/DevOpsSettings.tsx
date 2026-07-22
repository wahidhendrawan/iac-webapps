import { useTerraformStore } from '../store';
import { Rocket, Github, Gitlab, X, AlertTriangle, Terminal, Download } from 'lucide-react';
import type { CICDProvider, TerraformFile } from '../types';
import type { ElementType } from 'react';
import JSZip from 'jszip';
import { generateTerraformFiles } from '../utils/generator';
import { generatePulumiFiles } from '../utils/pulumiGenerator';

const PROVIDERS: { id: CICDProvider; name: string; description: string; icon: ElementType }[] = [
  { id: 'none', name: 'None', description: 'Just download the HCL files.', icon: Rocket },
  { id: 'github', name: 'GitHub Actions', description: 'Generates .github/workflows/iac.yml', icon: Github },
  { id: 'gitlab', name: 'GitLab CI', description: 'Generates .gitlab-ci.yml', icon: Gitlab },
];

interface DevOpsSettingsProps {
  onClose: () => void;
}

export function DevOpsSettings({ onClose }: DevOpsSettingsProps) {
  const { resources, providerSettings, backend, devopsSettings, iacTool, updateDevOpsSettings } = useTerraformStore();

  const handleDownload = async () => {
    const zip = new JSZip();
    let files: TerraformFile[] = [];
    
    if (iacTool === 'pulumi') {
        files = generatePulumiFiles(resources);
    } else {
        files = generateTerraformFiles(resources, providerSettings, backend, devopsSettings, iacTool);
    }

    files.forEach((file: TerraformFile) => {
      zip.file(file.filename, file.content);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${iacTool}-infrastructure-project.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-800 text-white">
        <div className="flex items-center gap-3">
          <Rocket className="w-6 h-6" />
          <h2 className="text-xl font-bold">DevOps & Export Configuration</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Select CI/CD Platform</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PROVIDERS.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => updateDevOpsSettings({ ciCdProvider: p.id })}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col items-center text-center ${
                    devopsSettings.ciCdProvider === p.id
                      ? 'border-slate-800 bg-slate-50 shadow-md'
                      : 'border-gray-100 hover:border-slate-200 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-8 h-8 mb-3 ${devopsSettings.ciCdProvider === p.id ? 'text-slate-800' : 'text-gray-400'}`} />
                  <div className="font-bold text-gray-900">{p.name}</div>
                  <div className="text-[10px] text-gray-500 mt-1">{p.description}</div>
                </button>
              );
            })}
          </div>
        </section>

        {devopsSettings.ciCdProvider !== 'none' && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Workflow Configuration</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Branch</label>
              <input
                type="text"
                value={devopsSettings.branchName}
                onChange={(e) => updateDevOpsSettings({ branchName: e.target.value })}
                placeholder="main"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all outline-none"
              />
              <p className="mt-1 text-xs text-gray-400">The pipeline will run on pushes to this branch.</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
              <Terminal className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <strong>Next Steps:</strong> After downloading the ZIP, commit all files to your repository. Make sure to set your cloud credentials (AWS_ACCESS_KEY_ID, etc.) in your repository secrets.
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <strong>Push directly?</strong> Since we are running in a CLI environment, you can also use <code>git push</code> from your terminal once you've saved the files.
            </div>
          </div>
        </section>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2 text-gray-600 font-semibold hover:text-gray-800 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleDownload}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Project (ZIP)
        </button>
      </div>
    </div>
  );
}
