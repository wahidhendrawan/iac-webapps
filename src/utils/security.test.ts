import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  validateResourceName,
  validateAwsRegion,
  validateGcpProjectId,
  encodeHtml,
  validateJsonString,
  sanitizeHclString,
  validateFileUpload,
} from './security';

describe('sanitizeInput', () => {
  it('returns the input when it matches the default allowed pattern', () => {
    expect(sanitizeInput('my-resource_1.2')).toBe('my-resource_1.2');
  });

  it('allows an empty string with the default pattern', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('throws when disallowed characters are present', () => {
    expect(() => sanitizeInput('bad value!')).toThrow('Invalid input');
    expect(() => sanitizeInput('<script>')).toThrow();
  });

  it('honours a custom pattern', () => {
    expect(sanitizeInput('abc', /^[a-c]+$/)).toBe('abc');
    expect(() => sanitizeInput('abcd', /^[a-c]+$/)).toThrow();
  });
});

describe('validateResourceName', () => {
  it('accepts Terraform-compatible names', () => {
    expect(validateResourceName('web_server')).toBe(true);
    expect(validateResourceName('_internal')).toBe(true);
    expect(validateResourceName('App1')).toBe(true);
  });

  it('rejects names starting with a digit or containing invalid characters', () => {
    expect(validateResourceName('1server')).toBe(false);
    expect(validateResourceName('my-server')).toBe(false);
    expect(validateResourceName('has space')).toBe(false);
    expect(validateResourceName('')).toBe(false);
  });
});

describe('validateAwsRegion', () => {
  it('accepts valid region formats', () => {
    expect(validateAwsRegion('us-east-1')).toBe(true);
    expect(validateAwsRegion('ap-southeast-2')).toBe(true);
  });

  it('rejects malformed regions', () => {
    expect(validateAwsRegion('useast1')).toBe(false);
    expect(validateAwsRegion('US-EAST-1')).toBe(false);
    expect(validateAwsRegion('us-east-')).toBe(false);
  });
});

describe('validateGcpProjectId', () => {
  it('accepts valid project ids', () => {
    expect(validateGcpProjectId('my-project-123')).toBe(true);
  });

  it('rejects ids that are too short or contain invalid characters', () => {
    expect(validateGcpProjectId('abc')).toBe(false);
    expect(validateGcpProjectId('My_Project')).toBe(false);
  });
});

describe('encodeHtml', () => {
  it('encodes all dangerous HTML characters', () => {
    expect(encodeHtml('<div class="x">A & B\'s</div>')).toBe(
      '&lt;div class=&quot;x&quot;&gt;A &amp; B&#039;s&lt;/div&gt;'
    );
  });

  it('leaves safe text untouched', () => {
    expect(encodeHtml('plain text 123')).toBe('plain text 123');
  });
});

describe('validateJsonString', () => {
  it('returns true for valid JSON', () => {
    expect(validateJsonString('{"a":1}')).toBe(true);
    expect(validateJsonString('[]')).toBe(true);
  });

  it('returns false for invalid JSON', () => {
    expect(validateJsonString('{a:1}')).toBe(false);
    expect(validateJsonString('not json')).toBe(false);
  });
});

describe('sanitizeHclString', () => {
  it('escapes backslashes, quotes, and control characters', () => {
    expect(sanitizeHclString('a"b')).toBe('a\\"b');
    expect(sanitizeHclString('a\\b')).toBe('a\\\\b');
    expect(sanitizeHclString('${var}')).toBe('\\${var}');
    expect(sanitizeHclString('line1\nline2')).toBe('line1\\nline2');
    expect(sanitizeHclString('tab\there')).toBe('tab\\there');
  });
});

describe('validateFileUpload', () => {
  const makeFile = (size: number, type: string): File =>
    ({ size, type } as File);

  it('accepts files within the size and type limits', () => {
    const result = validateFileUpload(makeFile(1024, 'application/json'));
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('rejects files that exceed the size limit', () => {
    const result = validateFileUpload(makeFile(20 * 1024 * 1024, 'application/json'));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds');
  });

  it('rejects disallowed file types', () => {
    const result = validateFileUpload(makeFile(1024, 'application/x-msdownload'));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('not allowed');
  });

  it('honours custom limits', () => {
    const result = validateFileUpload(makeFile(2048, 'text/csv'), 1024, ['text/csv']);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds');
  });
});
