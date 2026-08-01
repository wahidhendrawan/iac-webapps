import { describe, it, expect } from 'vitest';
import { scanResources } from './securityScanner';
import type { Resource, ResourceType } from '../types';

const mockResource = (
  type: ResourceType,
  name: string,
  properties: Record<string, unknown>
): Resource => ({
  id: 'test-id',
  type,
  name,
  properties,
});

describe('securityScanner', () => {
  it('detects public S3 buckets', () => {
    const resources = [
      mockResource('aws_s3_bucket', 'public-bucket', {
        acl: 'public-read',
        server_side_encryption_configuration: true,
      }),
      mockResource('aws_s3_bucket', 'private-bucket', {
        acl: 'private',
        server_side_encryption_configuration: true,
      }),
    ];

    const findings = scanResources(resources);
    expect(findings).toHaveLength(1);
    const finding = findings[0];
    expect(finding.ruleId).toBe('s3-public-access');
    expect(finding.severity).toBe('high');
    expect(finding.resourceId).toBe('test-id');
    expect(finding.message).toContain('public-bucket');
    expect(finding.remediation).toContain('Change ACL');
  });

  it('detects unencrypted S3 buckets', () => {
    const resources = [
      mockResource('aws_s3_bucket', 'no-encrypt', {}),
      mockResource('aws_s3_bucket', 'encrypted', {
        server_side_encryption_configuration: true,
      }),
    ];

    const findings = scanResources(resources);
    expect(findings).toHaveLength(1);
    expect(findings[0].ruleId).toBe('unencrypted-s3');
    expect(findings[0].severity).toBe('medium');
  });

  it('detects large instance types', () => {
    const resources = [
      mockResource('aws_instance', 'big-instance', { instance_type: 'm5.large' }),
      mockResource('google_compute_instance', 'gcp-large', { instance_type: 'n2-large' }),
      mockResource('aws_instance', 'small', { instance_type: 't3.micro' }),
    ];

    const findings = scanResources(resources);
    expect(findings).toHaveLength(2);
    expect(findings[0].ruleId).toBe('privileged-instance');
    expect(findings[0].severity).toBe('low');
  });

  it('detects public SSH and RDP settings in resource properties', () => {
    const resources = [
      mockResource('aws_instance', 'open-ssh', {
        ingress: [{ cidr_blocks: ['0.0.0.0/0'], from_port: 22, to_port: 22 }],
      }),
      mockResource('aws_instance', 'open-rdp', {
        ingress: [{ cidr_blocks: ['0.0.0.0/0'], from_port: 3389, to_port: 3389 }],
      }),
      mockResource('aws_instance', 'closed', {
        ingress: [{ cidr_blocks: ['10.0.0.0/8'], from_port: 80 }],
      }),
    ];

    const findings = scanResources(resources);
    expect(findings).toHaveLength(2);
    expect(findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: 'open-ssh-rdp', severity: 'critical' }),
      ])
    );
  });

  it('returns empty array for no findings', () => {
    const resources = [
      mockResource('local_file', 'dummy', {}),
      mockResource('aws_s3_bucket', 'encrypted-private', {
        acl: 'private',
        server_side_encryption_configuration: true,
      }),
    ];

    const findings = scanResources(resources);
    expect(findings).toEqual([]);
  });
});
