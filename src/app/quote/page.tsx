'use client';

import { useState } from 'react';
import { FiSend, FiCheck, FiPackage, FiTruck, FiBox, FiRefreshCw } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n';
import styles from './page.module.css';

export default function QuotePage() {
  const { t, language } = useLanguage();

  const serviceTypes = [
    { value: 'delivery', label: t('quote.services.delivery'), icon: FiTruck },
    { value: 'storage', label: t('quote.services.storage'), icon: FiBox },
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
    originCity: '', destinationCity: '', estimatedVolume: '', additionalDetails: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleServiceSelect = (value: string) => {
    setFormData(prev => ({ ...prev, serviceType: value }));
    if (errors.serviceType) setErrors(prev => ({ ...prev, serviceType: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t('validation.nameRequired');
    else if (formData.name.trim().length < 2) newErrors.name = t('validation.nameMinLength');
    if (!formData.email.trim()) newErrors.email = t('validation.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('validation.emailInvalid');
    if (!formData.phone.trim()) newErrors.phone = t('validation.phoneRequired');
    else if (!/^[\d\s+()-]{8,15}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = t('validation.phoneInvalid');
    if (!formData.serviceType) newErrors.serviceType = t('validation.serviceRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language }),
      });
      if (!response.ok) throw new Error('Failed');
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitStatus('idle');
    setFormData({ name: '', email: '', phone: '', company: '', serviceType: '', originCity: '', destinationCity: '', estimatedVolume: '', additionalDetails: '' });
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
                      <button key={service.value} type="button" className={`${styles.serviceOption} ${formData.serviceType === service.value ? styles.selected : ''}`} onClick={() => handleServiceSelect(service.value)}>
                        <service.icon className={styles.serviceIcon} /><span>{service.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.serviceType && <span className="error-message">{errors.serviceType}</span>}
                </div>
                <div className={styles.section}>
                  <h3>{t('quote.contactInfo')}</h3>
                  <div className={styles.formGrid}>
                    <div className="input-group">
                      <label className="input-label">{t('quote.form.name')} *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} className={`input ${errors.name ? 'input-error' : ''}`} placeholder={t('quote.form.namePlaceholder')} maxLength={100} />
                      {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                    <div className="input-group">
                      <label className="input-label">{t('quote.form.company')}</label>
                      <input type="text" name="company" value={formData.company} onChange={handleChange} className="input" placeholder={t('quote.form.companyPlaceholder')} maxLength={200} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">{t('quote.form.email')} *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className={`input ${errors.email ? 'input-error' : ''}`} placeholder={t('quote.form.emailPlaceholder')} maxLength={255} dir="ltr" />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="input-group">
                      <label className="input-label">{t('quote.form.phone')} *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`input ${errors.phone ? 'input-error' : ''}`} placeholder={t('quote.form.phonePlaceholder')} maxLength={15} dir="ltr" />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                  </div>
                </div>
                <div className={styles.section}>
                  <h3>{t('quote.shippingDetails')}</h3>
                  <div className={styles.formGrid}>
                    <div className="input-group">
                      <label className="input-label">{t('quote.form.originCity')}</label>
                      <input type="text" name="originCity" value={formData.originCity} onChange={handleChange} className="input" placeholder={t('quote.form.originCityPlaceholder')} maxLength={100} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">{t('quote.form.destinationCity')}</label>
                      <input type="text" name="destinationCity" value={formData.destinationCity} onChange={handleChange} className="input" placeholder={t('quote.form.destinationCityPlaceholder')} maxLength={100} />
                    </div>
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                      <label className="input-label">{t('quote.form.volume')}</label>
                      <select name="estimatedVolume" value={formData.estimatedVolume} onChange={handleChange} className="input">
                        <option value="">{t('quote.form.volumePlaceholder')}</option>
                        {volumeOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">{t('quote.form.additionalDetails')}</label>
                  <textarea name="additionalDetails" value={formData.additionalDetails} onChange={handleChange} className="input" placeholder={t('quote.form.additionalDetailsPlaceholder')} rows={4} maxLength={2000} />
                </div>
                {submitStatus === 'error' && <div className={styles.errorAlert}>{t('quote.error')}</div>}
                <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                  {isSubmitting ? <span className="spinner"></span> : <><FiSend />{t('quote.form.submit')}</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
