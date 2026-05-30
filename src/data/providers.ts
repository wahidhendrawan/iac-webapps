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
        description: 'Amazon EC2 virtual server (instance).',
        fields: [
          { name: 'ami', label: 'AMI ID', type: 'text', required: true, placeholder: 'ami-12345678', description: 'The Amazon Machine Image ID to use for the instance.' },
          { name: 'instance_type', label: 'Instance Type', type: 'text', required: true, defaultValue: 't2.micro', description: 'The type of instance to start (e.g., t2.micro, t3.small).' },
          { name: 'key_name', label: 'Key Pair Name', type: 'text', required: false, description: 'The name of the SSH key pair for access.' },
          { name: 'availability_zone', label: 'Availability Zone', type: 'text', required: false, description: 'The AZ where the instance should be launched.' },
        ]
      },
      {
        type: 'aws_s3_bucket',
        provider: 'aws',
        name: 'S3 Bucket',
        description: 'Amazon S3 object storage bucket.',
        fields: [
          { name: 'bucket', label: 'Bucket Name', type: 'text', required: true, description: 'The name of the bucket (must be globally unique).' },
          { name: 'acl', label: 'ACL', type: 'select', required: false, options: ['private', 'public-read', 'public-read-write', 'authenticated-read'], defaultValue: 'private', description: 'The canned ACL to apply. "private" is recommended for security.' },
          { name: 'server_side_encryption_configuration', label: 'Enable Encryption', type: 'boolean', required: false, defaultValue: false, description: 'If enabled, AWS will encrypt data at rest using AES256.' },
          { name: 'versioning', label: 'Enable Versioning', type: 'boolean', required: false, defaultValue: false, description: 'Keep multiple versions of an object in the same bucket.' },
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
        description: 'Azure Virtual Machine (Linux or Windows).',
        fields: [
          { name: 'name', label: 'VM Name', type: 'text', required: true, description: 'The name of the Virtual Machine.' },
          { name: 'location', label: 'Location', type: 'text', required: true, description: 'Azure region (e.g., East US, West Europe).' },
          { name: 'resource_group_name', label: 'Resource Group', type: 'text', required: true, description: 'The Resource Group where the VM resides.' },
          { name: 'vm_size', label: 'VM Size', type: 'text', required: true, defaultValue: 'Standard_DS1_v2', description: 'The SKU of the VM (CPU/RAM combination).' },
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
        description: 'Google Compute Engine VM instance.',
        fields: [
          { name: 'name', label: 'Instance Name', type: 'text', required: true, description: 'Unique name for the GCP instance.' },
          { name: 'machine_type', label: 'Machine Type', type: 'text', required: true, defaultValue: 'e2-medium', description: 'Machine SKU (e.g., f1-micro, n1-standard-1).' },
          { name: 'zone', label: 'Zone', type: 'text', required: true, defaultValue: 'us-central1-a', description: 'GCP Zone for placement.' },
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
        description: 'On-premise VM on VMware vSphere.',
        fields: [
          { name: 'name', label: 'VM Name', type: 'text', required: true, description: 'Inventory name of the VM.' },
          { name: 'resource_pool_id', label: 'Resource Pool ID', type: 'text', required: true, description: 'ID of the vSphere Resource Pool.' },
          { name: 'datastore_id', label: 'Datastore ID', type: 'text', required: true, description: 'ID of the target datastore.' },
          { name: 'num_cpus', label: 'CPUs', type: 'number', required: true, defaultValue: 2, description: 'Number of virtual CPUs.' },
          { name: 'memory', label: 'Memory (MB)', type: 'number', required: true, defaultValue: 4096, description: 'Total memory in Megabytes.' },
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
        description: 'Virtual machine on Proxmox VE (QEMU).',
        fields: [
          { name: 'name', label: 'VM Name', type: 'text', required: true, description: 'Descriptive name for the VM.' },
          { name: 'target_node', label: 'Target Node', type: 'text', required: true, description: 'Proxmox node name (e.g., pve1).' },
          { name: 'vmid', label: 'VM ID', type: 'number', required: false, defaultValue: 0, description: 'The ID of the VM (use 0 for auto-assign).' },
          { name: 'iso', label: 'ISO File', type: 'text', required: false, placeholder: 'local:iso/ubuntu.iso', description: 'Path to the installation ISO image.' },
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
        description: 'Alibaba Cloud Elastic Compute Service instance.',
        fields: [
          { name: 'instance_name', label: 'Instance Name', type: 'text', required: true, description: 'Name of the ECS instance.' },
          { name: 'instance_type', label: 'Instance Type', type: 'text', required: true, defaultValue: 'ecs.t5-lc1m1.small', description: 'Instance SKU.' },
          { name: 'image_id', label: 'Image ID', type: 'text', required: true, defaultValue: 'ubuntu_18_04_64_20G_alibase_20190624.vhd', description: 'OS image to boot from.' },
          { name: 'vswitch_id', label: 'VSwitch ID', type: 'text', required: true, description: 'ID of the Virtual Switch.' },
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
        description: 'Huawei Cloud Elastic Cloud Server.',
        fields: [
          { name: 'name', label: 'Instance Name', type: 'text', required: true, description: 'Name of the ECS instance.' },
          { name: 'flavor_id', label: 'Flavor ID', type: 'text', required: true, defaultValue: 's6.small.1', description: 'Computing specification (CPU/RAM).' },
          { name: 'image_id', label: 'Image ID', type: 'text', required: true, description: 'The OS image ID.' },
          { name: 'availability_zone', label: 'Availability Zone', type: 'text', required: true, description: 'Huawei Cloud AZ (e.g., cn-north-4a).' },
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
        description: 'Virtual Machine on Sangfor HCI platform.',
        fields: [
          { name: 'name', label: 'VM Name', type: 'text', required: true, description: 'Target VM name.' },
          { name: 'image_id', label: 'Image/Template ID', type: 'text', required: true, description: 'Template to clone from.' },
          { name: 'cpu_cores', label: 'CPU Cores', type: 'number', required: true, defaultValue: 2, description: 'Number of CPU cores assigned.' },
          { name: 'memory_mb', label: 'Memory (MB)', type: 'number', required: true, defaultValue: 4096, description: 'Memory size in MB.' },
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
        description: 'Create a text file on the local system.',
        fields: [
          { name: 'filename', label: 'File Path', type: 'text', required: true, description: 'Relative or absolute path for the file.' },
          { name: 'content', label: 'Content', type: 'text', required: true, description: 'The raw text content of the file.' },
        ]
      }
    ]
  },
  {
    id: 'aws',
    name: 'AWS Modules',
    resources: [
      {
        type: 'module',
        provider: 'aws',
        name: 'VPC Module',
        description: 'A pre-packaged AWS VPC with public and private subnets.',
        source: 'terraform-aws-modules/vpc/aws',
        version: '5.0.0',
        fields: [
          { name: 'name', label: 'VPC Name', type: 'text', required: true, defaultValue: 'my-vpc', description: 'Descriptive name for the network.' },
          { name: 'cidr', label: 'CIDR Block', type: 'text', required: true, defaultValue: '10.0.0.0/16', description: 'Network IP range (e.g., 10.0.0.0/16).' },
          { name: 'azs', label: 'Availability Zones', type: 'text', required: true, defaultValue: '["us-east-1a", "us-east-1b"]', description: 'List of AZs to distribute subnets.' },
          { name: 'private_subnets', label: 'Private Subnets', type: 'text', required: true, defaultValue: '["10.0.1.0/24", "10.0.2.0/24"]', description: 'IP ranges for private network layers.' },
          { name: 'public_subnets', label: 'Public Subnets', type: 'text', required: true, defaultValue: '["10.0.101.0/24", "10.0.102.0/24"]', description: 'IP ranges for internet-facing layers.' },
        ]
      }
    ]
  },
  {
    id: 'google',
    name: 'Kubernetes',
    resources: [
      {
        type: 'kubernetes_deployment',
        provider: 'google',
        name: 'K8s Deployment',
        description: 'Stateful or stateless application deployment in Kubernetes.',
        fields: [
          { name: 'name', label: 'Deployment Name', type: 'text', required: true, description: 'Unique name for the deployment.' },
          { name: 'replicas', label: 'Replicas', type: 'number', required: true, defaultValue: 3, description: 'Number of pod copies to maintain.' },
          { name: 'image', label: 'Image', type: 'text', required: true, defaultValue: 'nginx:latest', description: 'Docker image to run (e.g., nginx:latest).' },
        ]
      },
      {
        type: 'kubernetes_service',
        provider: 'google',
        name: 'K8s Service',
        description: 'An abstract way to expose an application running on a set of Pods.',
        fields: [
          { name: 'name', label: 'Service Name', type: 'text', required: true, description: 'Service discovery name.' },
          { name: 'type', label: 'Type', type: 'select', required: true, options: ['ClusterIP', 'NodePort', 'LoadBalancer'], defaultValue: 'ClusterIP', description: 'How the service is exposed (e.g., LoadBalancer for public access).' },
          { name: 'app_label', label: 'Selector Label', type: 'text', required: true, defaultValue: 'my-app', description: 'The label to match Pods for traffic routing.' },
        ]
      }
    ]
  }
];
