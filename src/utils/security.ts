/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Only allows alphanumeric, hyphens, underscores, and dots
 */
export function sanitizeInput(input: string, pattern: RegExp = /^[a-zA-Z0-9_.-]*$/): string {
  if (!pattern.test(input)) {
    throw new Error('Invalid input: contains disallowed characters');
  }
  return input;
}

/**
 * Validate resource names (Terraform-compatible)
 * Must start with letter or underscore, contain only alphanumeric and underscores
 */
export function validateResourceName(name: string): boolean {
  const resourceNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return resourceNameRegex.test(name);
}

/**
 * Validate AWS region format
 */
export function validateAwsRegion(region: string): boolean {
  const awsRegionRegex = /^[a-z]{2}-[a-z]+-\d{1}$/;
  return awsRegionRegex.test(region);
}

/**
 * Validate GCP project ID format
 */
export function validateGcpProjectId(projectId: string): boolean {
  const gcpProjectRegex = /^[a-z0-9-]{6,30}$/;
  return gcpProjectRegex.test(projectId);
}

/**
 * Encode HTML entities to prevent XSS
 */
export function encodeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Validate JSON structure safely
 */
export function validateJsonString(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Warning: Secrets stored in localStorage are vulnerable to XSS.
 * This function should only be used for non-production API keys (e.g., development/simulation mode).
 * For production, use environment variables or secure backend storage.
 */
export function warnAboutLocalStorageSecrets(): void {
  if (import.meta.env.PROD) {
    console.warn(
      'SECURITY WARNING: Storing secrets in localStorage is vulnerable to XSS attacks. ' +
      'For production use, consider storing API keys in environment variables or a secure backend.'
    );
  }
}

/**
 * Sanitize Terraform HCL to prevent injection attacks
 * Removes potentially dangerous characters and escape sequences
 */
export function sanitizeHclString(value: string): string {
  // Escape special characters in HCL strings
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\$/g, '\\$')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Validate file content before processing
 * Checks file size and type
 */
export function validateFileUpload(
  file: File,
  maxSizeBytes: number = 10 * 1024 * 1024, // 10MB default
  allowedTypes: string[] = ['application/json', 'text/plain', 'application/zip']
): { valid: boolean; error?: string } {
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeBytes / 1024 / 1024}MB limit`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}
