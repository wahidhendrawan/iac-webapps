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
    id: 'aws-three-tier',
    name: 'AWS Three-Tier Network',
    description: 'VPC with Public and Private subnets using the official VPC module.',
    resources: [
      {
        type: 'module',
        name: 'vpc',
        properties: {
          name: 'production-vpc',
          cidr: '10.0.0.0/16',
          azs: '["us-east-1a", "us-east-1b"]',
          private_subnets: '["10.0.1.0/24", "10.0.2.0/24"]',
          public_subnets: '["10.0.101.0/24", "10.0.102.0/24"]',
        }
      }
    ]
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
  {
    id: 'k8s-app-stack',
    name: 'Kubernetes App Stack',
    description: 'Deployment with multiple replicas and a LoadBalancer service.',
    resources: [
      {
        type: 'kubernetes_deployment',
        name: 'frontend',
        properties: {
          name: 'web-frontend',
          replicas: 3,
          image: 'nginx:alpine',
        }
      },
      {
        type: 'kubernetes_service',
        name: 'frontend_svc',
        properties: {
          name: 'web-service',
          type: 'LoadBalancer',
          app_label: 'web-frontend',
        }
      }
    ]
  },
  {
    id: 'hybrid-cloud',
    name: 'Hybrid Cloud (AWS + Proxmox)',
    description: 'Connect on-premise Proxmox VM to AWS S3 storage.',
    resources: [
      {
        type: 'proxmox_vm_qemu',
        name: 'local_node',
        properties: {
          name: 'pve-worker-01',
          target_node: 'pve',
          iso: 'local:iso/ubuntu-server.iso'
        }
      },
      {
        type: 'aws_s3_bucket',
        name: 'cloud_backup',
        properties: {
          bucket: 'hybrid-backup-store',
          acl: 'private'
        }
      }
    ]
  }
];

export function prepareTemplateResources(template: ArchitectureTemplate): Resource[] {
  return template.resources.map(r => ({
    ...r,
    id: uuidv4(),
  }));
}
