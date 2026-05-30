import type { Resource, AllProviderSettings, ProviderType, TerraformFile, BackendConfig, DevOpsSettings, IaCTool } from '../types';
import { PROVIDERS } from '../data/providers';

export function generateHCL(resources: Resource[], providerSettings: AllProviderSettings, backend: BackendConfig | null = null, devopsSettings?: DevOpsSettings, iacTool: IaCTool = 'terraform'): string {
  const files = generateTerraformFiles(resources, providerSettings, backend, devopsSettings, iacTool);
  let hcl = '';
  const versions = files.find(f => f.filename === 'versions.tf');
  if (versions) hcl += versions.content + '\n';
  const provider = files.find(f => f.filename === 'provider.tf');
  if (provider) hcl += provider.content + '\n';
  const variables = files.find(f => f.filename === 'variables.tf');
  if (variables) hcl += variables.content + '\n';
  const main = files.find(f => f.filename === 'main.tf');
  if (main) hcl += main.content + '\n';
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

  const usedProviders = new Set(resources.map(r => r.type.split('_')[0]));
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

  let versionsContent = 'terraform {\n';
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
      case 'vsphere': source = 'hashicorp/vsphere'; version = '~> 2.4'; break;
      case 'proxmox': source = 'telmate/proxmox'; version = '2.9.14'; break;
      case 'alibaba': source = 'aliyun/alicloud'; version = '~> 1.200'; break;
      case 'huawei': source = 'huaweicloud/huaweicloud'; version = '~> 1.50'; break;
      case 'sangfor': source = 'sangfor/sangfor'; version = '~> 1.0'; break;
      case 'local': source = 'hashicorp/local'; version = '~> 2.4'; break;
    }
    if (source) {
      versionsContent += `    ${p} = {\n      source  = "${source}"\n      version = "${version}"\n    }\n`;
    }
  });
  versionsContent += '  }\n}\n';
  files.push({ filename: 'versions.tf', content: versionsContent });

  let providerContent = '';
  activeProviders.forEach(p => {
    if (p === 'local') return;
    providerContent += `provider "${p}" {\n`;
    const settings = providerSettings[p];
    Object.entries(settings).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (key === 'allow_unverified_ssl') {
           providerContent += `  allow_unverified_ssl = ${value}\n`;
        } else if (typeof value === 'string' && !value.startsWith('var.')) {
           providerContent += `  ${key} = "${value}"\n`;
        } else {
           providerContent += `  ${key} = ${value}\n`;
        }
      }
    });
    providerContent += '}\n\n';
  });
  files.push({ filename: 'provider.tf', content: providerContent });

  let variablesContent = '';
  let tfvarsContent = '';
  const sensitiveKeys = ['password', 'secret', 'token', 'key', 'access_key', 'secret_key'];
  activeProviders.forEach(p => {
      const settings = providerSettings[p];
      Object.entries(settings).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            const isSensitive = sensitiveKeys.some(s => key.toLowerCase().includes(s));
            variablesContent += `variable "${p}_${key}" {\n  type = string\n${isSensitive ? '  sensitive = true\n' : ''}}\n\n`;
            tfvarsContent += `${p}_${key} = "${value}"\n`;
        }
      });
  });
  files.push({ filename: 'variables.tf', content: variablesContent });
  files.push({ filename: 'terraform.tfvars', content: tfvarsContent });

  let mainContent = '';
  resources.forEach(resource => {
    const schema = PROVIDERS.flatMap(p => p.resources).find(r => r.type === resource.type);
    const isModule = resource.type === 'module' && schema;
    if (isModule) {
      mainContent += `module "${resource.name}" {\n`;
      mainContent += `  source  = "${schema.source}"\n`;
      if (schema?.version) mainContent += `  version = "${schema.version}"\n`;
    } else {
      mainContent += `resource "${resource.type}" "${resource.name}" {\n`;
    }

    Object.entries(resource.properties).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (key === 'server_side_encryption_configuration' && value === true) {
          mainContent += `  server_side_encryption_configuration {\n    rule {\n      apply_server_side_encryption_by_default {\n        sse_algorithm = "AES256"\n      }\n    }\n  }\n`;
          return;
      }
      if (key === 'versioning' && value === true) {
          mainContent += `  versioning {\n    enabled = true\n  }\n`;
          return;
      }
      let formattedValue = value;
      if (typeof value === 'string') {
        const isReference = value.startsWith('var.') || /^[a-z0-9_]+\.[a-z0-9_]+\.[a-z0-9_]+$/.test(value) || /^[a-z0-9_]+\.[a-z0-9_]+$/.test(value);
        if (!isReference) formattedValue = `"${value}"`;
      } else if (typeof value === 'boolean') {
        formattedValue = value ? 'true' : 'false';
      }
      mainContent += `  ${key} = ${formattedValue}\n`;
    });
    mainContent += '}\n\n';
  });
  files.push({ filename: 'main.tf', content: mainContent });

  let outputsContent = '';
  resources.forEach(resource => {
      if (resource.type === 'aws_instance') {
          outputsContent += `output "${resource.name}_public_ip" {\n  value = aws_instance.${resource.name}.public_ip\n}\n\n`;
      }
  });
  files.push({ filename: 'outputs.tf', content: outputsContent });

  const gitignoreContent = `# Local .terraform directories\n**/.terraform/*\n\n# .tfstate files\n*.tfstate\n*.tfstate.*\n\n# Crash log files\ncrash.log\ncrash.*.log\n\n# Exclude all .tfvars files\n*.tfvars\n*.tfvars.json\n\n# Ignore override files\noverride.tf\noverride.tf.json\n*_override.tf\n*_override.tf.json\n\n# Ignore CLI configuration files\n.terraformrc\nterraform.rc\n`;
  files.push({ filename: '.gitignore', content: gitignoreContent });

  const readmeContent = `# ${toolName} Project\n\nGenerated by ${toolName} Builder.\n\n## Structure\n\n* \`main.tf\`: Resource definitions.\n* \`variables.tf\`: Variable declarations.\n* \`provider.tf\`: Provider configurations.\n* \`versions.tf\`: Provider version constraints.\n* \`terraform.tfvars\`: Variable values.\n* \`outputs.tf\`: Output definitions.\n\n## Usage\n\n1. Initialize ${toolName}:\n   \`\`\`bash\n   ${cmd} init\n   \`\`\`\n\n2. Plan the deployment:\n   \`\`\`bash\n   ${cmd} plan\n   \`\`\`\n\n3. Apply the changes:\n   \`\`\`bash\n   ${cmd} apply\n   \`\`\`\n`;
  files.push({ filename: 'README.md', content: readmeContent });

  if (devopsSettings.ciCdProvider === 'github') {
    const githubWorkflow = `name: ${toolName} CI/CD\n\non:\n  push:\n    branches: [ ${devopsSettings.branchName} ]\n  pull_request:\n    branches: [ ${devopsSettings.branchName} ]\n\njobs:\n  iac:\n    name: '${toolName}'\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout\n        uses: actions/checkout@v3\n\n      - name: Setup ${toolName}\n        ${iacTool === 'opentofu' ? 'uses: opentofu/setup-opentofu@v1' : 'uses: hashicorp/setup-terraform@v2'}\n        with:\n          ${iacTool === 'opentofu' ? 'tofu_version: 1.6.0' : 'terraform_version: 1.5.0'}\n\n      - name: ${toolName} Format\n        run: ${cmd} fmt -check\n\n      - name: ${toolName} Init\n        run: ${cmd} init\n\n      - name: ${toolName} Plan\n        run: ${cmd} plan -input=false\n\n      - name: ${toolName} Apply\n        if: github.ref == 'refs/heads/${devopsSettings.branchName}' && github.event_name == 'push'\n        run: ${cmd} apply -auto-approve -input=false\n`;
    files.push({ filename: '.github/workflows/iac.yml', content: githubWorkflow });
  } else if (devopsSettings.ciCdProvider === 'gitlab') {
    const gitlabCi = `image:\n  name: ${iacTool === 'opentofu' ? 'ghcr.io/opentofu/opentofu:latest' : 'hashicorp/terraform:light'}\n  entrypoint:\n    - '/usr/bin/env'\n    - 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'\n\nbefore_script:\n  - ${cmd} --version\n  - ${cmd} init\n\nstages:\n  - validate\n  - plan\n  - apply\n\nvalidate:\n  stage: validate\n  script:\n    - ${cmd} validate\n\nplan:\n  stage: plan\n  script:\n    - ${cmd} plan -out=tfplan\n  artifacts:\n    paths:\n      - tfplan\n\napply:\n  stage: apply\n  script:\n    - ${cmd} apply -auto-approve tfplan\n  only:\n    - ${devopsSettings.branchName}\n  when: manual\n`;
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
