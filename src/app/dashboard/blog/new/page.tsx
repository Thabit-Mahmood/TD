'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowRight, FiArrowLeft, FiSave, FiEye } from 'react-icons/fi';
import ImageUploader from '@/components/admin/ImageUploader';
import { useLanguage } from '@/lib/i18n';
import styles from '../../page.module.css';

export default function NewBlogPostPage() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, publishNow = false) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError(t('dashboard.titleRequired'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const featured_image = images[0] || null;
      const additionalImages = images.slice(1);

      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          featured_image,
          images: additionalImages.length > 0 ? JSON.stringify(additionalImages) : null,
          status: publishNow ? 'published' : formData.status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('dashboard.errorOccurred'));
      }

      router.push('/dashboard/blog');
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
            <Link href="/dashboard/blog" className={styles.backLink}>
              <ArrowIcon />
              {t('dashboard.backToBlog')}
            </Link>
            <h1>{t('dashboard.newPost')}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.formCard}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('dashboard.blog.title')} *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder={t('dashboard.blog.titlePlaceholder')}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('dashboard.blog.excerpt')}</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className={styles.textarea}
              placeholder={t('dashboard.blog.excerptPlaceholder')}
              rows={3}
            />
          </div>

          {/* Image Uploader */}
          <ImageUploader
            images={images}
            onChange={setImages}
            folder="blog"
            maxImages={10}
            label={t('dashboard.blog.images')}
          />

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('dashboard.blog.content')} *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={styles.textarea}
              placeholder={t('dashboard.blog.contentPlaceholder')}
              rows={15}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('dashboard.blog.status')}</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="draft">{t('dashboard.status.draft')}</option>
              <option value="published">{t('dashboard.status.published')}</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('dashboard.blog.seoTitle')}</label>
            <input
              type="text"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleChange}
              className={styles.input}
              placeholder={t('dashboard.blog.seoTitlePlaceholder')}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('dashboard.blog.seoDescription')}</label>
            <textarea
              name="meta_description"
              value={formData.meta_description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder={t('dashboard.blog.seoDescriptionPlaceholder')}
              rows={2}
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-secondary" disabled={loading}>
              <FiSave />
              {t('dashboard.saveDraft')}
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
