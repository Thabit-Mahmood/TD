import sanitizeHtml from 'sanitize-html';
import validator from 'validator';

// Strict HTML sanitization - removes all HTML
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // First pass: escape HTML entities
  let sanitized = validator.escape(input);
  
  // Second pass: remove any remaining HTML
  sanitized = sanitizeHtml(sanitized, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'recursiveEscape'
  });
  
  // Trim and limit length
  return sanitized.trim().slice(0, 10000);
}

// Sanitize for display (allows safe formatting)
export function sanitizeForDisplay(input: string): string {
  if (typeof input !== 'string') return '';
  
  return sanitizeHtml(input, {
    allowedTags: ['b', 'i', 'em', 'strong', 'br'],
    allowedAttributes: {},
    disallowedTagsMode: 'recursiveEscape'
  });
}

// Validate and sanitize email
export function sanitizeEmail(email: string): string | null {
  if (typeof email !== 'string') return null;
  
  const trimmed = email.trim().toLowerCase();
  if (!validator.isEmail(trimmed)) return null;
  
  return validator.normalizeEmail(trimmed) || null;
}

// Validate and sanitize phone number
export function sanitizePhone(phone: string): string | null {
  if (typeof phone !== 'string') return null;
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Basic phone validation (Saudi format)
  if (!/^\+?[0-9]{9,15}$/.test(cleaned)) return null;
  
  return cleaned;
}

// Sanitize tracking number (alphanumeric only)
export function sanitizeTrackingNumber(tracking: string): string | null {
  if (typeof tracking !== 'string') return null;
  
  const cleaned = tracking.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  if (cleaned.length < 5 || cleaned.length > 30) return null;
  
  return cleaned;
}

// Sanitize URL
export function sanitizeUrl(url: string): string | null {
  if (typeof url !== 'string') return null;
  
  const trimmed = url.trim();
  
  if (!validator.isURL(trimmed, { 
    protocols: ['http', 'https'],
    require_protocol: true 
  })) return null;
  
  return trimmed;
}

// Prevent SQL injection by validating identifiers
export function isValidIdentifier(str: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(str);
}

// Sanitize integer
export function sanitizeInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed.toString() === value.trim()) return parsed;
  }
  return null;
}
