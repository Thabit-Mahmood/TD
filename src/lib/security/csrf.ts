import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

const CSRF_TOKEN_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

// Generate CSRF token
export function generateCsrfToken(): string {
  return uuidv4();
}

// Set CSRF token in cookie
export async function setCsrfCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 // 1 hour
  });
}

// Get CSRF token from cookie
export async function getCsrfFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_TOKEN_NAME)?.value || null;
}

// Validate CSRF token
export async function validateCsrfToken(headerToken: string | null): Promise<boolean> {
  if (!headerToken) return false;
  
  const cookieToken = await getCsrfFromCookie();
  if (!cookieToken) return false;
  
  // Constant-time comparison to prevent timing attacks
  if (headerToken.length !== cookieToken.length) return false;
  
  let result = 0;
  for (let i = 0; i < headerToken.length; i++) {
    result |= headerToken.charCodeAt(i) ^ cookieToken.charCodeAt(i);
  }
  
  return result === 0;
}
