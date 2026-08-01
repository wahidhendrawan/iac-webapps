import type { Resource, SecurityFinding } from '../types';

export interface SecurityRule {
  id: string;
  check: (resource: Resource) => SecurityFinding | null;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function hasPinnedImage(image: string): boolean {
  if (image.includes('@sha256:')) return true;

  const imageName = image.split('/').at(-1) ?? image;
  return imageName.includes(':') && !imageName.endsWith(':latest');
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
            remediation: 'Change ACL to "private" unless public access is explicitly required for a static website.',
          };
        }
      }
      return null;
    },
  },
  {
    id: 'unencrypted-s3',
    check: (res) => {
      if (res.type === 'aws_s3_bucket' && res.properties.server_side_encryption_configuration !== true) {
        return {
          ruleId: 'unencrypted-s3',
          resourceId: res.id,
          severity: 'medium',
          message: `S3 bucket "${res.name}" might be missing encryption.`,
          remediation: 'Enable default server-side encryption to protect data at rest.',
        };
      }
      return null;
    },
  },
  {
    id: 's3-versioning-disabled',
    check: (res) => {
      if (res.type === 'aws_s3_bucket' && res.properties.versioning !== true) {
        return {
          ruleId: 's3-versioning-disabled',
          resourceId: res.id,
          severity: 'low',
          message: `S3 bucket "${res.name}" does not have versioning enabled.`,
          remediation: 'Enable versioning to protect against accidental deletion and support compliance requirements.',
        };
      }
      return null;
    },
  },
  {
    id: 'aws-imdsv1-enabled',
    check: (res) => {
      if (res.type !== 'aws_instance') return null;

      const metadataOptions = asRecord(res.properties.metadata_options);
      if (metadataOptions?.http_tokens === 'optional') {
        return {
          ruleId: 'aws-imdsv1-enabled',
          resourceId: res.id,
          severity: 'high',
          message: `EC2 instance "${res.name}" explicitly allows IMDSv1, which is vulnerable to SSRF attacks.`,
          remediation: 'Set metadata_options.http_tokens = "required" to enforce IMDSv2.',
        };
      }
      return null;
    },
  },
  {
    id: 'gcp-public-ip-exposure',
    check: (res) => {
      if (res.type !== 'google_compute_instance') return null;

      const networkInterfaces = res.properties.network_interface;
      if (
        Array.isArray(networkInterfaces)
        && networkInterfaces.some((networkInterface) => asRecord(networkInterface)?.access_config)
      ) {
        return {
          ruleId: 'gcp-public-ip-exposure',
          resourceId: res.id,
          severity: 'medium',
          message: `GCP instance "${res.name}" has a public IP assigned.`,
          remediation: 'Remove access_config unless public access is required. Use Cloud NAT or private IPs for internal workloads.',
        };
      }
      return null;
    },
  },
  {
    id: 'k8s-privileged-container',
    check: (res) => {
      if (res.type !== 'kubernetes_deployment') return null;

      const spec = asRecord(res.properties.spec);
      const template = asRecord(spec?.template);
      const podSpec = asRecord(template?.spec);
      const containers = podSpec?.containers;
      if (
        Array.isArray(containers)
        && containers.some((container) => asRecord(asRecord(container)?.security_context)?.privileged === true)
      ) {
        return {
          ruleId: 'k8s-privileged-container',
          resourceId: res.id,
          severity: 'critical',
          message: `Kubernetes deployment "${res.name}" runs containers in privileged mode.`,
          remediation: 'Remove privileged: true from container security contexts to prevent container escape.',
        };
      }
      return null;
    },
  },
  {
    id: 'k8s-host-network',
    check: (res) => {
      if (res.type !== 'kubernetes_deployment') return null;

      const spec = asRecord(res.properties.spec);
      const template = asRecord(spec?.template);
      const podSpec = asRecord(template?.spec);
      if (podSpec?.host_network === true) {
        return {
          ruleId: 'k8s-host-network',
          resourceId: res.id,
          severity: 'high',
          message: `Kubernetes deployment "${res.name}" uses host network mode.`,
          remediation: 'Avoid hostNetwork: true unless absolutely necessary for CNI or monitoring workloads.',
        };
      }
      return null;
    },
  },
  {
    id: 'k8s-default-namespace',
    check: (res) => {
      if (res.type !== 'kubernetes_deployment' && res.type !== 'kubernetes_service') return null;

      const metadata = asRecord(res.properties.metadata);
      if (metadata?.namespace === 'default') {
        return {
          ruleId: 'k8s-default-namespace',
          resourceId: res.id,
          severity: 'low',
          message: `Kubernetes resource "${res.name}" uses the default namespace.`,
          remediation: 'Deploy workloads to dedicated namespaces for better isolation and resource management.',
        };
      }
      return null;
    },
  },
  {
    id: 'k8s-missing-resource-limits',
    check: (res) => {
      if (res.type !== 'kubernetes_deployment') return null;

      const spec = asRecord(res.properties.spec);
      const template = asRecord(spec?.template);
      const podSpec = asRecord(template?.spec);
      const containers = podSpec?.containers;
      if (
        Array.isArray(containers)
        && containers.some((container) => !asRecord(asRecord(container)?.resources)?.limits)
      ) {
        return {
          ruleId: 'k8s-missing-resource-limits',
          resourceId: res.id,
          severity: 'medium',
          message: `Kubernetes deployment "${res.name}" has containers without resource limits.`,
          remediation: 'Set resources.limits (CPU and memory) to prevent resource exhaustion attacks.',
        };
      }
      return null;
    },
  },
  {
    id: 'k8s-public-service',
    check: (res) => {
      if (
        res.type === 'kubernetes_service'
        && (res.properties.type === 'LoadBalancer' || res.properties.type === 'NodePort')
      ) {
        return {
          ruleId: 'k8s-public-service',
          resourceId: res.id,
          severity: 'high',
          message: `Kubernetes service "${res.name}" is configured as ${res.properties.type} and may be externally reachable.`,
          remediation: 'Use ClusterIP for internal services, or restrict ingress and source ranges when external access is required.',
        };
      }
      return null;
    },
  },
  {
    id: 'k8s-unpinned-image',
    check: (res) => {
      const image = res.properties.image;
      if (res.type === 'kubernetes_deployment' && typeof image === 'string' && !hasPinnedImage(image)) {
        return {
          ruleId: 'k8s-unpinned-image',
          resourceId: res.id,
          severity: 'medium',
          message: `Kubernetes deployment "${res.name}" uses an unpinned container image "${image}".`,
          remediation: 'Use an immutable image digest (recommended) or a non-latest version tag to make deployments reproducible.',
        };
      }
      return null;
    },
  },
  {
    id: 'privileged-instance',
    check: (res) => {
      const instanceType = res.properties.instance_type ?? res.properties.machine_type;
      if (
        (res.type === 'aws_instance' || res.type === 'google_compute_instance')
        && typeof instanceType === 'string'
        && instanceType.includes('large')
      ) {
        return {
          ruleId: 'privileged-instance',
          resourceId: res.id,
          severity: 'low',
          message: `Instance "${res.name}" uses a large machine type.`,
          remediation: 'Verify if this size is necessary to optimize cloud costs.',
        };
      }
      return null;
    },
  },
  {
    id: 'open-ssh-rdp',
    check: (res) => {
      const properties = JSON.stringify(res.properties);
      const hasPublicCidr = properties.includes('0.0.0.0/0');
      const hasAdministrativePort = /"(?:from_port|to_port|port)"\s*:\s*(?:22|3389)(?=[,}])/.test(properties);
      if (hasPublicCidr && hasAdministrativePort) {
        return {
          ruleId: 'open-ssh-rdp',
          resourceId: res.id,
          severity: 'critical',
          message: `Resource "${res.name}" has SSH/RDP ports open to the public.`,
          remediation: 'Restrict access to specific IP ranges to prevent brute-force attacks.',
        };
      }
      return null;
    },
  },
];

export function scanResources(resources: Resource[]): SecurityFinding[] {
  const findings: SecurityFinding[] = [];

  resources.forEach((resource) => {
    RULES.forEach((rule) => {
      const finding = rule.check(resource);
      if (finding) findings.push(finding);
    });
  });

  return findings;
}
