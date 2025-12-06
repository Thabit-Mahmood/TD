import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation/schemas';
import { sanitizeInput, sanitizeEmail, sanitizePhone } from '@/lib/security/sanitize';
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/security/rate-limit';
import { hashPassword } from '@/lib/security/auth';
import { queryOne, execute } from '@/lib/db';

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Cache-Control': 'no-store, max-age=0',
};

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Rate limiting
    const rateLimitKey = getRateLimitKey(ip, 'auth');
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.auth);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'تم تجاوز عدد المحاولات المسموحة. يرجى المحاولة لاحقاً.' },
        { 
          status: 429,
          headers: {
            ...securityHeaders,
            'Retry-After': Math.ceil(rateLimit.resetIn / 1000).toString(),
          }
        }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'بيانات غير صالحة' },
        { status: 400, headers: securityHeaders }
      );
    }

    // Validate
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400, headers: securityHeaders }
      );
    }

    const data = validation.data;

    // Sanitize
    const sanitizedEmail = sanitizeEmail(data.email);
    if (!sanitizedEmail) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صالح' },
        { status: 400, headers: securityHeaders }
      );
    }

    // Check if email already exists
    const existingUser = queryOne<{ id: number }>(
      'SELECT id FROM users WHERE email = ?',
      [sanitizedEmail]
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مسجل مسبقاً' },
        { status: 400, headers: securityHeaders }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Sanitize other fields
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizedEmail,
      phone: data.phone ? sanitizePhone(data.phone) : null,
      companyName: data.companyName ? sanitizeInput(data.companyName) : null,
    };

    // Insert user
    execute(
      `INSERT INTO users (email, password_hash, name, phone, company_name, role) 
       VALUES (?, ?, ?, ?, ?, 'customer')`,
      [
        sanitizedData.email,
        passwordHash,
        sanitizedData.name,
        sanitizedData.phone,
        sanitizedData.companyName,
      ]
    );

    return NextResponse.json(
      { success: true, message: 'تم إنشاء الحساب بنجاح' },
      { status: 201, headers: securityHeaders }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.' },
      { status: 500, headers: securityHeaders }
    );
  }
}
