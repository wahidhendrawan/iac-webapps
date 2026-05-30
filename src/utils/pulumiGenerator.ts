import type { Resource, TerraformFile, ProviderType } from '../types';

export function generatePulumiFiles(resources: Resource[]): TerraformFile[] {
  const files: TerraformFile[] = [];

  // Identify used providers
  const usedProviders = new Set<ProviderType>();
  resources.forEach(res => {
    const prefix = res.type.split('_')[0];
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
    if (providerKeyMap[prefix]) {
      usedProviders.add(providerKeyMap[prefix]);
    }
  });

  // 1. package.json
  const dependencies: Record<string, string> = {
    "@pulumi/pulumi": "^3.0.0"
  };
  usedProviders.forEach(p => {
    switch(p) {
      case 'aws': dependencies["@pulumi/aws"] = "^6.0.0"; break;
      case 'azure': dependencies["@pulumi/azure-native"] = "^2.0.0"; break;
      case 'google': dependencies["@pulumi/gcp"] = "^7.0.0"; break;
      default: break;
    }
  });

  const packageJson = {
    name: "pulumi-project",
    main: "index.ts",
    dependencies
  };
  files.push({ filename: 'package.json', content: JSON.stringify(packageJson, null, 2) });

  // 2. Pulumi.yaml
  const pulumiYaml = `name: pulumi-project
runtime: nodejs
description: A Pulumi TypeScript program
`;
  files.push({ filename: 'Pulumi.yaml', content: pulumiYaml });

  // 3. index.ts
  let indexContent = `import * as pulumi from "@pulumi/pulumi";\n`;
  usedProviders.forEach(p => {
    switch(p) {
      case 'aws': indexContent += `import * as aws from "@pulumi/aws";\n`; break;
      case 'azure': indexContent += `import * as azure from "@pulumi/azure-native";\n`; break;
      case 'google': indexContent += `import * as gcp from "@pulumi/gcp";\n`; break;
    }
  });
  indexContent += `\nconst config = new pulumi.Config();\n\n`;

  // Map resources
  resources.forEach(res => {
    const parts = res.type.split('_');
    const provider = parts[0];
    
    let pulumiClass = '';

    if (provider === 'aws') {
      if (parts[1] === 'instance') pulumiClass = 'aws.ec2.Instance';
      else if (parts[1] === 's3' && parts[2] === 'bucket') pulumiClass = 'aws.s3.Bucket';
    } else if (provider === 'google') {
       if (parts[1] === 'compute' && parts[2] === 'instance') pulumiClass = 'gcp.compute.Instance';
    }

    if (!pulumiClass) {
        indexContent += `// Resource type ${res.type} not yet mapped to Pulumi\n`;
        return;
    }

    // Convert properties
    const props: Record<string, any> = {};
    Object.entries(res.properties).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      
      let formattedValue = value;
      if (typeof value === 'string') {
        // Handle Interpolation: aws_vpc.main.id -> vpc_main.id
        const refParts = value.split('.');
        if (refParts.length >= 2) {
             const target = resources.find(r => r.type === refParts[0] && r.name === refParts[1]);
             if (target) {
                const camelName = target.name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                formattedValue = `__REF__${camelName}.${refParts[2] || 'id'}`;
             } else {
                formattedValue = `"${value}"`;
             }
        } else if (value.startsWith('var.')) {
            formattedValue = `config.require("${value.replace('var.', '')}")`;
        } else {
            formattedValue = `"${value}"`;
        }
      }
      props[key] = formattedValue;
    });

    const camelResName = res.name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    let propsStr = JSON.stringify(props, null, 2);
    // Remove quotes around references and config calls
    propsStr = propsStr.replace(/"__REF__(.*?)"/g, '$1');
    propsStr = propsStr.replace(/"config\.require\((.*?)\)"/g, 'config.require($1)');

    indexContent += `const ${camelResName} = new ${pulumiClass}("${res.name}", ${propsStr});\n\n`;
  });

  // Exports
  resources.forEach(res => {
    if (res.type === 'aws_instance') {
        const camelResName = res.name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        indexContent += `export const ${camelResName}PublicIp = ${camelResName}.publicIp;\n`;
    }
  });

  files.push({ filename: 'index.ts', content: indexContent });

  return files;
}
