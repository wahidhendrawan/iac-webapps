import { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
} from '@xyflow/react';
import type {
  Node,
  Edge,
  OnNodesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTerraformStore } from '../store';

export function VisualDesigner() {
  const { resources, selectedResourceId, selectResource, updateResourcePosition } = useTerraformStore();

  // Convert resources to React Flow nodes
  const nodes: Node[] = useMemo(() => {
    return resources.map((res, index) => ({
      id: res.id,
      data: { label: res.name, type: res.type },
      position: res.position || { x: index * 250, y: 100 },
      type: 'default',
      style: {
        background: res.id === selectedResourceId ? '#eef2ff' : '#fff',
        borderColor: res.id === selectedResourceId ? '#4f46e5' : '#e5e7eb',
        borderWidth: '2px',
        borderRadius: '12px',
        padding: '10px',
        width: 180,
        boxShadow: res.id === selectedResourceId ? '0 10px 15px -3px rgba(79, 70, 229, 0.1)' : 'none',
      },
    }));
  }, [resources, selectedResourceId]);

  // Generate edges based on interpolation/dependencies
  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];
    resources.forEach(res => {
      Object.entries(res.properties).forEach(([, value]) => {
        if (typeof value === 'string') {
          // Check if value refers to another resource (e.g., aws_vpc.main.id)
          const parts = value.split('.');
          if (parts.length >= 2) {
            const targetResource = resources.find(r => r.type === parts[0] && r.name === parts[1]);
            if (targetResource) {
              result.push({
                id: `edge-${targetResource.id}-${res.id}`,
                source: targetResource.id,
                target: res.id,
                animated: true,
                style: { stroke: '#4f46e5' },
              });
            }
          }
        }
      });
    });
    return result;
  }, [resources]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      changes.forEach(change => {
        if (change.type === 'position' && change.position) {
            updateResourcePosition(change.id, change.position);
        }
      });
    },
    [updateResourcePosition]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    selectResource(node.id);
  }, [selectResource]);

  return (
    <div className="flex-1 w-full h-full min-h-[600px] bg-gray-50 relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        fitView
        style={{ width: '100%', height: '100%' }}
      >
        <Background color="#cbd5e1" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
