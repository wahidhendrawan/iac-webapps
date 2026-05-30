import { Cloud, Server, Layers, Globe, Network, Rocket, Database } from 'lucide-react';

interface AboutProps {
  onClose: () => void;
}

export function About({ onClose }: AboutProps) {
  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200 scrollbar-hide">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 z-10"
      >
        <span className="sr-only">Close</span>
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-indigo-600 p-3 rounded-xl">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">About IaC WebApps</h2>
              <p className="text-lg text-gray-500">The Ultimate Multi-IaC Visual Platform</p>
            </div>
          </div>

          <div className="prose prose-indigo max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              IaC WebApps is an advanced, multi-tool visual platform designed to revolutionize how you manage 
              Infrastructure as Code. From visual design to automated deployment, we provide the tools to build 
              modern infrastructure across any provider using <strong>Terraform, OpenTofu, or Pulumi</strong>.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  Multi-Tool Support
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                    Terraform (HCL)
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                    OpenTofu (The Open Source Fork)
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                    Pulumi (TypeScript/Software)
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
                  <Server className="w-5 h-5 text-emerald-600" />
                  Cloud & Infrastructure
                </h3>
                <p className="text-sm text-gray-500 mb-2">Native support for all major providers:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <span className="bg-white/50 px-2 py-1 rounded">AWS / Azure / GCP</span>
                  <span className="bg-white/50 px-2 py-1 rounded">VMware / Proxmox</span>
                  <span className="bg-white/50 px-2 py-1 rounded">Alibaba / Huawei</span>
                  <span className="bg-white/50 px-2 py-1 rounded">Sangfor HCI / Local</span>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Layers className="w-6 h-6 text-gray-400" />
              Advanced Ecosystem
            </h3>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-4 border border-gray-100 dark:border-slate-800 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                <Network className="w-8 h-8 text-indigo-500 mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Visual Designer</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Drag & Drop interface with synchronized editing and automated relationship mapping.
                </p>
              </div>

              <div className="p-4 border border-gray-100 dark:border-slate-800 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                <Rocket className="w-8 h-8 text-emerald-500 mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">DeepSeek AI & Ops</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Advanced AI actions that modify your project resources directly via natural language.
                </p>
              </div>

              <div className="p-4 border border-gray-100 dark:border-slate-800 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                <Database className="w-8 h-8 text-amber-500 mb-3" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Pricing</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Estimate infrastructure costs in USD and IDR with live exchange rate integration.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 text-center shadow-inner border border-white/5">
              <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Version 1.7.0</p>
              <div className="text-white text-lg">
                Created by{" "}
                <a 
                  href="https://wahidhendrawan.onrender.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                >
                  Wahid Hendrawan
                </a>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                 <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-slate-500 border border-white/10">React 19</div>
                 <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-slate-500 border border-white/10">TypeScript</div>
                 <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-slate-500 border border-white/10">Tailwind CSS</div>
                 <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-slate-500 border border-white/10">Vite</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
