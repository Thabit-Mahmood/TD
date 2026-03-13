import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production-min-32-chars!'
);

const TOKEN_NAME = 'auth_token';
const TOKEN_EXPIRY = '24h';

export interface UserPayload {
  id: number;
  email: string;
  role: 'admin' | 'customer' | 'partner';
  name: string;
}

// Hash password with bcrypt
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export async function generateToken(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .setJti(crypto.randomUUID())
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 // 24 hours
  });
}

// Get current user from cookie
export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  
  if (!token) return null;
  
  return verifyToken(token);
}

// Clear auth cookie
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

// Validate password strength
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  if (!/[A-Z]/.test(password)) errors.push('يجب أن تحتوي على حرف كبير');
  if (!/[a-z]/.test(password)) errors.push('يجب أن تحتوي على حرف صغير');
  if (!/[0-9]/.test(password)) errors.push('يجب أن تحتوي على رقم');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('يجب أن تحتوي على رمز خاص');
  
  return { valid: errors.length === 0, errors };
}
