'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowRight, FiArrowLeft, FiSave, FiEye, FiStar } from 'react-icons/fi';
import ImageUploader from '@/components/admin/ImageUploader';
import { useLanguage } from '@/lib/i18n';
import styles from '../../page.module.css';

export default function NewReviewPage() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatarImages, setAvatarImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    customer_name: '',
    company_name: '',
    position: '',
    review_text: '',
    rating: 5,
    status: 'pending',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent, publishNow = false) => {
    e.preventDefault();
    
    if (!formData.customer_name.trim() || !formData.review_text.trim()) {
      setError(t('dashboard.reviewRequired'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          avatar_url: avatarImages[0] || null,
          status: publishNow ? 'published' : formData.status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('dashboard.errorOccurred'));
      }

      router.push('/dashboard/reviews');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dashboard.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = isRTL ? FiArrowRight : FiArrowLeft;

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <Link href="/dashboard/reviews" className={styles.backLink}>
              <ArrowIcon />
              {t('dashboard.backToReviews')}
            </Link>
            <h1>{t('dashboard.newReview')}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.formCard}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('dashboard.reviews.customerName')} *</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                className={styles.input}
                placeholder={t('dashboard.reviews.customerNamePlaceholder')}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t('dashboard.reviews.companyName')}</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className={styles.input}
                placeholder={t('dashboard.reviews.companyNamePlaceholder')}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('dashboard.reviews.position')}</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={styles.input}
                placeholder={t('dashboard.reviews.positionPlaceholder')}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t('dashboard.reviews.rating')}</label>
              <div className={styles.ratingInput}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.starBtn} ${formData.rating >= star ? styles.active : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  >
                    <FiStar />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Avatar Uploader */}
          <ImageUploader
            images={avatarImages}
            onChange={setAvatarImages}
            folder="avatars"
            single={true}
            label={t('dashboard.reviews.customerImage')}
          />

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('dashboard.reviews.reviewText')} *</label>
            <textarea
              name="review_text"
              value={formData.review_text}
              onChange={handleChange}
              className={styles.textarea}
              placeholder={t('dashboard.reviews.reviewTextPlaceholder')}
              rows={5}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('dashboard.reviews.status')}</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="pending">{t('dashboard.reviews.statusPending')}</option>
              <option value="published">{t('dashboard.reviews.statusPublished')}</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-secondary" disabled={loading}>
              <FiSave />
              {t('common.save')}
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              disabled={loading}
              onClick={(e) => handleSubmit(e, true)}
            >
              <FiEye />
              {t('dashboard.publishNow')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
