import { useTerraformStore } from '../store';
import { scanResources } from '../utils/securityScanner';
import { ShieldAlert, X, Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Severity } from '../types';
import type { ElementType } from 'react';

interface SecurityReportProps {
  onClose: () => void;
}

const SEVERITY_STYLES: Record<Severity, { bg: string; text: string; icon: ElementType }> = {
  critical: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
  high: { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertTriangle },
  medium: { bg: 'bg-amber-100', text: 'text-amber-800', icon: Info },
  low: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Info },
};

export function SecurityReport({ onClose }: SecurityReportProps) {
  const { resources } = useTerraformStore();
  const findings = scanResources(resources);

  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-indigo-900 text-white">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6" />
          <h2 className="text-xl font-bold">Security Analysis Report</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {findings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-emerald-50 p-4 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Vulnerabilities Found!</h3>
            <p className="text-gray-500 mt-2">Your infrastructure configuration follows basic security best practices.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex gap-3 mb-6">
              <Info className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <p className="text-sm text-indigo-800">
                These findings are based on static analysis of your configuration. Always verify settings in your cloud console before deployment.
              </p>
            </div>

            {findings.map((f, i) => {
              const Style = SEVERITY_STYLES[f.severity];
              const Icon = Style.icon;
              return (
                <div key={i} className="border border-gray-100 rounded-xl p-5 hover:border-indigo-200 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${Style.bg} ${Style.text}`}>
                        {f.severity}
                      </div>
                      <span className="text-xs font-bold text-gray-400">Rule: {f.ruleId}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${Style.text.replace('text-', 'text-opacity-80 text-')}`} />
                    <div>
                      <h4 className="font-bold text-gray-900">{f.message}</h4>
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Recommended Remediation</div>
                        <p className="text-sm text-gray-600">{f.remediation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-indigo-900 text-white rounded-lg font-semibold hover:bg-indigo-950 transition-all"
        >
          Close Report
        </button>
      </div>
    </div>
  );
}
