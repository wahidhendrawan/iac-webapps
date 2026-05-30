import { v4 as uuidv4 } from 'uuid';
import type { Resource, ResourceType } from '../types';

export function parseHCL(hcl: string): Resource[] {
  const resources: Resource[] = [];
  
  // 1. Parse Resources
  const resourceRegex = /resource\s+"([^"]+)"\s+"([^"]+)"\s*\{([\s\S]*?)\n\}/g;
  let match;

  while ((match = resourceRegex.exec(hcl)) !== null) {
    const type = match[1] as ResourceType;
    const name = match[2];
    const body = match[3];

    const properties = parseProperties(body);

    resources.push({
      id: uuidv4(),
      type,
      name,
      properties,
      position: { x: Math.random() * 500, y: Math.random() * 500 }
    });
  }

  // 2. Parse Modules
  const moduleRegex = /module\s+"([^"]+)"\s*\{([\s\S]*?)\n\}/g;
  while ((match = moduleRegex.exec(hcl)) !== null) {
    const name = match[1];
    const body = match[2];

    const properties = parseProperties(body);

    resources.push({
      id: uuidv4(),
      type: 'module',
      name,
      properties,
      position: { x: Math.random() * 500, y: Math.random() * 500 }
    });
  }

  return resources;
}

function parseProperties(body: string): Record<string, any> {
  const properties: Record<string, any> = {};
  // Simple key = value regex. Handles strings, booleans, and references.
  // Note: Doesn't handle complex blocks/lists perfectly but good for basic import.
  const propLines = body.split('\n');
  
  propLines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();

      // Basic cleanup
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value === 'true') {
        value = true as any;
      } else if (value === 'false') {
        value = false as any;
      } else if (!isNaN(Number(value))) {
        value = Number(value) as any;
      }

      properties[key] = value;
    }
  });

  return properties;
}
