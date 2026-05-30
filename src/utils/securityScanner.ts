import type { Resource, SecurityFinding } from '../types';

export interface SecurityRule {
  id: string;
  check: (resource: Resource) => SecurityFinding | null;
}

const RULES: SecurityRule[] = [
  {
    id: 's3-public-access',
    check: (res) => {
      if (res.type === 'aws_s3_bucket') {
        const acl = res.properties.acl;
        if (acl === 'public-read' || acl === 'public-read-write') {
          return {
            ruleId: 's3-public-access',
            resourceId: res.id,
            severity: 'high',
            message: `S3 bucket "${res.name}" has public read/write access.`,
            remediation: 'Change ACL to "private" unless public access is explicitly required for a static website.'
          };
        }
      }
      return null;
    }
  },
  {
    id: 'unencrypted-s3',
    check: (res) => {
      if (res.type === 'aws_s3_bucket' && !res.properties.server_side_encryption_configuration) {
        return {
            ruleId: 'unencrypted-s3',
            resourceId: res.id,
            severity: 'medium',
            message: `S3 bucket "${res.name}" might be missing encryption.`,
            remediation: 'Enable default server-side encryption to protect data at rest.'
        };
      }
      return null;
    }
  },
  {
      id: 'privileged-instance',
      check: (res) => {
          if ((res.type === 'aws_instance' || res.type === 'google_compute_instance') && res.properties.instance_type?.includes('large')) {
              return {
                  ruleId: 'privileged-instance',
                  resourceId: res.id,
                  severity: 'low',
                  message: `Instance "${res.name}" uses a large machine type.`,
                  remediation: 'Verify if this size is necessary to optimize cloud costs.'
              };
          }
          return null;
      }
  }
];

export function scanResources(resources: Resource[]): SecurityFinding[] {
  const findings: SecurityFinding[] = [];

  resources.forEach(res => {
    RULES.forEach(rule => {
      const finding = rule.check(res);
      if (finding) {
        findings.push(finding);
      }
    });
  });

  return findings;
}
