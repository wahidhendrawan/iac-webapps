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
    id: 'proxmox',
    name: 'Proxmox',
    resources: [
      {
        type: 'proxmox_vm_qemu',
        provider: 'proxmox',
        name: 'VM (QEMU)',
        description: 'Proxmox QEMU Virtual Machine',
        fields: [
          { name: 'name', label: 'VM Name', type: 'text', required: true },
          { name: 'target_node', label: 'Target Node', type: 'text', required: true },
          { name: 'vmid', label: 'VM ID', type: 'number', required: false, defaultValue: 0 },
          { name: 'iso', label: 'ISO File', type: 'text', required: false, placeholder: 'local:iso/ubuntu.iso' },
        ]
      }
    ]
  },
  {
    id: 'alibaba',
    name: 'Alibaba Cloud',
    resources: [
      {
        type: 'alicloud_instance',
        provider: 'alibaba',
        name: 'ECS Instance',
        description: 'Alibaba Cloud ECS Instance',
        fields: [
          { name: 'instance_name', label: 'Instance Name', type: 'text', required: true },
          { name: 'instance_type', label: 'Instance Type', type: 'text', required: true, defaultValue: 'ecs.t5-lc1m1.small' },
          { name: 'image_id', label: 'Image ID', type: 'text', required: true, defaultValue: 'ubuntu_18_04_64_20G_alibase_20190624.vhd' },
          { name: 'vswitch_id', label: 'VSwitch ID', type: 'text', required: true },
        ]
      }
    ]
  },
  {
    id: 'huawei',
    name: 'Huawei Cloud',
    resources: [
      {
        type: 'huaweicloud_compute_instance',
        provider: 'huawei',
        name: 'ECS Instance',
        description: 'Huawei Cloud ECS Instance',
        fields: [
          { name: 'name', label: 'Instance Name', type: 'text', required: true },
          { name: 'flavor_id', label: 'Flavor ID', type: 'text', required: true, defaultValue: 's6.small.1' },
          { name: 'image_id', label: 'Image ID', type: 'text', required: true },
          { name: 'availability_zone', label: 'Availability Zone', type: 'text', required: true },
        ]
      }
    ]
  },
  {
    id: 'sangfor',
    name: 'Sangfor (HCI)',
    resources: [
      {
        type: 'sangfor_vm',
        provider: 'sangfor',
        name: 'Virtual Machine',
        description: 'Sangfor HCI Virtual Machine',
        fields: [
          { name: 'name', label: 'VM Name', type: 'text', required: true },
          { name: 'image_id', label: 'Image/Template ID', type: 'text', required: true },
          { name: 'cpu_cores', label: 'CPU Cores', type: 'number', required: true, defaultValue: 2 },
          { name: 'memory_mb', label: 'Memory (MB)', type: 'number', required: true, defaultValue: 4096 },
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
