import { Cloud, Server, Code, Layers, Globe, Box, Info } from 'lucide-react';

interface AboutProps {
  onClose: () => void;
}

export function About({ onClose }: AboutProps) {
  return (
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200 scrollbar-hide">
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
              <h2 className="text-3xl font-bold text-gray-900">About TerraForm Builder</h2>
              <p className="text-lg text-gray-500">Visual Infrastructure as Code Generator</p>
            </div>
          </div>

          <div className="prose prose-indigo max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              TerraForm Builder is a modern, open-source web application designed to simplify the creation of
              Infrastructure as Code (IaC) configurations. Whether you're managing multi-cloud environments
              or on-premise infrastructure, our tool provides an intuitive visual interface to generate
              syntactically correct Terraform code instantly.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  Multi-Cloud Support
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    AWS (Amazon Web Services)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    Microsoft Azure
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    Google Cloud Platform (GCP)
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
                  <Server className="w-5 h-5 text-emerald-600" />
                  More Providers
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    VMware vSphere
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Proxmox VE
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Alibaba Cloud
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Huawei Cloud
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Sangfor HCI
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Local File System
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Layers className="w-6 h-6 text-gray-400" />
              Key Features
            </h3>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                <Code className="w-8 h-8 text-indigo-500 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Real-time Generation</h4>
                <p className="text-sm text-gray-500">
                  Instantly see the Terraform HCL code update as you configure resources.
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                <Box className="w-8 h-8 text-indigo-500 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">All-in-One Project</h4>
                <p className="text-sm text-gray-500">
                  Generate and download a complete Terraform project structure (ZIP) with one click.
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                <Info className="w-8 h-8 text-indigo-500 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Schema Validation</h4>
                <p className="text-sm text-gray-500">
                  Built-in schemas ensure you provide the correct properties for each resource.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center text-sm text-gray-500">
              <p>Built with React, TypeScript, Vite, and Docker.</p>
              <p className="mt-1">Version 1.0.0</p>
            </div>
          </div>
        </div>
    </div>
  );
}
