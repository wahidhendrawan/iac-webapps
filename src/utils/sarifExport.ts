/**
 * SARIF (Static Analysis Results Interchange Format) export helper.
 *
 * Produces SARIF v2.1.0 output compatible with GitHub Security Scanning,
 * Azure DevOps, and other CI/CD platforms that consume SARIF.
 *
 * Usage:
 *   import { generateSarif } from './sarifExport';
 *   const sarif = generateSarif(findings, { runName: 'iac-security-scan' });
 *   fs.writeFileSync('security-results.sarif', JSON.stringify(sarif, null, 2));
 */

import type { SecurityFinding } from '../types';

export interface SarifArtifactLocation {
  uri: string;
  uriBaseId?: string;
  properties?: Record<string, unknown>;
}

export interface SarifLocation {
  physicalLocation: {
    artifactLocation: SarifArtifactLocation;
    region?: {
      startLine: number;
      startColumn: number;
      endLine?: number;
      endColumn?: number;
    };
  };
}

export interface SarifResult {
  ruleId: string;
  level: 'note' | 'warning' | 'error';
  message: {
    text: string;
  };
  locations?: SarifLocation[];
  fixes?: SarifFix[];
  properties?: Record<string, unknown>;
}

export interface SarifFix {
  description: {
    text: string;
  };
  artifactChanges: Array<{
    artifactLocation: SarifArtifactLocation;
    changes: Array<{
      newText: string;
      startPos: {
        line: number;
        column: number;
      };
      endPos: {
        line: number;
        column: number;
      };
    }>;
  }>;
}

export interface SarifRun {
  tool: {
    driver: {
      name: string;
      version?: string;
      informationUri?: string;
      rules: SarifRule[];
    };
  };
  artifacts?: SarifArtifact[];
  results: SarifResult[];
}

export interface SarifRule {
  id: string;
  name: string;
  description?: {
    text?: string;
    markdown?: string;
  };
  help?: {
    text?: string;
    markdown?: string;
  };
  helpUri?: string;
  properties?: {
    category?: string;
    coverage?: string;
    securitySeverity?: string;
    precision?: string;
  };
}

export interface SarifArtifact {
  location?: SarifArtifactLocation;
  mime_type?: string;
  length?: number;
  hash?: string;
  contents?: string;
  encoding?: string;
}

export interface SarifOutput {
  $schema: string;
  version: string;
  runs: SarifRun[];
}

/**
 * Severity mapping to SARIF level
 */
const severityToLevel: Record<string, 'note' | 'warning' | 'error'> = {
  critical: 'error',
  high: 'error',
  medium: 'warning',
  low: 'warning',
};

/**
 * Generate SARIF v2.1.0 output from security findings.
 */
export function generateSarif(
  findings: SecurityFinding[],
  options: {
    runName?: string;
    toolVersion?: string;
    uriBaseId?: string;
  } = {},
): SarifOutput {
  const { toolVersion = '1.0.0', uriBaseId = 'PROJECT_ROOT' } = options;

  const rules = Array.from(new Set(findings.map((f) => f.ruleId))).map((ruleId) => {
    const sample = findings.find((f) => f.ruleId === ruleId);
    const severity = sample?.severity ?? 'medium';

    return {
      id: ruleId,
      name: ruleId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: {
        text: sample?.message ?? 'No description available.',
      },
      help: {
        text: sample?.remediation ?? 'No remediation available.',
      },
      properties: {
        category: 'Security',
        securitySeverity: severity,
        precision: 'high',
      },
    };
  });

  const results: SarifResult[] = findings.map((finding) => ({
    ruleId: finding.ruleId,
    level: severityToLevel[finding.severity] ?? 'warning',
    message: {
      text: finding.message,
    },
    locations: [
      {
        physicalLocation: {
          artifactLocation: {
            uri: `${finding.resourceId}.tf`,
            uriBaseId,
          },
        },
      },
    ],
    fixes: finding.remediation
      ? [
          {
            description: {
              text: finding.remediation,
            },
            artifactChanges: [],
          },
        ]
      : undefined,
    properties: {
      resourceId: finding.resourceId,
      severity: finding.severity,
    },
  }));

  const sarif: SarifOutput = {
    $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
    version: '2.1.0',
    runs: [
      {
        tool: {
          driver: {
            name: 'iac-security-scanner',
            version: toolVersion,
            informationUri: 'https://github.com/wahidhendrawan/iac-webapps',
            rules,
          },
        },
        results,
      },
    ],
  };

  return sarif;
}

/**
 * Format SARIF run stats for terminal output
 */
export function formatSarifStats(findings: SecurityFinding[]): string {
  const stats = {
    total: findings.length,
    critical: findings.filter((f) => f.severity === 'critical').length,
    high: findings.filter((f) => f.severity === 'high').length,
    medium: findings.filter((f) => f.severity === 'medium').length,
    low: findings.filter((f) => f.severity === 'low').length,
  };

  return `${stats.total} findings: ${stats.critical} critical, ${stats.high} high, ${stats.medium} medium, ${stats.low} low`;
}
