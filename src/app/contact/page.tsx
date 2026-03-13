'use client';

import { useState, useCallback } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '@/lib/i18n';
import CTA from '@/components/home/CTA';
import styles from './page.module.css';

// Validation helpers
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone: string): boolean => {
  // Allow empty (optional field) or valid phone format
  if (!phone) return true;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^[\d+]{8,15}$/.test(cleaned);
};

const sanitizePhone = (value: string): string => {
  // Only allow digits, +, spaces, dashes, parentheses
  return value.replace(/[^\d\s+\-()]/g, '');
};

export default function ContactPage() {
  const { t, language } = useLanguage();
  
  const contactInfo = [
    {
      icon: FiPhone,
      title: t('contact.info.phone'),
      value: t('header.phoneDisplay'),
      href: 'tel:920015499',
      isPhone: true,
    },
    {
      icon: FaWhatsapp,
      title: t('contact.info.whatsapp'),
      value: t('header.phoneDisplay'),
      href: 'https://wa.me/966920015499',
      isPhone: true,
    },
    {
      icon: FiMail,
      title: t('contact.info.email'),
      value: 'info@tdlogistics.co',
      href: 'mailto:info@tdlogistics.co',
      isPhone: false,
    },
    {
      icon: FiMapPin,
      title: t('contact.info.address'),
      value: t('footer.address'),
      href: '#',
      isPhone: false,
    },
    {
      icon: FiClock,
      title: t('contact.info.workingHours'),
      value: t('footer.workingHours'),
      href: '#',
      isPhone: false,
    },
  ];

  const contactTypes = [
    { value: 'general', label: t('contact.types.general') },
    { value: 'sales', label: t('contact.types.sales') },
    { value: 'support', label: t('contact.types.support') },
    { value: 'partnership', label: t('contact.types.partnership') },
  ];

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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState('');

  // Real-time validation
  const validateField = useCallback((name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return t('validation.nameRequired');
        if (value.trim().length < 2) return t('validation.nameMinLength');
        return '';
      case 'email':
        if (!value.trim()) return t('validation.emailRequired');
        if (!validateEmail(value)) return t('validation.emailInvalid');
        return '';
      case 'phone':
        if (value && !validatePhone(value)) return t('validation.phoneInvalid');
        return '';
      case 'subject':
        if (!value.trim()) return t('validation.subjectRequired');
        return '';
      case 'message':
        if (!value.trim()) return t('validation.messageRequired');
        if (value.trim().length < 10) return t('validation.messageMinLength');
        return '';
      default:
        return '';
    }
  }, [t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    // Sanitize phone input - only allow numbers and phone characters
    if (name === 'phone') {
      sanitizedValue = sanitizePhone(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    setServerError('');
    
    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, sanitizedValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const fields = ['name', 'email', 'phone', 'subject', 'message'];
    
    fields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, subject: true, message: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setServerError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limit error specifically
        if (response.status === 429) {
          const resetIn = data.resetIn ? Math.ceil(data.resetIn / 60000) : 60;
          setServerError(language === 'ar' 
            ? `لقد تجاوزت الحد المسموح من الطلبات. يرجى المحاولة بعد ${resetIn} دقيقة.`
            : `Too many requests. Please try again in ${resetIn} minutes.`
          );
        } else {
          setServerError(data.error || t('contact.form.error'));
        }
        setSubmitStatus('error');
        return;
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
      setTouched({});
      setErrors({});
    } catch {
      setServerError(t('contact.form.error'));
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName: string): string => {
    const hasError = touched[fieldName] && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && formData[fieldName as keyof typeof formData];
    return `input ${hasError ? 'input-error' : ''} ${isValid ? 'input-valid' : ''}`;
  };

  return (
    <div className={styles.contactPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.grid}>
            {/* Contact Info */}
            <div className={styles.infoSection}>
              <h2>{t('contact.info.title')}</h2>
              <p className={styles.infoDesc}>
                {t('contact.info.description')}
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
                      <span className={`${styles.infoValue} ${item.isPhone ? styles.phoneValue : ''}`} dir={item.isPhone ? 'ltr' : undefined}>{item.value}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.formSection}>
              <h2>{t('contact.form.title')}</h2>
              
              {submitStatus === 'success' ? (
                <div className={styles.successMessage}>
                  <FiCheck className={styles.successIcon} />
                  <h3>{t('contact.form.success')}</h3>
                  <p>{t('contact.form.successDesc')}</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setSubmitStatus('idle')}
                  >
                    {t('contact.form.sendAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className="input-group">
                      <label className="input-label">{t('contact.form.name')} *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClassName('name')}
                        placeholder={t('contact.form.namePlaceholder')}
                        maxLength={100}
                        disabled={isSubmitting}
                      />
                      {touched.name && errors.name && (
                        <span className="error-message">
                          <FiAlertCircle /> {errors.name}
                        </span>
                      )}
                    </div>
                    <div className="input-group">
                      <label className="input-label">{t('contact.form.email')} *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClassName('email')}
                        placeholder={t('contact.form.emailPlaceholder')}
                        maxLength={255}
                        dir="ltr"
                        disabled={isSubmitting}
                      />
                      {touched.email && errors.email && (
                        <span className="error-message">
                          <FiAlertCircle /> {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className="input-group">
                      <label className="input-label">{t('contact.form.phone')}</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClassName('phone')}
                        placeholder={t('contact.form.phonePlaceholder')}
                        maxLength={15}
                        dir="ltr"
                        disabled={isSubmitting}
                      />
                      {touched.phone && errors.phone && (
                        <span className="error-message">
                          <FiAlertCircle /> {errors.phone}
                        </span>
                      )}
                    </div>
                    <div className="input-group">
                      <label className="input-label">{t('contact.form.company')}</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="input"
                        placeholder={t('contact.form.companyPlaceholder')}
                        maxLength={200}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className="input-group">
                      <label className="input-label">{t('contact.form.type')}</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="input"
                        disabled={isSubmitting}
                      >
                        {contactTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="input-label">{t('contact.form.subject')} *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClassName('subject')}
                        placeholder={t('contact.form.subjectPlaceholder')}
                        maxLength={200}
                        disabled={isSubmitting}
                      />
                      {touched.subject && errors.subject && (
                        <span className="error-message">
                          <FiAlertCircle /> {errors.subject}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">{t('contact.form.message')} *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getInputClassName('message')}
                      placeholder={t('contact.form.messagePlaceholder')}
                      rows={5}
                      maxLength={5000}
                      disabled={isSubmitting}
                    />
                    {touched.message && errors.message && (
                      <span className="error-message">
                        <FiAlertCircle /> {errors.message}
                      </span>
                    )}
                  </div>

                  {serverError && (
                    <div className={styles.errorAlert}>
                      <FiAlertCircle /> {serverError}
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
                        {t('contact.form.submit')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className={styles.locationSection}>
        <div className={styles.locationGrid}>
          {/* Map - 70% width */}
          <div className={styles.mapWrapper}>
            <iframe
              src="https://maps.google.com/maps?q=24.8499025,46.7660222&hl=en&z=15&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TD Logistics Location - Riyadh"
            ></iframe>
          </div>
          {/* Image - 30% width */}
          <div className={styles.imageWrapper}>
            <img 
              src="/support_map_section.webp" 
              alt="TD Logistics Location" 
              className={styles.locationImg}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
