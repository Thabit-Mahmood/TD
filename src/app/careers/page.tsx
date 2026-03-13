'use client';

import { useState, useCallback } from 'react';
import { FiBriefcase, FiMapPin, FiClock, FiSend, FiCheckCircle, FiUser, FiMail, FiPhone, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './page.module.css';

// Validation helpers
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^[\d+]{8,15}$/.test(cleaned);
};

const sanitizePhone = (value: string): string => {
  return value.replace(/[^\d\s+\-()]/g, '');
};

export default function CareersPage() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState('');

  const positions = [
    { id: 'driver', label: t('careers.positions.driver') },
    { id: 'customerService', label: t('careers.positions.customerService') },
    { id: 'warehouse', label: t('careers.positions.warehouse') },
    { id: 'operations', label: t('careers.positions.operations') },
    { id: 'sales', label: t('careers.positions.sales') },
    { id: 'it', label: t('careers.positions.it') },
    { id: 'other', label: t('careers.positions.other') },
  ];

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
        if (!value.trim()) return t('validation.phoneRequired');
        if (!validatePhone(value)) return t('validation.phoneInvalid');
        return '';
      case 'position':
        if (!value) return t('careers.form.selectPosition');
        return '';
      default:
        return '';
    }
  }, [t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    if (name === 'phone') {
      sanitizedValue = sanitizePhone(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    setServerError('');
    
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
    const fields = ['name', 'email', 'phone', 'position'];
    
    fields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, position: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const resetIn = data.resetIn ? Math.ceil(data.resetIn / 60000) : 60;
          setServerError(language === 'ar' 
            ? `لقد تجاوزت الحد المسموح من الطلبات. يرجى المحاولة بعد ${resetIn} دقيقة.`
            : `Too many requests. Please try again in ${resetIn} minutes.`
          );
        } else {
          setServerError(data.error || t('careers.form.error'));
        }
        return;
      }

      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', position: '', message: '' });
      setTouched({});
      setErrors({});
    } catch {
      setServerError(t('careers.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName: string): string => {
    const hasError = touched[fieldName] && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && formData[fieldName as keyof typeof formData];
    return `${styles.input} ${hasError ? styles.inputError : ''} ${isValid ? styles.inputValid : ''}`;
  };

  if (isSuccess) {
    return (
      <div className={styles.careersPage}>
        <section className={styles.hero}>
          <div className="container">
            <h1>{t('careers.title')}</h1>
            <p>{t('careers.subtitle')}</p>
          </div>
        </section>
        <section className={styles.content}>
          <div className="container">
            <div className={styles.successCard}>
              <FiCheckCircle className={styles.successIcon} />
              <h2>{t('careers.form.successTitle')}</h2>
              <p>{t('careers.form.successDesc')}</p>
              <button onClick={() => setIsSuccess(false)} className={styles.submitBtn}>
                {t('careers.form.sendAnother')}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.careersPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>{t('careers.title')}</h1>
          <p>{t('careers.subtitle')}</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.grid}>
            {/* Why Join Us */}
            <div className={styles.infoSection}>
              <h2>{t('careers.whyJoin.title')}</h2>
              <p className={styles.infoDesc}>{t('careers.whyJoin.description')}</p>
              
              <div className={styles.benefits}>
                <div className={styles.benefitItem}>
                  <FiBriefcase className={styles.benefitIcon} />
                  <div>
                    <h3>{t('careers.whyJoin.growth')}</h3>
                    <p>{t('careers.whyJoin.growthDesc')}</p>
                  </div>
                </div>
                <div className={styles.benefitItem}>
                  <FiMapPin className={styles.benefitIcon} />
                  <div>
                    <h3>{t('careers.whyJoin.locations')}</h3>
                    <p>{t('careers.whyJoin.locationsDesc')}</p>
                  </div>
                </div>
                <div className={styles.benefitItem}>
                  <FiClock className={styles.benefitIcon} />
                  <div>
                    <h3>{t('careers.whyJoin.flexibility')}</h3>
                    <p>{t('careers.whyJoin.flexibilityDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className={styles.formSection}>
              <h2>{t('careers.form.title')}</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">
                    <FiUser /> {t('careers.form.name')} <span>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('careers.form.namePlaceholder')}
                    className={getInputClassName('name')}
                    maxLength={100}
                    disabled={isSubmitting}
                  />
                  {touched.name && errors.name && (
                    <span className={styles.errorMessage}>
                      <FiAlertCircle /> {errors.name}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">
                    <FiMail /> {t('careers.form.email')} <span>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('careers.form.emailPlaceholder')}
                    className={getInputClassName('email')}
                    maxLength={255}
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  {touched.email && errors.email && (
                    <span className={styles.errorMessage}>
                      <FiAlertCircle /> {errors.email}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">
                    <FiPhone /> {t('careers.form.phone')} <span>*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('careers.form.phonePlaceholder')}
                    className={getInputClassName('phone')}
                    maxLength={15}
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  {touched.phone && errors.phone && (
                    <span className={styles.errorMessage}>
                      <FiAlertCircle /> {errors.phone}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="position">
                    <FiBriefcase /> {t('careers.form.position')} <span>*</span>
                  </label>
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClassName('position')}
                    disabled={isSubmitting}
                  >
                    <option value="">{t('careers.form.selectPosition')}</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>{pos.label}</option>
                    ))}
                  </select>
                  {touched.position && errors.position && (
                    <span className={styles.errorMessage}>
                      <FiAlertCircle /> {errors.position}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">
                    <FiFileText /> {t('careers.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('careers.form.messagePlaceholder')}
                    rows={4}
                    maxLength={2000}
                    disabled={isSubmitting}
                  />
                </div>

                {serverError && (
                  <div className={styles.error}>
                    <FiAlertCircle /> {serverError}
                  </div>
                )}

                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="spinner"></span>
                  ) : (
                    <>
                      <FiSend /> {t('careers.form.submit')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
