import type { Resource } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface ArchitectureTemplate {
  id: string;
  name: string;
  description: string;
  resources: Omit<Resource, 'id'>[];
}

export const ARCHITECTURE_TEMPLATES: ArchitectureTemplate[] = [
  {
    id: 'aws-basic-web',
    name: 'AWS Basic Web Server',
    description: 'EC2 Instance with an S3 Bucket for static assets.',
    resources: [
      {
        type: 'aws_instance',
        name: 'web_server',
        properties: {
          ami: 'ami-0c55b159cbfafe1f0',
          instance_type: 't2.micro',
        },
      },
      {
        type: 'aws_s3_bucket',
        name: 'assets_bucket',
        properties: {
          bucket: 'my-app-static-assets',
          acl: 'private',
        },
      },
    ],
  },
  {
    id: 'azure-basic-vm',
    name: 'Azure Virtual Machine',
    description: 'Standard Azure VM with basic configuration.',
    resources: [
      {
        type: 'azurerm_virtual_machine',
        name: 'linux_vm',
        properties: {
          name: 'web-vm',
          location: 'East US',
          resource_group_name: 'production-rg',
          vm_size: 'Standard_DS1_v2',
        },
      },
    ],
  },
  {
    id: 'gcp-standard-compute',
    name: 'GCP Compute Instance',
    description: 'Standard Google Compute Engine instance.',
    resources: [
      {
        type: 'google_compute_instance',
        name: 'backend_server',
        properties: {
          name: 'backend-01',
          machine_type: 'e2-medium',
          zone: 'us-central1-a',
        },
      },
    ],
  },
];

export function prepareTemplateResources(template: ArchitectureTemplate): Resource[] {
  return template.resources.map(r => ({
    ...r,
    id: uuidv4(),
  }));
}
