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

    // Convert properties to TypeScript expressions; literals go through JSON.stringify so user text stays inside its string.
    const props = Object.entries(res.properties)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `  ${JSON.stringify(key)}: ${toPulumiExpression(value, resources)}`);
    const propsStr = props.length ? `{\n${props.join(',\n')}\n}` : '{}';
    const camelResName = res.name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

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

function toPulumiExpression(value: unknown, resources: Resource[]): string {
  // Handle Interpolation: aws_vpc.main.id -> main.id, var.x -> config.require("x")
  const ref = typeof value === 'string' ? /^([a-z0-9_]+)\.([A-Za-z_]\w*)(?:\.([A-Za-z_]\w*))?$/.exec(value) : null;
  if (ref) {
    if (ref[1] === 'var' && !ref[3]) return `config.require(${JSON.stringify(ref[2])})`;
    const target = resources.find(r => r.type === ref[1] && r.name === ref[2]);
    if (target) return `${target.name.replace(/_([a-z])/g, (g) => g[1].toUpperCase())}.${ref[3] || 'id'}`;
  }
  return JSON.stringify(value, null, 2).replace(/\n/g, '\n  ');
}
