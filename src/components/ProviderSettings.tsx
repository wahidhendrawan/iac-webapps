import React from 'react';
import { useTerraformStore } from '../store';
import { Globe, Settings, Server, Shield, User, Lock } from 'lucide-react';
import type { ProviderType } from '../types';

export function ProviderSettings() {
  const { providerSettings, updateProviderSettings } = useTerraformStore();

  const handleUpdate = (provider: ProviderType, key: string, value: any) => {
    updateProviderSettings(provider, { [key]: value });
  };

  return (
    <div className="flex-1 bg-white border-l border-gray-200 overflow-y-auto p-8">
      <div className="mb-8 border-b pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Provider Settings</h2>
            <p className="text-sm text-gray-500">Configure default settings for your infrastructure providers.</p>
          </div>
        </div>
      </div>

      <div className="space-y-12 max-w-2xl">
        {/* AWS Settings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
            <Globe className="w-5 h-5 text-orange-500" />
            AWS Configuration
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Region</label>
              <input
                type="text"
                value={providerSettings.aws.region || ''}
                onChange={(e) => handleUpdate('aws', 'region', e.target.value)}
                placeholder="us-east-1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Google Cloud Settings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Google Cloud Configuration
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project ID</label>
              <input
                type="text"
                value={providerSettings.google.project || ''}
                onChange={(e) => handleUpdate('google', 'project', e.target.value)}
                placeholder="my-project-id"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Region</label>
              <input
                type="text"
                value={providerSettings.google.region || ''}
                onChange={(e) => handleUpdate('google', 'region', e.target.value)}
                placeholder="us-central1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
          </div>
        </section>

        {/* vSphere Settings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
            <Server className="w-5 h-5 text-blue-600" />
            VMware vSphere Configuration
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">vSphere Server</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Server className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={providerSettings.vsphere.vsphere_server || ''}
                  onChange={(e) => handleUpdate('vsphere', 'vsphere_server', e.target.value)}
                  placeholder="vcenter.example.com"
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={providerSettings.vsphere.user || ''}
                    onChange={(e) => handleUpdate('vsphere', 'user', e.target.value)}
                    placeholder="administrator@vsphere.local"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={providerSettings.vsphere.password || ''}
                    onChange={(e) => handleUpdate('vsphere', 'password', e.target.value)}
                    placeholder="password"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="vsphere_ssl"
                checked={!!providerSettings.vsphere.allow_unverified_ssl}
                onChange={(e) => handleUpdate('vsphere', 'allow_unverified_ssl', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="vsphere_ssl" className="ml-2 flex items-center gap-1 text-sm text-gray-600 cursor-pointer">
                <Shield className="w-3.5 h-3.5" />
                Allow Unverified SSL
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
