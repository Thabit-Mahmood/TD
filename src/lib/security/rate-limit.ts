// Simple in-memory rate limiter
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

export const RATE_LIMITS = {
  api: { windowMs: 60000, maxRequests: 100 },
  auth: { windowMs: 900000, maxRequests: 5 },  // 15 min, 5 attempts
  tracking: { windowMs: 60000, maxRequests: 30 },
  contact: { windowMs: 300000, maxRequests: 3 },  // 5 min, 3 submissions
} as const;

export function checkRateLimit(
  identifier: string, 
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const key = identifier;
  
  let entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs
    };
    rateLimitStore.set(key, entry);
    return { 
      allowed: true, 
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs 
    };
  }
  
  if (entry.count >= config.maxRequests) {
    return { 
      allowed: false, 
      remaining: 0,
      resetIn: entry.resetTime - now 
    };
  }
  
  entry.count++;
  return { 
    allowed: true, 
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now 
  };
}

export function getRateLimitKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`;
}
