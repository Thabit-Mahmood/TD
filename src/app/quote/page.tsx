'use client';

import { useState, useCallback } from 'react';
import { FiSend, FiCheck, FiPackage, FiTruck, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n';
import WhyUs from '@/components/home/WhyUs';
import ClientLogos from '@/components/home/ClientLogos';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';
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

export default function QuotePage() {
  const { t, language } = useLanguage();

  const serviceTypes = [
    { value: 'delivery', label: t('quote.services.delivery'), icon: FiTruck },
    { value: 'fulfillment', label: t('quote.services.fulfillment'), icon: FiPackage },
    { value: 'returns', label: t('quote.services.returns'), icon: FiRefreshCw },
  ];

  const volumeOptions = [
    { value: '1-50', label: t('quote.volumes.1-50') },
    { value: '51-200', label: t('quote.volumes.51-200') },
    { value: '201-500', label: t('quote.volumes.201-500') },
    { value: '501-1000', label: t('quote.volumes.501-1000') },
    { value: '1000+', label: t('quote.volumes.1000+') },
  ];

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', serviceType: '',
    estimatedVolume: '', additionalDetails: '',
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
        if (!value.trim()) return t('validation.phoneRequired');
        if (!validatePhone(value)) return t('validation.phoneInvalid');
        return '';
      case 'serviceType':
        if (!value) return t('validation.serviceRequired');
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

  const handleServiceSelect = (value: string) => {
    setFormData(prev => ({ ...prev, serviceType: value }));
    setTouched(prev => ({ ...prev, serviceType: true }));
    setErrors(prev => ({ ...prev, serviceType: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const fields = ['name', 'email', 'phone', 'serviceType'];
    
    fields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, serviceType: true });
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
      const response = await fetch('/api/quote', {
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
          setServerError(data.error || t('quote.error'));
        }
        setSubmitStatus('error');
        return;
      }
      
      setSubmitStatus('success');
    } catch {
      setServerError(t('quote.error'));
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitStatus('idle');
    setFormData({ name: '', email: '', phone: '', company: '', serviceType: '', estimatedVolume: '', additionalDetails: '' });
    setTouched({});
    setErrors({});
    setServerError('');
  };

  const getInputClassName = (fieldName: string): string => {
    const hasError = touched[fieldName] && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && formData[fieldName as keyof typeof formData];
    return `input ${hasError ? 'input-error' : ''} ${isValid ? 'input-valid' : ''}`;
  };

  return (
    <div className={styles.quotePage}>
      <section className={styles.hero}>
        <div className="container">
          <h1>{t('quote.title')}</h1>
          <p>{t('quote.subtitle')}</p>
        </div>
      </section>
      <section className={styles.content}>
        <div className="container">
          {submitStatus === 'success' ? (
            <div className={styles.successCard}>
              <FiCheck className={styles.successIcon} />
              <h2>{t('quote.success.title')}</h2>
              <p>{t('quote.success.description')}</p>
              <button className="btn btn-primary" onClick={resetForm}>{t('quote.success.sendAnother')}</button>
            </div>
          ) : (
            <div className={styles.formCard}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.serviceSection}>
                  <h3>{t('quote.serviceType')} *</h3>
                  <div className={styles.serviceGrid}>
                    {serviceTypes.map((service) => (
                      <button 
                        key={service.value} 
                        type="button" 
                        className={`${styles.serviceOption} ${formData.serviceType === service.value ? styles.selected : ''}`} 
                        onClick={() => handleServiceSelect(service.value)}
                        disabled={isSubmitting}
                      >
                        <service.icon className={styles.serviceIcon} /><span>{service.label}</span>
                      </button>
                    ))}
                  </div>
                  {touched.serviceType && errors.serviceType && (
                    <span className="error-message">
                      <FiAlertCircle /> {errors.serviceType}
                    </span>
                  )}
                </div>
                <div className={styles.section}>
                  <h3>{t('quote.contactInfo')}</h3>
                  <div className={styles.formGrid}>
                    <div className="input-group">
                      <label className="input-label">{t('quote.form.name')} *</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        className={getInputClassName('name')} 
                        placeholder={t('quote.form.namePlaceholder')} 
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
                      <label className="input-label">{t('quote.form.company')}</label>
                      <input 
                        type="text" 
                        name="company" 
                        value={formData.company} 
                        onChange={handleChange} 
                        className="input" 
                        placeholder={t('quote.form.companyPlaceholder')} 
                        maxLength={200}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">{t('quote.form.email')} *</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        className={getInputClassName('email')} 
                        placeholder={t('quote.form.emailPlaceholder')} 
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
                    <div className="input-group">
                      <label className="input-label">{t('quote.form.phone')} *</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        className={getInputClassName('phone')} 
                        placeholder={t('quote.form.phonePlaceholder')} 
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
                  </div>
                </div>
                <div className={styles.section}>
                  <h3>{t('quote.shippingDetails')}</h3>
                  <div className={styles.formGrid}>
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                      <label className="input-label" htmlFor="estimatedVolume">{t('quote.form.volume')}</label>
                      <select 
                        id="estimatedVolume"
                        name="estimatedVolume" 
                        value={formData.estimatedVolume} 
                        onChange={handleChange} 
                        className="input"
                        disabled={isSubmitting}
                        aria-label={t('quote.form.volume')}
                      >
                        <option value="">{t('quote.form.volumePlaceholder')}</option>
                        {volumeOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="additionalDetails">{t('quote.form.additionalDetails')}</label>
                  <textarea 
                    id="additionalDetails"
                    name="additionalDetails" 
                    value={formData.additionalDetails} 
                    onChange={handleChange} 
                    className="input" 
                    placeholder={t('quote.form.additionalDetailsPlaceholder')} 
                    rows={4} 
                    maxLength={2000}
                    disabled={isSubmitting}
                  />
                </div>
                {serverError && (
                  <div className={styles.errorAlert}>
                    <FiAlertCircle /> {serverError}
                  </div>
                )}
                <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                  {isSubmitting ? <span className="spinner"></span> : <><FiSend />{t('quote.form.submit')}</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose TD Section */}
      <WhyUs />

      {/* E-Commerce Platforms Section */}
      <ClientLogos />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
