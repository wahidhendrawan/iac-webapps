import React from 'react';
import { PROVIDERS } from '../data/providers';
import { useTerraformStore } from '../store';
import { Box, Plus, Trash2, FolderOpen, Settings } from 'lucide-react';
import clsx from 'clsx';
import type { ResourceType } from '../types';

export function Sidebar() {
  const { resources, addResource, selectResource, selectedResourceId, removeResource } = useTerraformStore();

  const handleAddResource = (type: ResourceType) => {
    addResource(type);
  };

  const handleSelect = (id: string) => {
    selectResource(id);
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeResource(id);
  };

  return (
    <aside className="w-80 bg-slate-50 border-r border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Provider List */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Available Resources</h2>
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
          {PROVIDERS.map((provider) => (
            <div key={provider.id}>
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                {provider.name}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {provider.resources.map((resource) => (
                  <button
                    key={resource.type}
                    onClick={() => handleAddResource(resource.type)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors border border-transparent hover:border-indigo-100 text-left w-full group"
                  >
                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                    <span>{resource.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Settings */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white shadow-sm z-10">
        <button
          onClick={() => selectResource('__settings__')}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all w-full border",
            selectedResourceId === '__settings__'
              ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm"
              : "text-gray-600 hover:bg-gray-50 border-transparent"
          )}
        >
          <Settings className={clsx(
            "w-4 h-4",
            selectedResourceId === '__settings__' ? "text-indigo-500" : "text-gray-400"
          )} />
          <span className="font-medium">Provider Settings</span>
        </button>
      </div>

      {/* Resource Tree */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          Project Resources
        </h2>

        {resources.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <Box className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No resources added yet.</p>
            <p className="text-xs mt-1">Select a resource above to start.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {resources.map((resource) => (
              <div
                key={resource.id}
                onClick={() => handleSelect(resource.id)}
                className={clsx(
                  "flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition-colors group border",
                  selectedResourceId === resource.id
                    ? "bg-white border-indigo-200 shadow-sm text-indigo-700"
                    : "bg-transparent border-transparent hover:bg-gray-100 text-gray-700"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Box className={clsx(
                    "w-4 h-4 flex-shrink-0",
                    selectedResourceId === resource.id ? "text-indigo-500" : "text-gray-400"
                  )} />
                  <span className="truncate font-medium">{resource.name}</span>
                  <span className="text-xs text-gray-400 font-normal truncate ml-1 opacity-70">
                    ({resource.type})
                  </span>
                </div>
                <button
                  onClick={(e) => handleRemove(e, resource.id)}
                  className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove resource"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
