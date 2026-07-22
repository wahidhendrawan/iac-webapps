import { useTerraformStore } from '../store';
import { Globe, Settings, Server, Shield, User, Lock } from 'lucide-react';
import type { ProviderType } from '../types';

export function ProviderSettings() {
  const { providerSettings, updateProviderSettings } = useTerraformStore();

  const handleUpdate = (provider: ProviderType, key: string, value: string | boolean) => {
    updateProviderSettings(provider, { [key]: value });
  };

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 overflow-y-auto p-8 transition-colors">
      <div className="mb-8 border-b dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Provider Settings</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">Configure default settings for your infrastructure providers.</p>
          </div>
        </div>
      </div>

      <div className="space-y-12 max-w-2xl">
        {/* AWS Settings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-2 border-b dark:border-slate-800 pb-2">
            <Globe className="w-5 h-5 text-orange-500" />
            AWS Configuration
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Default Region</label>
              <input
                type="text"
                value={providerSettings.aws.region || ''}
                onChange={(e) => handleUpdate('aws', 'region', e.target.value)}
                placeholder="us-east-1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Proxmox Settings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-2 border-b dark:border-slate-800 pb-2">
            <Server className="w-5 h-5 text-orange-600" />
            Proxmox Configuration
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">API URL</label>
              <input
                type="text"
                value={providerSettings.proxmox?.pm_api_url || ''}
                onChange={(e) => handleUpdate('proxmox', 'pm_api_url', e.target.value)}
                placeholder="https://proxmox.example.com:8006/api2/json"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">User</label>
                <input
                  type="text"
                  value={providerSettings.proxmox?.pm_user || ''}
                  onChange={(e) => handleUpdate('proxmox', 'pm_user', e.target.value)}
                  placeholder="root@pam"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={providerSettings.proxmox?.pm_password || ''}
                  onChange={(e) => handleUpdate('proxmox', 'pm_password', e.target.value)}
                  placeholder="password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Alibaba Cloud Settings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-2 border-b dark:border-slate-800 pb-2">
            <Globe className="w-5 h-5 text-orange-400" />
            Alibaba Cloud Configuration
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Region</label>
              <input
                type="text"
                value={providerSettings.alibaba?.region || ''}
                onChange={(e) => handleUpdate('alibaba', 'region', e.target.value)}
                placeholder="cn-hangzhou"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Access Key</label>
                <input
                  type="text"
                  value={providerSettings.alibaba?.access_key || ''}
                  onChange={(e) => handleUpdate('alibaba', 'access_key', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Secret Key</label>
                <input
                  type="password"
                  value={providerSettings.alibaba?.secret_key || ''}
                  onChange={(e) => handleUpdate('alibaba', 'secret_key', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Huawei Cloud Settings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-2 border-b dark:border-slate-800 pb-2">
            <Globe className="w-5 h-5 text-red-500" />
            Huawei Cloud Configuration
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Region</label>
              <input
                type="text"
                value={providerSettings.huawei?.region || ''}
                onChange={(e) => handleUpdate('huawei', 'region', e.target.value)}
                placeholder="cn-north-4"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Access Key</label>
                <input
                  type="text"
                  value={providerSettings.huawei?.access_key || ''}
                  onChange={(e) => handleUpdate('huawei', 'access_key', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Secret Key</label>
                <input
                  type="password"
                  value={providerSettings.huawei?.secret_key || ''}
                  onChange={(e) => handleUpdate('huawei', 'secret_key', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

         {/* Sangfor Settings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-2 border-b dark:border-slate-800 pb-2">
            <Server className="w-5 h-5 text-green-600" />
            Sangfor HCI Configuration
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Host/IP</label>
              <input
                type="text"
                value={providerSettings.sangfor?.host || ''}
                onChange={(e) => handleUpdate('sangfor', 'host', e.target.value)}
                placeholder="192.168.1.100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  value={providerSettings.sangfor?.username || ''}
                  onChange={(e) => handleUpdate('sangfor', 'username', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={providerSettings.sangfor?.password || ''}
                  onChange={(e) => handleUpdate('sangfor', 'password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Google Cloud Settings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-2 border-b dark:border-slate-800 pb-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Google Cloud Configuration
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Project ID</label>
              <input
                type="text"
                value={providerSettings.google.project || ''}
                onChange={(e) => handleUpdate('google', 'project', e.target.value)}
                placeholder="my-project-id"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Default Region</label>
              <input
                type="text"
                value={providerSettings.google.region || ''}
                onChange={(e) => handleUpdate('google', 'region', e.target.value)}
                placeholder="us-central1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
          </div>
        </section>

        {/* vSphere Settings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-2 border-b dark:border-slate-800 pb-2">
            <Server className="w-5 h-5 text-blue-600" />
            VMware vSphere Configuration
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">vSphere Server</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Server className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={providerSettings.vsphere.vsphere_server || ''}
                  onChange={(e) => handleUpdate('vsphere', 'vsphere_server', e.target.value)}
                  placeholder="vcenter.example.com"
                  className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">User</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={providerSettings.vsphere.user || ''}
                    onChange={(e) => handleUpdate('vsphere', 'user', e.target.value)}
                    placeholder="administrator@vsphere.local"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={providerSettings.vsphere.password || ''}
                    onChange={(e) => handleUpdate('vsphere', 'password', e.target.value)}
                    placeholder="password"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
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
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-slate-700 dark:bg-slate-800 rounded transition-colors"
              />
              <label htmlFor="vsphere_ssl" className="ml-2 flex items-center gap-1 text-sm text-gray-600 dark:text-slate-400 cursor-pointer">
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
