import { describe, it, expect } from 'vitest';
import { generateHCL, generateTerraformFiles } from './generator';
import { generatePulumiFiles } from './pulumiGenerator';
import { generateHelmFiles } from './helmGenerator';
import type { AllProviderSettings, Resource } from '../types';

const providers = (overrides: Partial<AllProviderSettings> = {}): AllProviderSettings => ({
  aws: { region: 'us-east-1' }, azure: {}, google: {}, vsphere: {}, local: {},
  proxmox: {}, alibaba: {}, huawei: {}, sangfor: {},
  ...overrides,
});

const res = (type: Resource['type'], name: string, properties: Record<string, unknown>): Resource =>
  ({ id: name, type, name, properties });

const file = (files: { filename: string; content: string }[], name: string) =>
  files.find(f => f.filename === name)?.content ?? '';

// Values that break out of a quoted string or trigger template interpolation.
const QUOTE_BREAKOUT = 'x"\n}\nresource "null_resource" "pwn" {\n  y = "';
const INTERPOLATION = '${file("/etc/passwd")}';

describe('generateTerraformFiles escaping', () => {
  const main = (properties: Record<string, unknown>, extra: Resource[] = []) =>
    file(generateTerraformFiles([res('aws_s3_bucket', 'b', properties), ...extra], providers()), 'main.tf');

  it('escapes quotes, newlines and ${ in string values', () => {
    const out = main({ bucket: QUOTE_BREAKOUT, acl: INTERPOLATION });
    expect(out).toContain('bucket = "x\\"\\n}\\nresource \\"null_resource\\" \\"pwn\\" {\\n  y = \\""');
    expect(out).toContain('acl = "$${file(\\"/etc/passwd\\")}"');
    expect(out).not.toMatch(/^resource "null_resource"/m);
  });

  it('quotes dotted literals and keeps only strict references bare', () => {
    const out = file(generateTerraformFiles([
      res('aws_instance', 'web', { instance_type: 't2.micro', ami: 'var.ami', subnet_id: 'aws_subnet.main.id', key_name: 'var.x"\ny = "z' }),
    ], providers()), 'main.tf');
    expect(out).toContain('instance_type = "t2.micro"');
    expect(out).toContain('ami = var.ami');
    expect(out).toContain('subnet_id = aws_subnet.main.id');
    expect(out).toContain('key_name = "var.x\\"\\ny = \\"z"');
  });

  it('emits JSON string arrays as HCL lists', () => {
    const out = file(generateTerraformFiles([res('module', 'vpc', { azs: '["us-east-1a", "a\\"b"]' })], providers()), 'main.tf');
    expect(out).toContain('azs = ["us-east-1a", "a\\"b"]');
  });

  it('escapes backend values', () => {
    const files = generateTerraformFiles([], providers(), { type: 's3', properties: { bucket: 'a"b', key: '${x}' } });
    const versions = file(files, 'versions.tf');
    expect(versions).toContain('bucket = "a\\"b"');
    expect(versions).toContain('key = "$${x}"');
  });
});

describe('generateTerraformFiles provider credentials', () => {
  const settings = providers({ vsphere: { vsphere_server: 'vc.local', user: 'admin', password: 's3cr"et', allow_unverified_ssl: false } });
  const files = generateTerraformFiles([res('vsphere_virtual_machine', 'vm', { name: 'vm1' })], settings);

  it('references sensitive variables instead of writing secrets into provider.tf', () => {
    const provider = file(files, 'provider.tf');
    expect(provider).toContain('password = var.vsphere_password');
    expect(provider).toContain('vsphere_server = "vc.local"');
    expect(provider).toContain('allow_unverified_ssl = false');
    expect(provider).not.toContain('s3cr');
  });

  it('declares the variable sensitive and puts the escaped value only in terraform.tfvars', () => {
    expect(file(files, 'variables.tf')).toContain('variable "vsphere_password" {\n  type = string\n  sensitive = true\n}');
    expect(file(files, 'terraform.tfvars')).toContain('vsphere_password = "s3cr\\"et"');
    expect(generateHCL([res('vsphere_virtual_machine', 'vm', { name: 'vm1' })], settings)).not.toContain('s3cr');
  });
});

describe('generatePulumiFiles escaping', () => {
  const index = (resources: Resource[]) => file(generatePulumiFiles(resources), 'index.ts');

  it('keeps hostile strings inside JSON string literals', () => {
    const marker = "__REF__require('child_process').execSync('id')";
    const out = index([res('aws_s3_bucket', 'b', { bucket: QUOTE_BREAKOUT, acl: INTERPOLATION, tags: marker, policy: 'config.require(x)' })]);
    expect(out).toContain(`"bucket": ${JSON.stringify(QUOTE_BREAKOUT)}`);
    expect(out).toContain(`"acl": ${JSON.stringify(INTERPOLATION)}`);
    expect(out).toContain(`"tags": ${JSON.stringify(marker)}`);
    expect(out).toContain('"policy": "config.require(x)"');
  });

  it('emits plain literals once-quoted and resolves references', () => {
    const out = index([
      res('aws_s3_bucket', 'assets_bucket', { bucket: 'b' }),
      res('aws_instance', 'web', { instance_type: 't2.micro', ami: 'var.ami', subnet: 'aws_s3_bucket.assets_bucket.arn' }),
    ]);
    expect(out).toContain('"instance_type": "t2.micro"');
    expect(out).toContain('"ami": config.require("ami")');
    expect(out).toContain('"subnet": assetsBucket.arn');
  });
});

describe('generateHelmFiles escaping', () => {
  it('quotes the selector label and neutralises Helm template actions', () => {
    const files = generateHelmFiles([res('kubernetes_service', 'svc', { app_label: 'a"b\nc: {{ .Release.Name }}' })]);
    expect(file(files, 'templates/service-svc.yaml')).toContain('app: "a\\"b\\nc: {{"{{"}} .Release.Name }}"');
  });
});
