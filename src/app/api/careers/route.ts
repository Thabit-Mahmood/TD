import { NextRequest, NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { sendCareerApplicationConfirmation, sendCareerApplicationAdminNotification } from '@/lib/email';

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Cache-Control': 'no-store, max-age=0',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, position, message, language = 'ar' } = body;

    // Validate required fields
    if (!name || !email || !phone || !position) {
      return NextResponse.json(
        { error: language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields' },
        { status: 400, headers: securityHeaders }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: language === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Invalid email address' },
        { status: 400, headers: securityHeaders }
      );
    }

    // Get IP and user agent
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Insert into database
    execute(
      `INSERT INTO job_applications (name, email, phone, cover_letter, status, notes)
       VALUES (?, ?, ?, ?, 'new', ?)`,
      [name, email, phone, message || '', `Position: ${position}`]
    );

    // Send emails
    try {
      await sendCareerApplicationConfirmation({
        name,
        email,
        position,
        language: language as 'ar' | 'en',
      });

      await sendCareerApplicationAdminNotification({
        name,
        email,
        phone,
        position,
        message: message || '',
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    return NextResponse.json(
      { success: true, message: language === 'ar' ? 'تم إرسال طلبك بنجاح' : 'Your application has been submitted successfully' },
      { status: 200, headers: securityHeaders }
    );

  } catch (error) {
    console.error('Career application error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الطلب' },
      { status: 500, headers: securityHeaders }
    );
  }
}
