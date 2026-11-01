import { v4 as uuidv4 } from 'uuid';
import type { Resource, ResourceType } from '../types';
import { PROVIDERS } from '../data/providers';
import { validateResourceName } from './security';

const RESOURCE_TYPES = new Set<string>(PROVIDERS.flatMap(p => p.resources).map(r => r.type).filter(t => t !== 'module'));

/** Imported blocks the designer cannot represent (unknown type or invalid name) are returned in `skipped`. */
export function parseHCL(hcl: string): { resources: Resource[]; skipped: string[] } {
  const resources: Resource[] = [];
  const skipped: string[] = [];
  
  // 1. Parse Resources
  const resourceRegex = /resource\s+"([^"]+)"\s+"([^"]+)"\s*\{([\s\S]*?)\n\}/g;
  let match;

  while ((match = resourceRegex.exec(hcl)) !== null) {
    const [, type, name, body] = match;
    if (!RESOURCE_TYPES.has(type) || !validateResourceName(name)) {
      skipped.push(`${type}.${name}`);
      continue;
    }

    const properties = parseProperties(body);

    resources.push({
      id: uuidv4(),
      type: type as ResourceType,
      name,
      properties,
      position: { x: Math.random() * 500, y: Math.random() * 500 }
    });
  }

  // 2. Parse Modules
  const moduleRegex = /module\s+"([^"]+)"\s*\{([\s\S]*?)\n\}/g;
  while ((match = moduleRegex.exec(hcl)) !== null) {
    const [, name, body] = match;
    if (!validateResourceName(name)) {
      skipped.push(`module.${name}`);
      continue;
    }

    const properties = parseProperties(body);

    resources.push({
      id: uuidv4(),
      type: 'module',
      name,
      properties,
      position: { x: Math.random() * 500, y: Math.random() * 500 }
    });
  }

  return { resources, skipped };
}

function parseProperties(body: string): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  // Simple key = value regex. Handles strings, booleans, and references.
  // Note: Doesn't handle complex blocks/lists perfectly but good for basic import.
  const propLines = body.split('\n');
  
  propLines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      if (!/^[A-Za-z_][\w-]*$/.test(key)) return;
      let value: string | boolean | number = parts.slice(1).join('=').trim();

      // Basic cleanup
      if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else if (typeof value === 'string' && !isNaN(Number(value))) {
        value = Number(value);
      }

      properties[key] = value;
    }
  });

  return properties;
}
