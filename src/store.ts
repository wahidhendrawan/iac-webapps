import { create } from 'zustand';
import type { Resource, ResourceType, ResourceSchema } from './types';
import { PROVIDERS } from './data/providers';

interface TerraformState {
  resources: Resource[];
  selectedResourceId: string | null;

  addResource: (type: ResourceType) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  removeResource: (id: string) => void;
  selectResource: (id: string | null) => void;
}

export const useTerraformStore = create<TerraformState>((set) => ({
  resources: [],
  selectedResourceId: null,

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
}));
