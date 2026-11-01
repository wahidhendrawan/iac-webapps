import { describe, it, expect } from 'vitest';
import { parseHCL } from './hclParser';

describe('parseHCL', () => {
  it('imports known resource types and modules', () => {
    const { resources, skipped } = parseHCL(
      'resource "aws_instance" "web" {\n  instance_type = "t2.micro"\n  monitoring = true\n}\n' +
      'module "vpc" {\n  cidr = "10.0.0.0/16"\n}\n',
    );
    expect(skipped).toEqual([]);
    expect(resources.map(r => [r.type, r.name])).toEqual([['aws_instance', 'web'], ['module', 'vpc']]);
    expect(resources[0].properties).toEqual({ instance_type: 't2.micro', monitoring: true });
  });

  it('skips and reports unknown types and invalid names', () => {
    const { resources, skipped } = parseHCL(
      'resource "aws_vpc" "main" {\n  cidr_block = "10.0.0.0/16"\n}\n' +
      'resource "aws_instance" "bad name" {\n  ami = "x"\n}\n' +
      'resource "aws_s3_bucket" "ok" {\n  bucket = "b"\n}\n' +
      'module "../evil" {\n  source = "x"\n}\n',
    );
    expect(resources.map(r => r.name)).toEqual(['ok']);
    expect(skipped).toEqual(['aws_vpc.main', 'aws_instance.bad name', 'module.../evil']);
  });

  it('drops property lines whose key is not an identifier', () => {
    const { resources } = parseHCL('resource "aws_s3_bucket" "b" {\n  bucket = "b"\n  } resource "x" "y" { a = 1\n}\n');
    expect(resources[0].properties).toEqual({ bucket: 'b' });
  });
});
