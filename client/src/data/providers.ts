import type { ResourceSchema, ProviderType } from '../types';

export interface Provider {
  id: ProviderType;
  name: string;
  resources: ResourceSchema[];
}

export const PROVIDERS: Provider[] = [
  {
    id: 'aws',
    name: 'AWS',
    resources: [
      {
        type: 'aws_instance',
        provider: 'aws',
        name: 'EC2 Instance',
        description: 'Amazon EC2 Instance',
        fields: [
          { name: 'ami', label: 'AMI ID', type: 'text', required: true, placeholder: 'ami-12345678' },
          { name: 'instance_type', label: 'Instance Type', type: 'text', required: true, defaultValue: 't2.micro' },
          { name: 'key_name', label: 'Key Pair Name', type: 'text', required: false },
          { name: 'availability_zone', label: 'Availability Zone', type: 'text', required: false },
        ]
      },
      {
        type: 'aws_s3_bucket',
        provider: 'aws',
        name: 'S3 Bucket',
        description: 'Amazon S3 Bucket',
        fields: [
          { name: 'bucket', label: 'Bucket Name', type: 'text', required: true },
          { name: 'acl', label: 'ACL', type: 'select', required: false, options: ['private', 'public-read', 'public-read-write', 'authenticated-read'], defaultValue: 'private' },
        ]
      }
    ]
  },
  {
    id: 'azure',
    name: 'Azure',
    resources: [
      {
        type: 'azurerm_virtual_machine',
        provider: 'azure',
        name: 'Virtual Machine',
        description: 'Azure Virtual Machine',
        fields: [
          { name: 'name', label: 'VM Name', type: 'text', required: true },
          { name: 'location', label: 'Location', type: 'text', required: true },
          { name: 'resource_group_name', label: 'Resource Group', type: 'text', required: true },
          { name: 'vm_size', label: 'VM Size', type: 'text', required: true, defaultValue: 'Standard_DS1_v2' },
        ]
      }
    ]
  },
  {
    id: 'google',
    name: 'Google Cloud',
    resources: [
      {
        type: 'google_compute_instance',
        provider: 'google',
        name: 'Compute Instance',
        description: 'GCP Compute Engine Instance',
        fields: [
          { name: 'name', label: 'Instance Name', type: 'text', required: true },
          { name: 'machine_type', label: 'Machine Type', type: 'text', required: true, defaultValue: 'e2-medium' },
          { name: 'zone', label: 'Zone', type: 'text', required: true, defaultValue: 'us-central1-a' },
        ]
      }
    ]
  },
  {
    id: 'vsphere',
    name: 'VMware vSphere',
    resources: [
      {
        type: 'vsphere_virtual_machine',
        provider: 'vsphere',
        name: 'Virtual Machine',
        description: 'vSphere Virtual Machine',
        fields: [
          { name: 'name', label: 'VM Name', type: 'text', required: true },
          { name: 'resource_pool_id', label: 'Resource Pool ID', type: 'text', required: true },
          { name: 'datastore_id', label: 'Datastore ID', type: 'text', required: true },
          { name: 'num_cpus', label: 'CPUs', type: 'number', required: true, defaultValue: 2 },
          { name: 'memory', label: 'Memory (MB)', type: 'number', required: true, defaultValue: 4096 },
        ]
      }
    ]
  },
  {
    id: 'local',
    name: 'Local',
    resources: [
      {
        type: 'local_file',
        provider: 'local',
        name: 'Local File',
        description: 'Create a local file',
        fields: [
          { name: 'filename', label: 'File Path', type: 'text', required: true },
          { name: 'content', label: 'Content', type: 'text', required: true },
        ]
      }
    ]
  }
];
