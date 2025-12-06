'use client';

import { useState } from 'react';
import { FiSend, FiCheck, FiPackage, FiTruck, FiBox, FiRefreshCw } from 'react-icons/fi';
import styles from './page.module.css';

const serviceTypes = [
  { value: 'delivery', label: 'التوصيل السريع', icon: FiTruck },
  { value: 'storage', label: 'التخزين والمستودعات', icon: FiBox },
  { value: 'fulfillment', label: 'خدمات الفلفلمنت', icon: FiPackage },
  { value: 'returns', label: 'إدارة المرتجعات', icon: FiRefreshCw },
];

const volumeOptions = [
  { value: '1-50', label: '1-50 شحنة شهرياً' },
  { value: '51-200', label: '51-200 شحنة شهرياً' },
  { value: '201-500', label: '201-500 شحنة شهرياً' },
  { value: '501-1000', label: '501-1000 شحنة شهرياً' },
  { value: '1000+', label: 'أكثر من 1000 شحنة شهرياً' },
];

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    originCity: '',
    destinationCity: '',
    estimatedVolume: '',
    additionalDetails: '',
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

  const handleServiceSelect = (value: string) => {
    setFormData(prev => ({ ...prev, serviceType: value }));
    if (errors.serviceType) {
      setErrors(prev => ({ ...prev, serviceType: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.serviceType) newErrors.serviceType = 'يرجى اختيار نوع الخدمة';

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
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.quotePage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>اطلب عرض سعر</h1>
          <p>احصل على عرض سعر مخصص لاحتياجات عملك. فريقنا سيتواصل معك خلال 24 ساعة.</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          {submitStatus === 'success' ? (
            <div className={styles.successCard}>
              <FiCheck className={styles.successIcon} />
              <h2>تم إرسال طلبك بنجاح!</h2>
              <p>شكراً لاهتمامك بخدماتنا. سيتواصل معك أحد ممثلي المبيعات خلال 24 ساعة.</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSubmitStatus('idle');
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    serviceType: '',
                    originCity: '',
                    destinationCity: '',
                    estimatedVolume: '',
                    additionalDetails: '',
                  });
                }}
              >
                إرسال طلب آخر
              </button>
            </div>
          ) : (
            <div className={styles.formCard}>
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Service Type Selection */}
                <div className={styles.serviceSection}>
                  <h3>اختر نوع الخدمة *</h3>
                  <div className={styles.serviceGrid}>
                    {serviceTypes.map((service) => (
                      <button
                        key={service.value}
                        type="button"
                        className={`${styles.serviceOption} ${formData.serviceType === service.value ? styles.selected : ''}`}
                        onClick={() => handleServiceSelect(service.value)}
                      >
                        <service.icon className={styles.serviceIcon} />
                        <span>{service.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.serviceType && <span className="error-message">{errors.serviceType}</span>}
                </div>

                {/* Contact Info */}
                <div className={styles.section}>
                  <h3>معلومات التواصل</h3>
                  <div className={styles.formGrid}>
                    <div className="input-group">
                      <label className="input-label">الاسم الكامل *</label>
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
                    <div className="input-group">
                      <label className="input-label">رقم الهاتف *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`input ${errors.phone ? 'input-error' : ''}`}
                        placeholder="+966 5X XXX XXXX"
                        maxLength={15}
                        dir="ltr"
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className={styles.section}>
                  <h3>تفاصيل الشحن</h3>
                  <div className={styles.formGrid}>
                    <div className="input-group">
                      <label className="input-label">مدينة الشحن</label>
                      <input
                        type="text"
                        name="originCity"
                        value={formData.originCity}
                        onChange={handleChange}
                        className="input"
                        placeholder="مثال: الرياض"
                        maxLength={100}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">مدينة التوصيل</label>
                      <input
                        type="text"
                        name="destinationCity"
                        value={formData.destinationCity}
                        onChange={handleChange}
                        className="input"
                        placeholder="مثال: جدة"
                        maxLength={100}
                      />
                    </div>
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                      <label className="input-label">حجم الشحنات المتوقع</label>
                      <select
                        name="estimatedVolume"
                        value={formData.estimatedVolume}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="">اختر الحجم المتوقع</option>
                        {volumeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="input-group">
                  <label className="input-label">تفاصيل إضافية</label>
                  <textarea
                    name="additionalDetails"
                    value={formData.additionalDetails}
                    onChange={handleChange}
                    className="input"
                    placeholder="أي تفاصيل إضافية تود مشاركتها معنا..."
                    rows={4}
                    maxLength={2000}
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className={styles.errorAlert}>
                    حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.
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
                      إرسال الطلب
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
