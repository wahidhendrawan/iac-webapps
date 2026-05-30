import type { Resource, AllProviderSettings, ProviderType, TerraformFile, BackendConfig, DevOpsSettings, IaCTool } from '../types';
import { PROVIDERS } from '../data/providers';

export function generateHCL(resources: Resource[], providerSettings: AllProviderSettings, backend: BackendConfig | null = null, devopsSettings?: DevOpsSettings, iacTool: IaCTool = 'terraform'): string {
  // Original function kept for backward compatibility and live preview
  const files = generateTerraformFiles(resources, providerSettings, backend, devopsSettings, iacTool);

  // Concatenate relevant files for the "All in One" preview
  let hcl = '';

  // Versions and Providers usually go first
  const versions = files.find(f => f.filename === 'versions.tf');
  if (versions) hcl += versions.content + '\n';

  const provider = files.find(f => f.filename === 'provider.tf');
  if (provider) hcl += provider.content + '\n';

  // Variables next
  const variables = files.find(f => f.filename === 'variables.tf');
  if (variables) hcl += variables.content + '\n';

  // Then main resources
  const main = files.find(f => f.filename === 'main.tf');
  if (main) hcl += main.content + '\n';

  // Outputs last
  const outputs = files.find(f => f.filename === 'outputs.tf');
  if (outputs) hcl += outputs.content + '\n';

  return hcl;
}

export function generateTerraformFiles(
  resources: Resource[], 
  providerSettings: AllProviderSettings, 
  backend: BackendConfig | null = null,
  devopsSettings: DevOpsSettings = { ciCdProvider: 'none', branchName: 'main' },
  iacTool: IaCTool = 'terraform'
): TerraformFile[] {
  const files: TerraformFile[] = [];
  const cmd = iacTool === 'opentofu' ? 'tofu' : 'terraform';
  const toolName = iacTool === 'opentofu' ? 'OpenTofu' : 'Terraform';

  // Identify used providers
  const usedProviders = new Set(resources.map(r => r.type.split('_')[0]));
  // Map resource prefix to provider key (e.g. 'alicloud' -> 'alibaba')
  // For standard ones it's same, for others might differ.
  // Standard: aws, google, azurerm, vsphere
  // New: proxmox (proxmox), alicloud (alibaba), huaweicloud (huawei), sangfor (sangfor)

  const providerKeyMap: Record<string, ProviderType> = {
    'aws': 'aws',
    'azurerm': 'azure',
    'google': 'google',
    'vsphere': 'vsphere',
    'proxmox': 'proxmox',
    'alicloud': 'alibaba',
    'huaweicloud': 'huawei',
    'sangfor': 'sangfor',
    'local': 'local'
  };

  const activeProviders = new Set<ProviderType>();
  usedProviders.forEach(prefix => {
    if (providerKeyMap[prefix]) {
      activeProviders.add(providerKeyMap[prefix]);
    }
  });

  // 1. versions.tf
  let versionsContent = 'terraform {\n';

  // Add backend configuration if exists
  if (backend) {
    versionsContent += `  backend "${backend.type}" {\n`;
    Object.entries(backend.properties).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        const formattedValue = typeof value === 'string' ? `"${value}"` : value;
        versionsContent += `    ${key} = ${formattedValue}\n`;
      }
    });
    versionsContent += '  }\n\n';
  }

  versionsContent += '  required_providers {\n';
  activeProviders.forEach(p => {
    let source = '';
    let version = '';

    switch(p) {
      case 'aws': source = 'hashicorp/aws'; version = '~> 5.0'; break;
      case 'azure': source = 'hashicorp/azurerm'; version = '~> 3.0'; break;
      case 'google': source = 'hashicorp/google'; version = '~> 4.0'; break;
      case 'vsphere': source = 'hashicorp/vsphere'; version = '~> 2.0'; break;
      case 'local': source = 'hashicorp/local'; version = '~> 2.0'; break;
      case 'proxmox': source = 'telmate/proxmox'; version = 'latest'; break; // Common community provider
      case 'alibaba': source = 'aliyun/alicloud'; version = 'latest'; break;
      case 'huawei': source = 'huaweicloud/huaweicloud'; version = 'latest'; break;
      case 'sangfor': source = 'sangfor/sangfor'; version = 'latest'; break; // Hypothetical/Generic
      default: source = `hashicorp/${p}`; version = 'latest';
    }

    const providerName = p === 'azure' ? 'azurerm' : (p === 'alibaba' ? 'alicloud' : (p === 'huawei' ? 'huaweicloud' : p));
    versionsContent += `    ${providerName} = {\n      source  = "${source}"\n      version = "${version}"\n    }\n`;
  });
  versionsContent += '  }\n}\n';
  files.push({ filename: 'versions.tf', content: versionsContent });


  // 2. variables.tf & terraform.tfvars
  let variablesContent = '';
  let tfvarsContent = '';
  const variables = new Set<string>();

  // Helper to add variable
  const addVariable = (name: string, description: string, sensitive = false, value?: any) => {
    if (variables.has(name)) return;
    variables.add(name);

    variablesContent += `variable "${name}" {\n  description = "${description}"\n  type        = string\n`;
    if (sensitive) variablesContent += '  sensitive   = true\n';
    variablesContent += '}\n\n';

    if (value !== undefined && value !== '') {
      tfvarsContent += `${name} = "${value}"\n`;
    }
  };

  // Add standard variables based on providers
  if (activeProviders.has('aws')) {
    addVariable('aws_region', 'AWS Region', false, providerSettings.aws.region || 'us-east-1');
  }
  if (activeProviders.has('google')) {
    addVariable('gcp_project_id', 'Google Cloud Project ID', false, providerSettings.google.project);
    addVariable('gcp_region', 'Google Cloud Region', false, providerSettings.google.region || 'us-central1');
  }
  if (activeProviders.has('vsphere')) {
    addVariable('vsphere_server', 'vSphere Server', false, providerSettings.vsphere.vsphere_server);
    addVariable('vsphere_user', 'vSphere User', false, providerSettings.vsphere.user);
    addVariable('vsphere_password', 'vSphere Password', true, providerSettings.vsphere.password);
  }
  if (activeProviders.has('proxmox')) {
    addVariable('pm_api_url', 'Proxmox API URL', false, providerSettings.proxmox?.pm_api_url);
    addVariable('pm_user', 'Proxmox User', false, providerSettings.proxmox?.pm_user);
    addVariable('pm_password', 'Proxmox Password', true, providerSettings.proxmox?.pm_password);
  }
  if (activeProviders.has('alibaba')) {
     addVariable('alicloud_access_key', 'Alibaba Access Key', true, providerSettings.alibaba?.access_key);
     addVariable('alicloud_secret_key', 'Alibaba Secret Key', true, providerSettings.alibaba?.secret_key);
     addVariable('alicloud_region', 'Alibaba Region', false, providerSettings.alibaba?.region);
  }
  if (activeProviders.has('huawei')) {
    addVariable('huaweicloud_access_key', 'Huawei Access Key', true, providerSettings.huawei?.access_key);
    addVariable('huaweicloud_secret_key', 'Huawei Secret Key', true, providerSettings.huawei?.secret_key);
    addVariable('huaweicloud_region', 'Huawei Region', false, providerSettings.huawei?.region);
  }
  if (activeProviders.has('sangfor')) {
     addVariable('sangfor_host', 'Sangfor Host', false, providerSettings.sangfor?.host);
     addVariable('sangfor_username', 'Sangfor Username', false, providerSettings.sangfor?.username);
     addVariable('sangfor_password', 'Sangfor Password', true, providerSettings.sangfor?.password);
  }

  files.push({ filename: 'variables.tf', content: variablesContent });
  files.push({ filename: 'terraform.tfvars', content: tfvarsContent });


  // 3. provider.tf
  let providerContent = '';
  activeProviders.forEach(p => {
    const providerName = p === 'azure' ? 'azurerm' : (p === 'alibaba' ? 'alicloud' : (p === 'huawei' ? 'huaweicloud' : p));
    providerContent += `provider "${providerName}" {\n`;

    if (p === 'azure') {
      providerContent += '  features {}\n';
    }

    // Configure provider using variables
    switch (p) {
      case 'aws':
        providerContent += '  region = var.aws_region\n';
        break;
      case 'google':
        providerContent += '  project = var.gcp_project_id\n';
        providerContent += '  region  = var.gcp_region\n';
        break;
      case 'vsphere':
        providerContent += '  vsphere_server = var.vsphere_server\n';
        providerContent += '  user           = var.vsphere_user\n';
        providerContent += '  password       = var.vsphere_password\n';
        if (providerSettings.vsphere.allow_unverified_ssl) {
          providerContent += '  allow_unverified_ssl = true\n';
        }
        break;
      case 'proxmox':
        providerContent += '  pm_api_url = var.pm_api_url\n';
        providerContent += '  pm_user    = var.pm_user\n';
        providerContent += '  pm_password = var.pm_password\n';
         if (providerSettings.proxmox?.pm_tls_insecure) {
          providerContent += '  pm_tls_insecure = true\n';
        }
        break;
      case 'alibaba':
        providerContent += '  access_key = var.alicloud_access_key\n';
        providerContent += '  secret_key = var.alicloud_secret_key\n';
        providerContent += '  region     = var.alicloud_region\n';
        break;
      case 'huawei':
        providerContent += '  access_key = var.huaweicloud_access_key\n';
        providerContent += '  secret_key = var.huaweicloud_secret_key\n';
        providerContent += '  region     = var.huaweicloud_region\n';
        break;
      case 'sangfor':
        providerContent += '  host     = var.sangfor_host\n';
        providerContent += '  username = var.sangfor_username\n';
        providerContent += '  password = var.sangfor_password\n';
        break;
    }

    providerContent += '}\n\n';
  });
  files.push({ filename: 'provider.tf', content: providerContent });


  // 4. main.tf
  let mainContent = '';
  resources.forEach(resource => {
    // Find schema to check if it's a module and get source/version
    const schema = PROVIDERS.flatMap(p => p.resources).find(r => r.type === resource.type);
    const isModule = resource.type === 'module' && schema;

    if (isModule) {
      mainContent += `module "${resource.name}" {\n`;
      mainContent += `  source  = "${schema.source}"\n`;
      if (schema?.version) {
        mainContent += `  version = "${schema.version}"\n`;
      }
    } else {
      mainContent += `resource "${resource.type}" "${resource.name}" {\n`;
    }

    Object.entries(resource.properties).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;

      let formattedValue = value;
      
      if (typeof value === 'string') {
        // Check if it's a reference (e.g., aws_vpc.main.id or var.region)
        const isReference = value.startsWith('var.') || 
                          /^[a-z0-9_]+\.[a-z0-9_]+\.[a-z0-9_]+$/.test(value) ||
                          /^[a-z0-9_]+\.[a-z0-9_]+$/.test(value);

        if (!isReference) {
          formattedValue = `"${value}"`;
        }
      } else if (typeof value === 'boolean') {
        formattedValue = value ? 'true' : 'false';
      }

      mainContent += `  ${key} = ${formattedValue}\n`;
    });

    mainContent += '}\n\n';
  });
  files.push({ filename: 'main.tf', content: mainContent });

  // 5. outputs.tf
  let outputsContent = '';
  // Generate some sample outputs based on resources
  resources.forEach(resource => {
      if (resource.type === 'aws_instance') {
          outputsContent += `output "${resource.name}_public_ip" {\n  value = aws_instance.${resource.name}.public_ip\n}\n\n`;
      }
      // Add more specific outputs as needed
  });
  files.push({ filename: 'outputs.tf', content: outputsContent });

  // 6. .gitignore
  const gitignoreContent = `# Local .terraform directories
**/.terraform/*

# .tfstate files
*.tfstate
*.tfstate.*

# Crash log files
crash.log
crash.*.log

# Exclude all .tfvars files, which are likely to contain sensitive data, such as
# password, private keys, and other secrets. These should not be part of version
# control as they are data points which are potentially sensitive and subject
# to change depending on the environment.
*.tfvars
*.tfvars.json

# Ignore override files as they are usually used to override resources locally and so
# are not checked in
override.tf
override.tf.json
*_override.tf
*_override.tf.json

# Include override files you do wish to add to version control using negated pattern
# !example_override.tf

# Include tfplan files to ignore the plan output of command: terraform plan -out=tfplan
# example: *tfplan*

# Ignore CLI configuration files
.terraformrc
terraform.rc
`;
  files.push({ filename: '.gitignore', content: gitignoreContent });

  // 7. README.md
  const readmeContent = `# ${toolName} Project

Generated by ${toolName} Builder.

## Structure

* \`main.tf\`: Resource definitions.
* \`variables.tf\`: Variable declarations.
* \`provider.tf\`: Provider configurations.
* \`versions.tf\`: Provider version constraints.
* \`terraform.tfvars\`: Variable values (sensitive).
* \`outputs.tf\`: Output definitions.

## Usage

1. Initialize ${toolName}:
   \`\`\`bash
   ${cmd} init
   \`\`\`

2. Plan the deployment:
   \`\`\`bash
   ${cmd} plan
   \`\`\`

3. Apply the changes:
   \`\`\`bash
   ${cmd} apply
   \`\`\`
`;
  files.push({ filename: 'README.md', content: readmeContent });

  // 8. CI/CD Files
  if (devopsSettings.ciCdProvider === 'github') {
    const githubWorkflow = `name: ${toolName} CI/CD

on:
  push:
    branches: [ ${devopsSettings.branchName} ]
  pull_request:
    branches: [ ${devopsSettings.branchName} ]

jobs:
  iac:
    name: '${toolName}'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup ${toolName}
        ${iacTool === 'opentofu' ? 'uses: opentofu/setup-opentofu@v1' : 'uses: hashicorp/setup-terraform@v2'}
        with:
          ${iacTool === 'opentofu' ? 'tofu_version: 1.6.0' : 'terraform_version: 1.5.0'}

      - name: ${toolName} Format
        run: ${cmd} fmt -check

      - name: ${toolName} Init
        run: ${cmd} init

      - name: ${toolName} Plan
        run: ${cmd} plan -input=false

      - name: ${toolName} Apply
        if: github.ref == 'refs/heads/${devopsSettings.branchName}' && github.event_name == 'push'
        run: ${cmd} apply -auto-approve -input=false
`;
    files.push({ filename: '.github/workflows/iac.yml', content: githubWorkflow });
  } else if (devopsSettings.ciCdProvider === 'gitlab') {
    const gitlabCi = `image:
  name: ${iacTool === 'opentofu' ? 'ghcr.io/opentofu/opentofu:latest' : 'hashicorp/terraform:light'}
  entrypoint:
    - '/usr/bin/env'
    - 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'

before_script:
  - ${cmd} --version
  - ${cmd} init

stages:
  - validate
  - plan
  - apply

validate:
  stage: validate
  script:
    - ${cmd} validate

plan:
  stage: plan
  script:
    - ${cmd} plan -out=tfplan
  artifacts:
    paths:
      - tfplan

apply:
  stage: apply
  script:
    - ${cmd} apply -auto-approve tfplan
  only:
    - ${devopsSettings.branchName}
  when: manual
`;
    files.push({ filename: '.gitlab-ci.yml', content: gitlabCi });
  }

  return files;
}

export function validateResources(resources: Resource[]): { id: string; field: string }[] {
  const errors: { id: string; field: string }[] = [];

  resources.forEach(res => {
    const schema = PROVIDERS.flatMap(p => p.resources).find(r => r.type === res.type);
    if (!schema) return;

    schema.fields.forEach(field => {
      if (field.required && (res.properties[field.name] === undefined || res.properties[field.name] === '')) {
        errors.push({ id: res.id, field: field.name });
      }
    });
  });

  return errors;
}
