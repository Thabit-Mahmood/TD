import { z } from 'zod';

// Contact form schema
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جداً'),
  email: z.string()
    .email('البريد الإلكتروني غير صالح')
    .max(255, 'البريد الإلكتروني طويل جداً'),
  phone: z.string()
    .max(20, 'رقم الهاتف طويل جداً')
    .optional()
    .or(z.literal('')),
  company: z.string()
    .max(200, 'اسم الشركة طويل جداً')
    .optional(),
  subject: z.string()
    .min(3, 'الموضوع يجب أن يكون 3 أحرف على الأقل')
    .max(200, 'الموضوع طويل جداً'),
  message: z.string()
    .min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل')
    .max(5000, 'الرسالة طويلة جداً'),
  type: z.enum(['general', 'sales', 'support', 'partnership', 'quote'])
    .default('general'),
});

// Quote request schema
export const quoteSchema = z.object({
  name: z.string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جداً'),
  email: z.string()
    .email('البريد الإلكتروني غير صالح'),
  phone: z.string()
    .min(9, 'رقم الهاتف قصير جداً')
    .max(20, 'رقم الهاتف طويل جداً'),
  company: z.string()
    .max(200, 'اسم الشركة طويل جداً')
    .optional(),
  serviceType: z.string()
    .min(1, 'يرجى اختيار نوع الخدمة'),
  estimatedVolume: z.string()
    .max(100, 'الحجم المتوقع طويل جداً')
    .optional(),
  additionalDetails: z.string()
    .max(2000, 'التفاصيل طويلة جداً')
    .optional(),
});

// Job application schema
export const jobApplicationSchema = z.object({
  jobId: z.number().int().positive(),
  name: z.string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جداً'),
  email: z.string()
    .email('البريد الإلكتروني غير صالح'),
  phone: z.string()
    .regex(/^\+?[0-9]{9,15}$/, 'رقم الهاتف غير صالح'),
  coverLetter: z.string()
    .max(5000, 'خطاب التقديم طويل جداً')
    .optional(),
});

// Login schema
export const loginSchema = z.object({
  email: z.string()
    .email('البريد الإلكتروني غير صالح'),
  password: z.string()
    .min(1, 'كلمة المرور مطلوبة'),
});

// Registration schema
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جداً'),
  email: z.string()
    .email('البريد الإلكتروني غير صالح'),
  password: z.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
    .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم')
    .regex(/[^A-Za-z0-9]/, 'يجب أن تحتوي على رمز خاص'),
  phone: z.string()
    .regex(/^\+?[0-9]{9,15}$/, 'رقم الهاتف غير صالح')
    .optional(),
  companyName: z.string()
    .max(200, 'اسم الشركة طويل جداً')
    .optional(),
});

// Tracking number schema
export const trackingSchema = z.object({
  barcode: z.string()
    .min(5, 'رقم التتبع قصير جداً')
    .max(30, 'رقم التتبع طويل جداً')
    .regex(/^[A-Z0-9]+$/, 'رقم التتبع غير صالح'),
});

// Blog post schema (admin)
export const blogPostSchema = z.object({
  title: z.string()
    .min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل')
    .max(200, 'العنوان طويل جداً'),
  slug: z.string()
    .regex(/^[a-z0-9-]+$/, 'الرابط يحتوي على أحرف غير صالحة'),
  excerpt: z.string()
    .max(500, 'الملخص طويل جداً')
    .optional(),
  content: z.string()
    .min(50, 'المحتوى يجب أن يكون 50 حرف على الأقل'),
  featuredImage: z.string()
    .url('رابط الصورة غير صالح')
    .optional(),
  status: z.enum(['draft', 'published', 'archived'])
    .default('draft'),
  metaTitle: z.string()
    .max(70, 'عنوان SEO طويل جداً')
    .optional(),
  metaDescription: z.string()
    .max(160, 'وصف SEO طويل جداً')
    .optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type QuoteFormData = z.infer<typeof quoteSchema>;
export type JobApplicationData = z.infer<typeof jobApplicationSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type TrackingData = z.infer<typeof trackingSchema>;
export type BlogPostData = z.infer<typeof blogPostSchema>;
