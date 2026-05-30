import { useMemo, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
} from '@xyflow/react';
import type {
  Node,
  Edge,
  OnNodesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTerraformStore } from '../store';
import { Image as ImageIcon } from 'lucide-react';
import { toPng } from 'html-to-image';

export function VisualDesigner() {
  const { resources, selectedResourceId, selectResource, updateResourcePosition, theme } = useTerraformStore();
  const flowRef = useRef<HTMLDivElement>(null);

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

  const onExportImage = useCallback(() => {
    if (flowRef.current === null) return;

    toPng(flowRef.current, {
      backgroundColor: theme === 'dark' ? '#020617' : '#f8fafc',
      cacheBust: true,
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'iac-infrastructure-diagram.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Export failed', err);
      });
  }, [theme]);

  return (
    <div ref={flowRef} className="flex-1 w-full h-full min-h-[600px] bg-gray-50 dark:bg-slate-950 relative overflow-hidden transition-colors">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        fitView
        style={{ width: '100%', height: '100%' }}
      >
        <Background color={theme === 'dark' ? '#1e293b' : '#cbd5e1'} gap={20} />
        <Controls className="dark:bg-slate-900 dark:border-slate-800" />
        <Panel position="bottom-right" className="mb-4 mr-4">
            <button
                onClick={onExportImage}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-lg text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
            >
                <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Export PNG
            </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
