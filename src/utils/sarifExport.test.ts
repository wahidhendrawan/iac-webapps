import { describe, expect, it } from 'vitest';
import { generateSarif, formatSarifStats } from './sarifExport';
import type { SecurityFinding } from '../types';

const finding = (overrides: Partial<SecurityFinding> = {}): SecurityFinding => ({
  ruleId: 's3-public-access',
  resourceId: 'aws_s3_bucket-public',
  severity: 'high',
  message: 'S3 bucket allows public access',
  remediation: 'Set the ACL to private and enable Block Public Access.',
  ...overrides,
});

describe('generateSarif', () => {
  it('produces a SARIF v2.1.0 envelope', () => {
    const sarif = generateSarif([finding()]);

    expect(sarif.version).toBe('2.1.0');
    expect(sarif.$schema).toContain('sarif-schema-2.1.0.json');
    expect(sarif.runs).toHaveLength(1);
  });

  it('maps critical and high severities to error, medium and low to warning', () => {
    const sarif = generateSarif([
      finding({ ruleId: 'r-critical', severity: 'critical' }),
      finding({ ruleId: 'r-high', severity: 'high' }),
      finding({ ruleId: 'r-medium', severity: 'medium' }),
      finding({ ruleId: 'r-low', severity: 'low' }),
    ]);

    const levels = Object.fromEntries(sarif.runs[0].results.map((r) => [r.ruleId, r.level]));
    expect(levels['r-critical']).toBe('error');
    expect(levels['r-high']).toBe('error');
    expect(levels['r-medium']).toBe('warning');
    expect(levels['r-low']).toBe('warning');
  });

  it('deduplicates rules while keeping one result per finding', () => {
    const sarif = generateSarif([
      finding({ resourceId: 'aws_s3_bucket-a' }),
      finding({ resourceId: 'aws_s3_bucket-b' }),
    ]);

    expect(sarif.runs[0].tool.driver.rules).toHaveLength(1);
    expect(sarif.runs[0].results).toHaveLength(2);
  });

  it('carries remediation into rule help and result fixes', () => {
    const sarif = generateSarif([finding()]);
    const rule = sarif.runs[0].tool.driver.rules[0];
    const result = sarif.runs[0].results[0];

    expect(rule.help?.text).toContain('Block Public Access');
    expect(result.fixes?.[0].description.text).toContain('Block Public Access');
  });

  it('emits an empty results array when there are no findings', () => {
    const sarif = generateSarif([]);
    expect(sarif.runs[0].results).toHaveLength(0);
    expect(sarif.runs[0].tool.driver.rules).toHaveLength(0);
  });

  it('honours a custom tool version', () => {
    const sarif = generateSarif([finding()], { toolVersion: '2.3.4' });
    expect(sarif.runs[0].tool.driver.version).toBe('2.3.4');
  });
});

describe('formatSarifStats', () => {
  it('summarises findings by severity', () => {
    const stats = formatSarifStats([
      finding({ severity: 'critical' }),
      finding({ severity: 'high' }),
      finding({ severity: 'high' }),
      finding({ severity: 'medium' }),
      finding({ severity: 'low' }),
    ]);

    expect(stats).toBe('5 findings: 1 critical, 2 high, 1 medium, 1 low');
  });
});
