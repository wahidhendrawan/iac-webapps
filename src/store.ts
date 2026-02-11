import { create } from 'zustand';
import type { Resource, ResourceType, ResourceSchema, ProviderType, ProviderSettings, AllProviderSettings } from './types';
import { PROVIDERS } from './data/providers';

interface TerraformState {
  resources: Resource[];
  selectedResourceId: string | null;
  providerSettings: AllProviderSettings;

  addResource: (type: ResourceType) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  removeResource: (id: string) => void;
  selectResource: (id: string | null) => void;
  updateProviderSettings: (provider: ProviderType, settings: Partial<ProviderSettings>) => void;
}

export const useTerraformStore = create<TerraformState>((set) => ({
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

  addResource: (type: ResourceType) => {
    // Find schema across all providers
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

    // Initialize properties with default values
    const properties: Record<string, any> = {};
    schema.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        properties[field.name] = field.defaultValue;
      }
    });

    const newResource: Resource = {
      id: crypto.randomUUID(),
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
}));
