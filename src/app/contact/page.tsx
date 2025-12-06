'use client';

import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiCheck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './page.module.css';

const contactInfo = [
  {
    icon: FiPhone,
    title: 'الهاتف',
    value: '+966 50 000 0000',
    href: 'tel:+966500000000',
  },
  {
    icon: FaWhatsapp,
    title: 'واتساب',
    value: '+966 50 000 0000',
    href: 'https://wa.me/966500000000',
  },
  {
    icon: FiMail,
    title: 'البريد الإلكتروني',
    value: 'info@tdlogistics.sa',
    href: 'mailto:info@tdlogistics.sa',
  },
  {
    icon: FiMapPin,
    title: 'العنوان',
    value: 'الرياض، المملكة العربية السعودية',
    href: '#',
  },
  {
    icon: FiClock,
    title: 'ساعات العمل',
    value: 'الأحد - الخميس: 8 ص - 6 م',
    href: '#',
  },
];

const contactTypes = [
  { value: 'general', label: 'استفسار عام' },
  { value: 'sales', label: 'المبيعات' },
  { value: 'support', label: 'الدعم الفني' },
  { value: 'partnership', label: 'الشراكات' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'general',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    if (!formData.subject.trim()) newErrors.subject = 'الموضوع مطلوب';
    if (!formData.message.trim()) newErrors.message = 'الرسالة مطلوبة';
    else if (formData.message.length < 10) {
      newErrors.message = 'الرسالة يجب أن تكون 10 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'حدث خطأ');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        type: 'general',
        subject: '',
        message: '',
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>اتصل بنا</h1>
          <p>نحن هنا لمساعدتك. تواصل معنا وسنرد عليك في أقرب وقت.</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.grid}>
            {/* Contact Info */}
            <div className={styles.infoSection}>
              <h2>معلومات التواصل</h2>
              <p className={styles.infoDesc}>
                يمكنك التواصل معنا عبر أي من القنوات التالية أو ملء النموذج وسنتواصل معك.
              </p>

              <div className={styles.infoList}>
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className={styles.infoItem}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <div className={styles.infoIcon}>
                      <item.icon />
                    </div>
                    <div>
                      <span className={styles.infoTitle}>{item.title}</span>
                      <span className={styles.infoValue}>{item.value}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.formSection}>
              <h2>أرسل رسالة</h2>
              
              {submitStatus === 'success' ? (
                <div className={styles.successMessage}>
                  <FiCheck className={styles.successIcon} />
                  <h3>تم إرسال رسالتك بنجاح!</h3>
                  <p>شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setSubmitStatus('idle')}
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className="input-group">
                      <label className="input-label">الاسم *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`input ${errors.name ? 'input-error' : ''}`}
                        placeholder="أدخل اسمك"
                        maxLength={100}
                      />
                      {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                    <div className="input-group">
                      <label className="input-label">البريد الإلكتروني *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`input ${errors.email ? 'input-error' : ''}`}
                        placeholder="example@email.com"
                        maxLength={255}
                        dir="ltr"
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className="input-group">
                      <label className="input-label">رقم الهاتف</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input"
                        placeholder="+966 5X XXX XXXX"
                        maxLength={15}
                        dir="ltr"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">اسم الشركة</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="input"
                        placeholder="اسم شركتك (اختياري)"
                        maxLength={200}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className="input-group">
                      <label className="input-label">نوع الاستفسار</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="input"
                      >
                        {contactTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="input-label">الموضوع *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`input ${errors.subject ? 'input-error' : ''}`}
                        placeholder="موضوع الرسالة"
                        maxLength={200}
                      />
                      {errors.subject && <span className="error-message">{errors.subject}</span>}
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">الرسالة *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`input ${errors.message ? 'input-error' : ''}`}
                      placeholder="اكتب رسالتك هنا..."
                      rows={5}
                      maxLength={5000}
                    />
                    {errors.message && <span className="error-message">{errors.message}</span>}
                  </div>

                  {submitStatus === 'error' && (
                    <div className={styles.errorAlert}>
                      حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="spinner"></span>
                    ) : (
                      <>
                        <FiSend />
                        إرسال الرسالة
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
