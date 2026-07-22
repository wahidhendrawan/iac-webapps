export type ProviderType = 'aws' | 'azure' | 'google' | 'vsphere' | 'local';

export type ResourceType =
  | 'aws_instance'
  | 'aws_s3_bucket'
  | 'azurerm_virtual_machine'
  | 'google_compute_instance'
  | 'vsphere_virtual_machine'
  | 'local_file';

export interface ResourceField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'map';
  required: boolean;
  options?: string[]; // For select inputs
  defaultValue?: string | number | boolean;
  placeholder?: string;
  description?: string;
}

export interface ResourceSchema {
  type: ResourceType;
  provider: ProviderType;
  name: string;
  description: string;
  fields: ResourceField[];
}

export interface Resource {
  id: string;
  type: ResourceType;
  name: string; // The resource name in Terraform (e.g., resource "type" "name")
  properties: Record<string, unknown>;
}

export interface ProviderConfig {
  name: string;
  icon: string; // Lucide icon name or path
  color: string;
}
