import type { Resource, AllProviderSettings, ProviderType } from '../types';

export function generateHCL(resources: Resource[], providerSettings: AllProviderSettings): string {
  let hcl = '';

  // Group resources by provider for provider blocks (simplified for now)
  const providers = new Set(resources.map(r => r.type.split('_')[0]));

  hcl += 'terraform {\n  required_providers {\n';
  providers.forEach(p => {
    let source = '';
    let version = '';

    switch(p) {
      case 'aws': source = 'hashicorp/aws'; version = '~> 5.0'; break;
      case 'azurerm': source = 'hashicorp/azurerm'; version = '~> 3.0'; break;
      case 'google': source = 'hashicorp/google'; version = '~> 4.0'; break;
      case 'vsphere': source = 'hashicorp/vsphere'; version = '~> 2.0'; break;
      case 'local': source = 'hashicorp/local'; version = '~> 2.0'; break;
      default: source = `hashicorp/${p}`; version = 'latest';
    }

    // Fix for azure provider name in terraform block
    const providerName = p === 'azurerm' ? 'azurerm' : p;

    hcl += `    ${providerName} = {\n      source  = "${source}"\n      version = "${version}"\n    }\n`;
  });
  hcl += '  }\n}\n\n';

  // Add provider blocks
  providers.forEach(p => {
    const providerName = p === 'azurerm' ? 'azurerm' : p;
    hcl += `provider "${providerName}" {\n`;

    const settingsKey = (p === 'azurerm' ? 'azure' : p) as ProviderType;
    const settings = providerSettings[settingsKey];

    if (p === 'azurerm') {
      hcl += '  features {}\n';
    }

    if (settings) {
      Object.entries(settings).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;

        let formattedValue = value;
        if (typeof value === 'string') {
          formattedValue = `"${value}"`;
        } else if (typeof value === 'boolean') {
          formattedValue = value ? 'true' : 'false';
        }

        hcl += `  ${key} = ${formattedValue}\n`;
      });
    }

    hcl += '}\n\n';
  });

  // Add resources
  resources.forEach(resource => {
    hcl += `resource "${resource.type}" "${resource.name}" {\n`;

    Object.entries(resource.properties).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;

      let formattedValue = value;
      if (typeof value === 'string') {
        formattedValue = `"${value}"`;
      } else if (typeof value === 'boolean') {
        formattedValue = value ? 'true' : 'false';
      }

      hcl += `  ${key} = ${formattedValue}\n`;
    });

    hcl += '}\n\n';
  });

  return hcl;
}
