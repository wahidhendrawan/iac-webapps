import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Resource, ResourceType, ResourceSchema, ProviderType, ProviderSettings, AllProviderSettings, BackendConfig, DevOpsSettings, IaCTool } from './types';
import { PROVIDERS } from './data/providers';

import { ARCHITECTURE_TEMPLATES, prepareTemplateResources } from './data/templates';

interface TerraformState {
  resources: Resource[];
  selectedResourceId: string | null;
  providerSettings: AllProviderSettings;
  backend: BackendConfig | null;
  devopsSettings: DevOpsSettings;
  iacTool: IaCTool;
  theme: 'light' | 'dark';

  addResource: (type: ResourceType) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  removeResource: (id: string) => void;
  selectResource: (id: string | null) => void;
  updateProviderSettings: (provider: ProviderType, settings: Partial<ProviderSettings>) => void;
  updateBackend: (backend: BackendConfig | null) => void;
  loadTemplate: (templateId: string) => void;
  updateResourcePosition: (id: string, position: { x: number; y: number }) => void;
  updateDevOpsSettings: (settings: Partial<DevOpsSettings>) => void;
  setIaCTool: (tool: IaCTool) => void;
  toggleTheme: () => void;
}

export const useTerraformStore = create<TerraformState>()(
  persist(
    (set) => ({
      resources: [],
      selectedResourceId: null,
      providerSettings: {
        aws: { region: 'us-east-1' },
        azure: {},
        google: { project: 'my-project-id', region: 'us-central1' },
        vsphere: {
          vsphere_server: 'vcenter.example.com',
          user: 'administrator@vsphere.local',
          password: 'password',
          allow_unverified_ssl: true
        },
        local: {},
        proxmox: {},
        alibaba: {},
        huawei: {},
        sangfor: {}
      },
      backend: null,
      devopsSettings: {
        ciCdProvider: 'none',
        branchName: 'main'
      },
      iacTool: 'terraform',
      theme: 'light',

      addResource: (type: ResourceType) => {
        let schema: ResourceSchema | undefined;
        for (const provider of PROVIDERS) {
          const found = provider.resources.find(r => r.type === type);
          if (found) {
            schema = found;
            break;
          }
        }

        if (!schema) {
          console.error(`Schema not found for resource type: ${type}`);
          return;
        }

        const properties: Record<string, any> = {};
        schema.fields.forEach(field => {
          if (field.defaultValue !== undefined) {
            properties[field.name] = field.defaultValue;
          }
        });

        const newResource: Resource = {
          id: uuidv4(),
          type: type,
          name: `new_${type.split('_').pop() || 'resource'}`,
          properties: properties,
        };

        set((state) => ({
          resources: [...state.resources, newResource],
          selectedResourceId: newResource.id,
        }));
      },

      updateResource: (id, updates) => {
        set((state) => ({
          resources: state.resources.map((res) =>
            res.id === id ? { ...res, ...updates } : res
          ),
        }));
      },

      removeResource: (id) => {
        set((state) => ({
          resources: state.resources.filter((res) => res.id !== id),
          selectedResourceId: state.selectedResourceId === id ? null : state.selectedResourceId,
        }));
      },

      selectResource: (id) => {
        set({ selectedResourceId: id });
      },

      updateProviderSettings: (provider, settings) => {
        set((state) => ({
          providerSettings: {
            ...state.providerSettings,
            [provider]: { ...state.providerSettings[provider], ...settings }
          }
        }));
      },

      updateBackend: (backend) => {
        set({ backend });
      },

      loadTemplate: (templateId) => {
        const template = ARCHITECTURE_TEMPLATES.find(t => t.id === templateId);
        if (!template) return;

        const newResources = prepareTemplateResources(template);
        set((state) => ({
          resources: [...state.resources, ...newResources],
          selectedResourceId: newResources[0]?.id || null,
        }));
      },

      updateResourcePosition: (id, position) => {
        set((state) => ({
          resources: state.resources.map((res) =>
            res.id === id ? { ...res, position } : res
          ),
        }));
      },

      updateDevOpsSettings: (settings) => {
        set((state) => ({
          devopsSettings: { ...state.devopsSettings, ...settings }
        }));
      },

      setIaCTool: (tool) => {
        set({ iacTool: tool });
      },

      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
      },
    }),
    {
      name: 'iac-webapps-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
