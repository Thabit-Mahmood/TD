import nodemailer from 'nodemailer';

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Language type
type Language = 'ar' | 'en';

// Email translations
const emailTranslations = {
  ar: {
    companyName: 'تي دي للخدمات اللوجستية',
    tagline: 'شريكك الموثوق في الشحن والتوصيل',
    contactUs: 'تواصل معنا على مدار الساعة',
    copyright: 'جميع الحقوق محفوظة',
    received: 'تم الاستلام',
    hello: 'مرحباً',
    thankYouContact: 'شكراً لتواصلك معنا! لقد استلمنا رسالتك وسيقوم فريقنا بالرد عليك في أقرب وقت ممكن.',
    inquiryType: 'نوع الاستفسار',
    subject: 'الموضوع',
    message: 'الرسالة',
    responseTime: 'نحرص على الرد على جميع الاستفسارات خلال',
    hours24: '24 ساعة',
    workHours: 'عمل',
    visitWebsite: 'زيارة موقعنا',
    newMessage: 'رسالة جديدة',
    newMessageFromSite: 'رسالة جديدة من الموقع',
    newMessageReceived: 'تم استلام رسالة جديدة من نموذج التواصل على الموقع.',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    company: 'الشركة',
    goToDashboard: 'الذهاب للوحة التحكم',
    requestReceived: 'تم استلام طلبك',
    thankYouQuote: 'شكراً لاهتمامك بخدماتنا! لقد استلمنا طلب عرض السعر الخاص بك وسيتواصل معك أحد ممثلي المبيعات قريباً.',
    serviceType: 'نوع الخدمة',
    originCity: 'مدينة الشحن',
    destinationCity: 'مدينة التوصيل',
    expectedVolume: 'الحجم المتوقع',
    willContactYou: 'سنتواصل معك خلال',
    toDiscussNeeds: 'لمناقشة احتياجاتك وتقديم أفضل عرض سعر.',
    exploreServices: 'استكشف خدماتنا',
    newQuoteRequest: 'طلب عرض سعر جديد',
    newQuoteReceived: 'تم استلام طلب عرض سعر جديد من الموقع.',
    additionalDetails: 'تفاصيل إضافية',
    newArticle: 'مقال جديد',
    dearReader: 'عزيزنا القارئ',
    newArticlePublished: 'تم نشر مقال جديد على مدونة تي دي للخدمات اللوجستية!',
    readArticle: 'قراءة المقال',
    subscribedToNewsletter: 'أنت مشترك في النشرة البريدية لتي دي للخدمات اللوجستية.',
    unsubscribe: 'إلغاء الاشتراك',
    welcomeToNewsletter: 'مرحباً بك',
    thankYouSubscribe: 'شكراً لاشتراكك في النشرة البريدية لتي دي للخدمات اللوجستية!',
    youWillReceive: 'ستصلك آخر الأخبار والمقالات والعروض الحصرية مباشرة إلى بريدك الإلكتروني.',
    whatYouGet: 'ما ستحصل عليه:',
    exclusiveArticles: 'مقالات حصرية عن الخدمات اللوجستية',
    shippingTips: 'نصائح لتحسين شحن متجرك الإلكتروني',
    latestNews: 'آخر أخبار وعروض تي دي',
    browseBlog: 'تصفح المدونة',
    confirmSubject: 'تأكيد استلام رسالتك',
    quoteConfirmSubject: 'تأكيد استلام طلب عرض السعر',
    welcomeSubject: 'مرحباً بك في النشرة البريدية',
    types: {
      general: 'استفسار عام',
      sales: 'المبيعات',
      support: 'الدعم الفني',
      partnership: 'الشراكات',
    },
    services: {
      'last-mile': 'توصيل الميل الأخير',
      ecommerce: 'شحن التجارة الإلكترونية',
      technology: 'الحلول التقنية',
      customized: 'حلول مخصصة',
    },
  },
  en: {
    companyName: 'TD Logistics',
    tagline: 'Your Trusted Partner in Shipping & Delivery',
    contactUs: 'Contact us 24/7',
    copyright: 'All rights reserved',
    received: 'Received',
    hello: 'Hello',
    thankYouContact: 'Thank you for contacting us! We have received your message and our team will respond as soon as possible.',
    inquiryType: 'Inquiry Type',
    subject: 'Subject',
    message: 'Message',
    responseTime: 'We respond to all inquiries within',
    hours24: '24 hours',
    workHours: 'business',
    visitWebsite: 'Visit Our Website',
    newMessage: 'New Message',
    newMessageFromSite: 'New Message from Website',
    newMessageReceived: 'A new message has been received from the contact form on the website.',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    company: 'Company',
    goToDashboard: 'Go to Dashboard',
    requestReceived: 'Request Received',
    thankYouQuote: 'Thank you for your interest in our services! We have received your quote request and a sales representative will contact you soon.',
    serviceType: 'Service Type',
    originCity: 'Origin City',
    destinationCity: 'Destination City',
    expectedVolume: 'Expected Volume',
    willContactYou: 'We will contact you within',
    toDiscussNeeds: 'to discuss your needs and provide the best quote.',
    exploreServices: 'Explore Our Services',
    newQuoteRequest: 'New Quote Request',
    newQuoteReceived: 'A new quote request has been received from the website.',
    additionalDetails: 'Additional Details',
    newArticle: 'New Article',
    dearReader: 'Dear Reader',
    newArticlePublished: 'A new article has been published on the TD Logistics blog!',
    readArticle: 'Read Article',
    subscribedToNewsletter: 'You are subscribed to the TD Logistics newsletter.',
    unsubscribe: 'Unsubscribe',
    welcomeToNewsletter: 'Welcome',
    thankYouSubscribe: 'Thank you for subscribing to the TD Logistics newsletter!',
    youWillReceive: 'You will receive the latest news, articles, and exclusive offers directly to your email.',
    whatYouGet: 'What you will get:',
    exclusiveArticles: 'Exclusive articles about logistics services',
    shippingTips: 'Tips to improve your e-commerce shipping',
    latestNews: 'Latest TD news and offers',
    browseBlog: 'Browse Blog',
    confirmSubject: 'Message Received Confirmation',
    quoteConfirmSubject: 'Quote Request Confirmation',
    welcomeSubject: 'Welcome to Our Newsletter',
    types: {
      general: 'General Inquiry',
      sales: 'Sales',
      support: 'Technical Support',
      partnership: 'Partnerships',
    },
    services: {
      'last-mile': 'Last Mile Delivery',
      ecommerce: 'E-commerce Shipping',
      technology: 'Technology Solutions',
      customized: 'Customized Solutions',
    },
  },
};

// Email templates with TD Logistics branding - Using inline styles for email client compatibility
const getBaseTemplate = (content: string, lang: Language = 'ar') => {
  const t = emailTranslations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const textAlign = lang === 'ar' ? 'right' : 'left';
  const fontFamily = lang === 'ar' ? "'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif" : "'Inter', 'Segoe UI', Tahoma, Arial, sans-serif";
  const fontLink = lang === 'ar' 
    ? "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap"
    : "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap";
  
  return `
<!DOCTYPE html>
<html dir="${dir}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>${t.companyName}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <link href="${fontLink}" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: ${fontFamily}; direction: ${dir}; text-align: ${textAlign};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td style="padding: 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #b23028 0%, #8b1f1a 100%); background-color: #b23028; padding: 30px; text-align: center;">
              <h1 style="margin: 0 0 8px 0; font-family: ${fontFamily}; font-size: 28px; font-weight: 700; color: #ffffff; direction: ${dir};">${t.companyName}</h1>
              <p style="margin: 0; font-family: ${fontFamily}; font-size: 14px; color: rgba(255, 255, 255, 0.9); direction: ${dir};">${t.tagline}</p>
            </td>
          </tr>
          <!-- Content -->
          ${content}
          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 30px; text-align: center;">
              <p style="margin: 0 0 15px 0; font-family: ${fontFamily}; font-size: 14px; color: #9ca3af; direction: ${dir};">${t.contactUs}</p>
              <p style="margin: 0 0 15px 0; font-family: ${fontFamily}; font-size: 14px; direction: ${dir};">
                <a href="tel:920015499" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">📞 9200 15499</a>
                <a href="mailto:info@tdlogistics.co" style="color: #9ca3af; text-decoration: none; margin: 0 10px;">✉️ info@tdlogistics.co</a>
              </p>
              <p style="margin: 20px 0 0 0; font-family: ${fontFamily}; font-size: 12px; color: #6b7280; direction: ${dir};">© ${new Date().getFullYear()} ${t.companyName}. ${t.copyright}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

// Helper function to create info row
const createInfoRow = (label: string, value: string, isLast = false, lang: Language = 'ar') => {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const textAlign = lang === 'ar' ? 'right' : 'left';
  const fontFamily = lang === 'ar' ? "'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif" : "'Inter', 'Segoe UI', Tahoma, Arial, sans-serif";
  
  return `
  <tr>
    <td style="padding: 12px 0; border-bottom: ${isLast ? 'none' : '1px solid #e5e7eb'}; font-family: ${fontFamily}; direction: ${dir}; text-align: ${textAlign};">
      <span style="font-weight: 600; color: #6b7280; display: block; margin-bottom: 4px;">${label}</span>
      <span style="color: #1f2937; display: block;">${value}</span>
    </td>
  </tr>
`;
};

// Customer confirmation email for contact form
export const sendContactConfirmation = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
  language?: Language;
}) => {
  const lang = data.language || 'ar';
  const t = emailTranslations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const textAlign = lang === 'ar' ? 'right' : 'left';
  const borderSide = lang === 'ar' ? 'border-right' : 'border-left';
  const fontFamily = lang === 'ar' ? "'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif" : "'Inter', 'Segoe UI', Tahoma, Arial, sans-serif";

  const content = `
    <tr>
      <td style="padding: 40px 30px; direction: ${dir}; text-align: ${textAlign};">
        <!-- Success Badge -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
          <tr>
            <td style="background-color: #10b981; color: white; padding: 6px 16px; border-radius: 20px; font-family: ${fontFamily}; font-size: 14px; font-weight: 600;">✓ ${t.received}</td>
          </tr>
        </table>
        
        <!-- Greeting -->
        <h1 style="margin: 0 0 20px 0; font-family: ${fontFamily}; font-size: 22px; font-weight: 700; color: #1f2937; direction: ${dir}; text-align: ${textAlign};">${t.hello} ${data.name}${lang === 'ar' ? '،' : ','}</h1>
        
        <!-- Message -->
        <p style="margin: 0 0 25px 0; font-family: ${fontFamily}; font-size: 16px; line-height: 1.8; color: #4b5563; direction: ${dir}; text-align: ${textAlign};">
          ${t.thankYouContact}
        </p>
        
        <!-- Info Box -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fafafa; border-radius: 8px; ${borderSide}: 4px solid #b23028; margin: 20px 0;">
          <tr>
            <td style="padding: 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${createInfoRow(`${t.inquiryType}:`, t.types[data.type as keyof typeof t.types] || data.type, false, lang)}
                ${createInfoRow(`${t.subject}:`, data.subject, false, lang)}
                ${createInfoRow(`${t.message}:`, data.message.substring(0, 200) + (data.message.length > 200 ? '...' : ''), true, lang)}
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Response Time -->
        <p style="margin: 0 0 25px 0; font-family: ${fontFamily}; font-size: 16px; line-height: 1.8; color: #4b5563; direction: ${dir}; text-align: ${textAlign};">
          ${t.responseTime} <span style="color: #b23028; font-weight: 600;">${t.hours24}</span> ${t.workHours}.
        </p>
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
          <tr>
            <td style="background: linear-gradient(135deg, #b23028 0%, #8b1f1a 100%); background-color: #b23028; border-radius: 8px;">
              <a href="https://tdlogistics.sa" style="display: inline-block; padding: 14px 32px; font-family: ${fontFamily}; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">${t.visitWebsite}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  await transporter.sendMail({
    from: `"${t.companyName}" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: `${t.confirmSubject} - ${data.subject}`,
    html: getBaseTemplate(content, lang),
  });
};

// Admin notification for new contact
export const sendContactAdminNotification = async (data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  type: string;
}) => {
  const typeLabels: Record<string, string> = {
    general: 'استفسار عام',
    sales: 'المبيعات',
    support: 'الدعم الفني',
    partnership: 'الشراكات',
  };

  const content = `
    <tr>
      <td style="padding: 40px 30px; direction: rtl; text-align: right;">
        <!-- Badge -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
          <tr>
            <td style="background-color: #3b82f6; color: white; padding: 6px 16px; border-radius: 20px; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 14px; font-weight: 600;">📩 رسالة جديدة</td>
          </tr>
        </table>
        
        <!-- Greeting -->
        <h1 style="margin: 0 0 20px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 22px; font-weight: 700; color: #1f2937; direction: rtl; text-align: right;">رسالة جديدة من الموقع</h1>
        
        <!-- Message -->
        <p style="margin: 0 0 25px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 16px; line-height: 1.8; color: #4b5563; direction: rtl; text-align: right;">
          تم استلام رسالة جديدة من نموذج التواصل على الموقع.
        </p>
        
        <!-- Contact Info Box -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fafafa; border-radius: 8px; border-right: 4px solid #b23028; margin: 20px 0;">
          <tr>
            <td style="padding: 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${createInfoRow('الاسم:', data.name)}
                ${createInfoRow('البريد الإلكتروني:', data.email)}
                ${data.phone ? createInfoRow('الهاتف:', data.phone) : ''}
                ${data.company ? createInfoRow('الشركة:', data.company) : ''}
                ${createInfoRow('نوع الاستفسار:', typeLabels[data.type] || data.type)}
                ${createInfoRow('الموضوع:', data.subject, true)}
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Message Box -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fafafa; border-radius: 8px; border-right: 4px solid #b23028; margin: 20px 0;">
          <tr>
            <td style="padding: 20px;">
              <p style="margin: 0 0 10px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-weight: 600; color: #6b7280; direction: rtl; text-align: right;">الرسالة:</p>
              <p style="margin: 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; color: #1f2937; white-space: pre-wrap; direction: rtl; text-align: right; line-height: 1.8;">${data.message}</p>
            </td>
          </tr>
        </table>
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
          <tr>
            <td style="background: linear-gradient(135deg, #b23028 0%, #8b1f1a 100%); background-color: #b23028; border-radius: 8px;">
              <a href="https://tdlogistics.sa/dashboard" style="display: inline-block; padding: 14px 32px; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">الذهاب للوحة التحكم</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  await transporter.sendMail({
    from: `"تي دي للخدمات اللوجستية" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    subject: `📩 رسالة جديدة: ${data.subject} - من ${data.name}`,
    html: getBaseTemplate(content),
  });
};

// Customer confirmation for quote request
export const sendQuoteConfirmation = async (data: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceType: string;
  originCity?: string;
  destinationCity?: string;
  estimatedVolume?: string;
  language?: Language;
}) => {
  const lang = data.language || 'ar';
  const t = emailTranslations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const textAlign = lang === 'ar' ? 'right' : 'left';
  const borderSide = lang === 'ar' ? 'border-right' : 'border-left';
  const fontFamily = lang === 'ar' ? "'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif" : "'Inter', 'Segoe UI', Tahoma, Arial, sans-serif";

  const content = `
    <tr>
      <td style="padding: 40px 30px; direction: ${dir}; text-align: ${textAlign};">
        <!-- Success Badge -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
          <tr>
            <td style="background-color: #10b981; color: white; padding: 6px 16px; border-radius: 20px; font-family: ${fontFamily}; font-size: 14px; font-weight: 600;">✓ ${t.requestReceived}</td>
          </tr>
        </table>
        
        <!-- Greeting -->
        <h1 style="margin: 0 0 20px 0; font-family: ${fontFamily}; font-size: 22px; font-weight: 700; color: #1f2937; direction: ${dir}; text-align: ${textAlign};">${t.hello} ${data.name}${lang === 'ar' ? '،' : ','}</h1>
        
        <!-- Message -->
        <p style="margin: 0 0 25px 0; font-family: ${fontFamily}; font-size: 16px; line-height: 1.8; color: #4b5563; direction: ${dir}; text-align: ${textAlign};">
          ${t.thankYouQuote}
        </p>
        
        <!-- Info Box -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fafafa; border-radius: 8px; ${borderSide}: 4px solid #b23028; margin: 20px 0;">
          <tr>
            <td style="padding: 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${createInfoRow(`${t.serviceType}:`, t.services[data.serviceType as keyof typeof t.services] || data.serviceType, false, lang)}
                ${data.originCity ? createInfoRow(`${t.originCity}:`, data.originCity, false, lang) : ''}
                ${data.destinationCity ? createInfoRow(`${t.destinationCity}:`, data.destinationCity, false, lang) : ''}
                ${data.estimatedVolume ? createInfoRow(`${t.expectedVolume}:`, data.estimatedVolume, true, lang) : ''}
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Response Time -->
        <p style="margin: 0 0 25px 0; font-family: ${fontFamily}; font-size: 16px; line-height: 1.8; color: #4b5563; direction: ${dir}; text-align: ${textAlign};">
          ${t.willContactYou} <span style="color: #b23028; font-weight: 600;">${t.hours24}</span> ${t.workHours} ${t.toDiscussNeeds}
        </p>
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
          <tr>
            <td style="background: linear-gradient(135deg, #b23028 0%, #8b1f1a 100%); background-color: #b23028; border-radius: 8px;">
              <a href="https://tdlogistics.sa/services" style="display: inline-block; padding: 14px 32px; font-family: ${fontFamily}; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">${t.exploreServices}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  await transporter.sendMail({
    from: `"${t.companyName}" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: `${t.quoteConfirmSubject} - ${t.companyName}`,
    html: getBaseTemplate(content, lang),
  });
};

// Admin notification for quote request
export const sendQuoteAdminNotification = async (data: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceType: string;
  originCity?: string;
  destinationCity?: string;
  estimatedVolume?: string;
  additionalDetails?: string;
}) => {
  const serviceLabels: Record<string, string> = {
    'last-mile': 'توصيل الميل الأخير',
    ecommerce: 'شحن التجارة الإلكترونية',
    technology: 'الحلول التقنية',
    customized: 'حلول مخصصة',
  };

  const content = `
    <tr>
      <td style="padding: 40px 30px; direction: rtl; text-align: right;">
        <!-- Badge -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
          <tr>
            <td style="background-color: #f59e0b; color: white; padding: 6px 16px; border-radius: 20px; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 14px; font-weight: 600;">💼 طلب عرض سعر جديد</td>
          </tr>
        </table>
        
        <!-- Greeting -->
        <h1 style="margin: 0 0 20px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 22px; font-weight: 700; color: #1f2937; direction: rtl; text-align: right;">طلب عرض سعر جديد</h1>
        
        <!-- Message -->
        <p style="margin: 0 0 25px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 16px; line-height: 1.8; color: #4b5563; direction: rtl; text-align: right;">
          تم استلام طلب عرض سعر جديد من الموقع.
        </p>
        
        <!-- Contact Info Box -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fafafa; border-radius: 8px; border-right: 4px solid #b23028; margin: 20px 0;">
          <tr>
            <td style="padding: 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${createInfoRow('الاسم:', data.name)}
                ${createInfoRow('البريد الإلكتروني:', data.email)}
                ${createInfoRow('الهاتف:', data.phone)}
                ${data.company ? createInfoRow('الشركة:', data.company) : ''}
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Service Info Box -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fafafa; border-radius: 8px; border-right: 4px solid #b23028; margin: 20px 0;">
          <tr>
            <td style="padding: 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; text-align: right;">
                    <span style="font-weight: 600; color: #6b7280; display: block; margin-bottom: 4px;">نوع الخدمة:</span>
                    <span style="color: #b23028; font-weight: 600; display: block;">${serviceLabels[data.serviceType] || data.serviceType}</span>
                  </td>
                </tr>
                ${data.originCity ? createInfoRow('مدينة الشحن:', data.originCity) : ''}
                ${data.destinationCity ? createInfoRow('مدينة التوصيل:', data.destinationCity) : ''}
                ${data.estimatedVolume ? createInfoRow('الحجم المتوقع:', data.estimatedVolume, true) : ''}
              </table>
            </td>
          </tr>
        </table>
        
        ${data.additionalDetails ? `
        <!-- Additional Details Box -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fafafa; border-radius: 8px; border-right: 4px solid #b23028; margin: 20px 0;">
          <tr>
            <td style="padding: 20px;">
              <p style="margin: 0 0 10px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-weight: 600; color: #6b7280; direction: rtl; text-align: right;">تفاصيل إضافية:</p>
              <p style="margin: 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; color: #1f2937; white-space: pre-wrap; direction: rtl; text-align: right; line-height: 1.8;">${data.additionalDetails}</p>
            </td>
          </tr>
        </table>
        ` : ''}
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
          <tr>
            <td style="background: linear-gradient(135deg, #b23028 0%, #8b1f1a 100%); background-color: #b23028; border-radius: 8px;">
              <a href="https://tdlogistics.sa/dashboard" style="display: inline-block; padding: 14px 32px; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">الذهاب للوحة التحكم</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  await transporter.sendMail({
    from: `"تي دي للخدمات اللوجستية" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    subject: `💼 طلب عرض سعر جديد: ${serviceLabels[data.serviceType] || data.serviceType} - ${data.name}`,
    html: getBaseTemplate(content),
  });
};

// Newsletter - New blog post notification
export const sendNewBlogPostNotification = async (
  subscribers: { email: string; name?: string }[],
  post: { title: string; excerpt: string; slug: string }
) => {
  for (const subscriber of subscribers) {
    const content = `
      <tr>
        <td style="padding: 40px 30px; direction: rtl; text-align: right;">
          <!-- Badge -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
            <tr>
              <td style="background-color: #8b5cf6; color: white; padding: 6px 16px; border-radius: 20px; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 14px; font-weight: 600;">📝 مقال جديد</td>
            </tr>
          </table>
          
          <!-- Greeting -->
          <h1 style="margin: 0 0 20px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 22px; font-weight: 700; color: #1f2937; direction: rtl; text-align: right;">مرحباً ${subscriber.name || 'عزيزنا القارئ'}،</h1>
          
          <!-- Message -->
          <p style="margin: 0 0 25px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 16px; line-height: 1.8; color: #4b5563; direction: rtl; text-align: right;">
            تم نشر مقال جديد على مدونة تي دي للخدمات اللوجستية!
          </p>
          
          <!-- Article Box -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fafafa; border-radius: 8px; border-right: 4px solid #b23028; margin: 20px 0;">
            <tr>
              <td style="padding: 20px;">
                <h2 style="margin: 0 0 10px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 18px; font-weight: 700; color: #1f2937; direction: rtl; text-align: right;">${post.title}</h2>
                <p style="margin: 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 15px; line-height: 1.7; color: #4b5563; direction: rtl; text-align: right;">${post.excerpt}</p>
              </td>
            </tr>
          </table>
          
          <!-- CTA Button -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
            <tr>
              <td style="background: linear-gradient(135deg, #b23028 0%, #8b1f1a 100%); background-color: #b23028; border-radius: 8px;">
                <a href="https://tdlogistics.sa/blog/${post.slug}" style="display: inline-block; padding: 14px 32px; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">قراءة المقال</a>
              </td>
            </tr>
          </table>
          
          <!-- Unsubscribe -->
          <p style="margin: 30px 0 0 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 13px; color: #9ca3af; direction: rtl; text-align: right;">
            أنت مشترك في النشرة البريدية لتي دي للخدمات اللوجستية.
            <br>
            <a href="https://tdlogistics.sa/unsubscribe?email=${encodeURIComponent(subscriber.email)}" style="color: #b23028; text-decoration: underline;">إلغاء الاشتراك</a>
          </p>
        </td>
      </tr>
    `;

    try {
      await transporter.sendMail({
        from: `"تي دي للخدمات اللوجستية" <${process.env.SMTP_USER}>`,
        to: subscriber.email,
        subject: `📝 مقال جديد: ${post.title}`,
        html: getBaseTemplate(content),
      });
    } catch (error) {
      console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
    }
  }
};

// Welcome email for newsletter subscription
export const sendNewsletterWelcome = async (data: { email: string; name?: string }) => {
  const content = `
    <tr>
      <td style="padding: 40px 30px; direction: rtl; text-align: right;">
        <!-- Badge -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
          <tr>
            <td style="background-color: #10b981; color: white; padding: 6px 16px; border-radius: 20px; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 14px; font-weight: 600;">🎉 مرحباً بك</td>
          </tr>
        </table>
        
        <!-- Greeting -->
        <h1 style="margin: 0 0 20px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 22px; font-weight: 700; color: #1f2937; direction: rtl; text-align: right;">مرحباً ${data.name || 'بك'}،</h1>
        
        <!-- Message -->
        <p style="margin: 0 0 20px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 16px; line-height: 1.8; color: #4b5563; direction: rtl; text-align: right;">
          شكراً لاشتراكك في النشرة البريدية لتي دي للخدمات اللوجستية!
        </p>
        
        <p style="margin: 0 0 25px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 16px; line-height: 1.8; color: #4b5563; direction: rtl; text-align: right;">
          ستصلك آخر الأخبار والمقالات والعروض الحصرية مباشرة إلى بريدك الإلكتروني.
        </p>
        
        <!-- Benefits Box -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fafafa; border-radius: 8px; border-right: 4px solid #b23028; margin: 20px 0;">
          <tr>
            <td style="padding: 20px;">
              <p style="margin: 0 0 15px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 15px; font-weight: 600; color: #4b5563; direction: rtl; text-align: right;">ما ستحصل عليه:</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding: 8px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 15px; color: #1f2937; direction: rtl; text-align: right;">✓ مقالات حصرية عن الخدمات اللوجستية</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 15px; color: #1f2937; direction: rtl; text-align: right;">✓ نصائح لتحسين شحن متجرك الإلكتروني</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 15px; color: #1f2937; direction: rtl; text-align: right;">✓ آخر أخبار وعروض تي دي</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- CTA Button -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
          <tr>
            <td style="background: linear-gradient(135deg, #b23028 0%, #8b1f1a 100%); background-color: #b23028; border-radius: 8px;">
              <a href="https://tdlogistics.sa/blog" style="display: inline-block; padding: 14px 32px; font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">تصفح المدونة</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  await transporter.sendMail({
    from: `"تي دي للخدمات اللوجستية" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: '🎉 مرحباً بك في النشرة البريدية - تي دي للخدمات اللوجستية',
    html: getBaseTemplate(content),
  });
};

// Career application confirmation email
export const sendCareerApplicationConfirmation = async (data: {
  name: string;
  email: string;
  position: string;
  language?: Language;
}) => {
  const lang = data.language || 'ar';
  const t = emailTranslations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const textAlign = lang === 'ar' ? 'right' : 'left';
  const fontFamily = lang === 'ar' ? "'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif" : "'Inter', 'Segoe UI', Tahoma, Arial, sans-serif";

  const positionLabels: Record<string, Record<string, string>> = {
    ar: {
      driver: 'مندوب توصيل',
      customerService: 'خدمة العملاء',
      warehouse: 'عمليات المستودعات',
      operations: 'العمليات',
      sales: 'المبيعات',
      it: 'تقنية المعلومات',
      other: 'أخرى',
    },
    en: {
      driver: 'Delivery Driver',
      customerService: 'Customer Service',
      warehouse: 'Warehouse Operations',
      operations: 'Operations',
      sales: 'Sales',
      it: 'IT',
      other: 'Other',
    },
  };

  const positionLabel = positionLabels[lang][data.position] || data.position;
  const subject = lang === 'ar' ? 'تم استلام طلب التوظيف الخاص بك' : 'Your Job Application Has Been Received';
  const greeting = lang === 'ar' ? `مرحباً ${data.name}،` : `Hello ${data.name},`;
  const message = lang === 'ar' 
    ? 'شكراً لاهتمامك بالانضمام إلى فريق تي دي للخدمات اللوجستية! لقد استلمنا طلبك وسيقوم فريق الموارد البشرية بمراجعته والتواصل معك قريباً.'
    : 'Thank you for your interest in joining TD Logistics! We have received your application and our HR team will review it and contact you soon.';
  const positionText = lang === 'ar' ? 'الوظيفة المتقدم لها:' : 'Position Applied For:';
  const responseText = lang === 'ar' ? 'سنتواصل معك خلال' : 'We will contact you within';
  const days = lang === 'ar' ? '5-7 أيام عمل' : '5-7 business days';

  const content = `
    <tr>
      <td style="padding: 40px 30px; direction: ${dir}; text-align: ${textAlign};">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
          <tr>
            <td style="background-color: #10b981; color: white; padding: 6px 16px; border-radius: 20px; font-family: ${fontFamily}; font-size: 14px; font-weight: 600;">✓ ${t.received}</td>
          </tr>
        </table>
        <h1 style="margin: 0 0 20px 0; font-family: ${fontFamily}; font-size: 22px; font-weight: 700; color: #1f2937;">${greeting}</h1>
        <p style="margin: 0 0 25px 0; font-family: ${fontFamily}; font-size: 16px; line-height: 1.8; color: #4b5563;">${message}</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fafafa; border-radius: 8px; border-${lang === 'ar' ? 'right' : 'left'}: 4px solid #b23028; margin: 20px 0;">
          <tr>
            <td style="padding: 20px;">
              <p style="margin: 0; font-family: ${fontFamily}; font-size: 15px;"><strong>${positionText}</strong> ${positionLabel}</p>
            </td>
          </tr>
        </table>
        <p style="margin: 0; font-family: ${fontFamily}; font-size: 16px; line-height: 1.8; color: #4b5563;">${responseText} <span style="color: #b23028; font-weight: 600;">${days}</span>.</p>
      </td>
    </tr>
  `;

  await transporter.sendMail({
    from: `"${t.companyName}" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: `${subject} - ${t.companyName}`,
    html: getBaseTemplate(content, lang),
  });
};

// Career application admin notification
export const sendCareerApplicationAdminNotification = async (data: {
  name: string;
  email: string;
  phone: string;
  position: string;
  message: string;
}) => {
  const positionLabels: Record<string, string> = {
    driver: 'مندوب توصيل',
    customerService: 'خدمة العملاء',
    warehouse: 'عمليات المستودعات',
    operations: 'العمليات',
    sales: 'المبيعات',
    it: 'تقنية المعلومات',
    other: 'أخرى',
  };

  const content = `
    <tr>
      <td style="padding: 40px 30px; direction: rtl; text-align: right;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
          <tr>
            <td style="background-color: #8b5cf6; color: white; padding: 6px 16px; border-radius: 20px; font-family: 'Cairo', sans-serif; font-size: 14px; font-weight: 600;">💼 طلب توظيف جديد</td>
          </tr>
        </table>
        <h1 style="margin: 0 0 20px 0; font-family: 'Cairo', sans-serif; font-size: 22px; font-weight: 700; color: #1f2937;">طلب توظيف جديد</h1>
        <p style="margin: 0 0 25px 0; font-family: 'Cairo', sans-serif; font-size: 16px; line-height: 1.8; color: #4b5563;">تم استلام طلب توظيف جديد من الموقع.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fafafa; border-radius: 8px; border-right: 4px solid #b23028; margin: 20px 0;">
          <tr>
            <td style="padding: 20px;">
              ${createInfoRow('الاسم:', data.name)}
              ${createInfoRow('البريد الإلكتروني:', data.email)}
              ${createInfoRow('الهاتف:', data.phone)}
              ${createInfoRow('الوظيفة:', positionLabels[data.position] || data.position, !data.message)}
              ${data.message ? createInfoRow('رسالة إضافية:', data.message, true) : ''}
            </td>
          </tr>
        </table>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0;">
          <tr>
            <td style="background: linear-gradient(135deg, #b23028 0%, #8b1f1a 100%); border-radius: 8px;">
              <a href="https://tdlogistics.sa/dashboard" style="display: inline-block; padding: 14px 32px; font-family: 'Cairo', sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">الذهاب للوحة التحكم</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  await transporter.sendMail({
    from: `"تي دي للخدمات اللوجستية" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    subject: `💼 طلب توظيف جديد: ${positionLabels[data.position] || data.position} - ${data.name}`,
    html: getBaseTemplate(content),
  });
};
