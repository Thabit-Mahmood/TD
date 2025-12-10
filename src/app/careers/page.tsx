'use client';

import { useState } from 'react';
import { FiBriefcase, FiMapPin, FiClock, FiSend, FiCheckCircle, FiUser, FiMail, FiPhone, FiFileText } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './page.module.css';

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
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.position) {
      setError(t('careers.form.fillRequired'));
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('careers.form.error'));
      }

      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', position: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('careers.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const positions = [
    { id: 'driver', label: t('careers.positions.driver') },
    { id: 'customerService', label: t('careers.positions.customerService') },
    { id: 'warehouse', label: t('careers.positions.warehouse') },
    { id: 'operations', label: t('careers.positions.operations') },
    { id: 'sales', label: t('careers.positions.sales') },
    { id: 'it', label: t('careers.positions.it') },
    { id: 'other', label: t('careers.positions.other') },
  ];

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
                    placeholder={t('careers.form.namePlaceholder')}
                    required
                  />
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
                    placeholder={t('careers.form.emailPlaceholder')}
                    required
                  />
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
                    placeholder={t('careers.form.phonePlaceholder')}
                    dir="ltr"
                    required
                  />
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
                    required
                  >
                    <option value="">{t('careers.form.selectPosition')}</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>{pos.label}</option>
                    ))}
                  </select>
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
                  />
                </div>

                {error && <div className={styles.error}>{error}</div>}

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
