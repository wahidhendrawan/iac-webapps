export type ProviderType = 'aws' | 'azure' | 'google' | 'vsphere' | 'proxmox' | 'alibaba' | 'huawei' | 'sangfor' | 'local';

export type ResourceType =
  | 'aws_instance'
  | 'aws_s3_bucket'
  | 'azurerm_virtual_machine'
  | 'google_compute_instance'
  | 'vsphere_virtual_machine'
  | 'proxmox_vm_qemu'
  | 'alicloud_instance'
  | 'huaweicloud_compute_instance'
  | 'sangfor_vm'
  | 'local_file'
  | 'module';

export interface TerraformFile {
  filename: string;
  content: string;
}

export interface ResourceField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'map';
  required: boolean;
  options?: string[]; // For select inputs
  defaultValue?: any;
  placeholder?: string;
  description?: string;
}

export interface ResourceSchema {
  type: ResourceType;
  provider: ProviderType;
  name: string;
  description: string;
  fields: ResourceField[];
  source?: string; // For modules
  version?: string; // For modules
}

export interface Resource {
  id: string;
  type: ResourceType;
  name: string; // The resource name in Terraform (e.g., resource "type" "name")
  properties: Record<string, any>;
  position?: { x: number; y: number };
}

export interface ProviderConfig {
  name: string;
  icon: string; // Lucide icon name or path
  color: string;
}

export interface ProviderSettings {
  region?: string;
  project?: string;
  vsphere_server?: string;
  user?: string;
  password?: string;
  allow_unverified_ssl?: boolean;
  // Proxmox
  pm_api_url?: string;
  pm_user?: string;
  pm_password?: string;
  pm_tls_insecure?: boolean;
  // Alibaba
  access_key?: string;
  secret_key?: string;
  // Huawei
  domain_name?: string;
  tenant_name?: string;
  // Sangfor (Generic)
  host?: string;
  username?: string;
}

export type AllProviderSettings = Record<ProviderType, ProviderSettings>;

export type BackendType = 's3' | 'gcs' | 'azurerm' | 'kubernetes' | 'local' | 'remote';

export interface BackendConfig {
  type: BackendType;
  properties: Record<string, any>;
}

export type CICDProvider = 'none' | 'github' | 'gitlab';

export interface DevOpsSettings {
  ciCdProvider: CICDProvider;
  branchName: string;
}

export type IaCTool = 'terraform' | 'opentofu' | 'pulumi';

export type AIProvider = 'simulation' | 'deepseek' | 'openai';

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
}

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityFinding {
  ruleId: string;
  resourceId: string;
  severity: Severity;
  message: string;
  remediation: string;
}
