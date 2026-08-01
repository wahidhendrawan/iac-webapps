import { describe, expect, it } from 'vitest';
import { scanResources } from './securityScanner';
import type { Resource, ResourceType } from '../types';

const mockResource = (
  type: ResourceType,
  name: string,
  properties: Record<string, unknown>,
): Resource => ({
  id: `${type}-${name}`,
  type,
  name,
  properties,
});

function findingsFor(resources: Resource[], ruleId: string) {
  return scanResources(resources).filter((finding) => finding.ruleId === ruleId);
}

describe('securityScanner', () => {
  it('detects public S3 buckets without reporting hardened buckets', () => {
    const findings = findingsFor([
      mockResource('aws_s3_bucket', 'public-bucket', {
        acl: 'public-read',
        server_side_encryption_configuration: true,
        versioning: true,
      }),
      mockResource('aws_s3_bucket', 'private-bucket', {
        acl: 'private',
        server_side_encryption_configuration: true,
        versioning: true,
      }),
    ], 's3-public-access');

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ severity: 'high', resourceId: 'aws_s3_bucket-public-bucket' });
  });

  it('detects S3 buckets without encryption or versioning', () => {
    const resources = [
      mockResource('aws_s3_bucket', 'unencrypted', {
        acl: 'private',
        versioning: true,
      }),
      mockResource('aws_s3_bucket', 'no-versioning', {
        acl: 'private',
        server_side_encryption_configuration: true,
        versioning: false,
      }),
    ];

    expect(findingsFor(resources, 'unencrypted-s3')).toHaveLength(1);
    expect(findingsFor(resources, 's3-versioning-disabled')).toHaveLength(1);
  });

  it('detects explicitly configured IMDSv1 but does not guess when metadata settings are absent', () => {
    const resources = [
      mockResource('aws_instance', 'imdsv1', {
        instance_type: 't3.micro',
        metadata_options: { http_tokens: 'optional' },
      }),
      mockResource('aws_instance', 'imdsv2', {
        instance_type: 't3.micro',
        metadata_options: { http_tokens: 'required' },
      }),
      mockResource('aws_instance', 'unknown', { instance_type: 't3.micro' }),
    ];

    const findings = findingsFor(resources, 'aws-imdsv1-enabled');
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ severity: 'high', resourceId: 'aws_instance-imdsv1' });
  });

  it('detects explicitly configured GCP public IPs', () => {
    const findings = findingsFor([
      mockResource('google_compute_instance', 'public-ip', {
        network_interface: [{ network: 'default', access_config: { nat_ip: '1.2.3.4' } }],
      }),
      mockResource('google_compute_instance', 'private-only', {
        network_interface: [{ network: 'default' }],
      }),
    ], 'gcp-public-ip-exposure');

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ severity: 'medium', resourceId: 'google_compute_instance-public-ip' });
  });

  it('detects privileged Kubernetes containers, host networking, and missing resource limits', () => {
    const resource = mockResource('kubernetes_deployment', 'unsafe-pod', {
      metadata: { namespace: 'production' },
      spec: {
        template: {
          spec: {
            host_network: true,
            containers: [{
              name: 'app',
              image: 'nginx:1.27.3',
              security_context: { privileged: true },
            }],
          },
        },
      },
    });

    const ruleIds = scanResources([resource]).map((finding) => finding.ruleId);
    expect(ruleIds).toEqual(expect.arrayContaining([
      'k8s-privileged-container',
      'k8s-host-network',
      'k8s-missing-resource-limits',
    ]));
  });

  it('only flags an explicitly selected default namespace', () => {
    const findings = findingsFor([
      mockResource('kubernetes_deployment', 'implicit', { image: 'nginx:1.27.3' }),
      mockResource('kubernetes_service', 'default', { metadata: { namespace: 'default' } }),
      mockResource('kubernetes_service', 'production', { metadata: { namespace: 'production' } }),
    ], 'k8s-default-namespace');

    expect(findings).toHaveLength(1);
    expect(findings[0].resourceId).toBe('kubernetes_service-default');
  });

  it('detects externally reachable Kubernetes service types configured in the UI', () => {
    const findings = findingsFor([
      mockResource('kubernetes_service', 'public', { type: 'LoadBalancer' }),
      mockResource('kubernetes_service', 'node-port', { type: 'NodePort' }),
      mockResource('kubernetes_service', 'internal', { type: 'ClusterIP' }),
    ], 'k8s-public-service');

    expect(findings).toHaveLength(2);
    expect(findings.every((finding) => finding.severity === 'high')).toBe(true);
  });

  it('detects deployments using unpinned or latest container images', () => {
    const findings = findingsFor([
      mockResource('kubernetes_deployment', 'latest', { image: 'nginx:latest' }),
      mockResource('kubernetes_deployment', 'untagged', { image: 'nginx' }),
      mockResource('kubernetes_deployment', 'tagged', { image: 'nginx:1.27.3' }),
      mockResource('kubernetes_deployment', 'digest', { image: 'nginx@sha256:abcdef' }),
    ], 'k8s-unpinned-image');

    expect(findings).toHaveLength(2);
    expect(findings.every((finding) => finding.severity === 'medium')).toBe(true);
  });

  it('detects oversized AWS and GCP instances using their respective UI property names', () => {
    const findings = findingsFor([
      mockResource('aws_instance', 'aws-large', { instance_type: 'm5.large' }),
      mockResource('google_compute_instance', 'gcp-large', { machine_type: 'n2-highmem-4-large' }),
      mockResource('google_compute_instance', 'gcp-small', { machine_type: 'e2-medium' }),
    ], 'privileged-instance');

    expect(findings).toHaveLength(2);
    expect(findings.every((finding) => finding.severity === 'low')).toBe(true);
  });

  it('detects public SSH and RDP while ignoring unrelated port values', () => {
    const findings = findingsFor([
      mockResource('aws_instance', 'ssh', {
        ingress: [{ cidr_blocks: ['0.0.0.0/0'], from_port: 22, to_port: 22 }],
      }),
      mockResource('aws_instance', 'rdp', {
        ingress: [{ cidr_blocks: ['0.0.0.0/0'], from_port: 3389, to_port: 3389 }],
      }),
      mockResource('aws_instance', 'unrelated', {
        ingress: [{ cidr_blocks: ['0.0.0.0/0'], from_port: 2200, to_port: 2200 }],
      }),
    ], 'open-ssh-rdp');

    expect(findings).toHaveLength(2);
    expect(findings.every((finding) => finding.severity === 'critical')).toBe(true);
  });

  it('returns no findings for an explicitly hardened configuration', () => {
    const resources = [
      mockResource('aws_s3_bucket', 'hardened-bucket', {
        acl: 'private',
        server_side_encryption_configuration: true,
        versioning: true,
      }),
      mockResource('aws_instance', 'imdsv2', {
        instance_type: 't3.micro',
        metadata_options: { http_tokens: 'required' },
      }),
      mockResource('kubernetes_deployment', 'safe-app', {
        image: 'nginx:1.27.3',
        metadata: { namespace: 'production' },
        spec: {
          template: {
            spec: {
              host_network: false,
              containers: [{
                image: 'nginx:1.27.3',
                resources: { limits: { cpu: '500m', memory: '512Mi' } },
                security_context: { privileged: false },
              }],
            },
          },
        },
      }),
      mockResource('kubernetes_service', 'internal', {
        type: 'ClusterIP',
        metadata: { namespace: 'production' },
      }),
    ];

    expect(scanResources(resources)).toEqual([]);
  });
});
