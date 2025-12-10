'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit, FiTrash2, FiStar, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n';
import styles from '../page.module.css';

interface Review {
  id: number;
  customer_name: string;
  company_name: string | null;
  position: string | null;
  review_text: string;
  rating: number;
  status: string;
  created_at: string;
}

export default function ReviewsListPage() {
  const { t, language, isRTL } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/api/admin/reviews' : `/api/admin/reviews?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const handleDelete = async (id: number) => {
    if (!confirm(t('dashboard.confirmDeleteReview'))) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const formatDate = (dateString: string) => {
    // Always use en-US to ensure Western numerals
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t('dashboard.status.pending'),
      published: t('dashboard.status.published'),
      rejected: t('dashboard.status.rejected'),
    };
    return statusMap[status] || status;
  };

  const ArrowIcon = isRTL ? FiArrowRight : FiArrowLeft;

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <Link href="/dashboard" className={styles.backLink}>
              <ArrowIcon />
              {t('dashboard.backToDashboard')}
            </Link>
            <h1>{t('dashboard.reviewsManagement')}</h1>
          </div>
          <Link href="/dashboard/reviews/new" className="btn btn-primary">
            <FiPlus />
            {t('dashboard.newReview')}
          </Link>
        </div>

        <div className={styles.filters}>
          <button 
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('dashboard.reviews.filterAll')}
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'published' ? styles.active : ''}`}
            onClick={() => setFilter('published')}
          >
            {t('dashboard.reviews.filterPublished')}
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
            onClick={() => setFilter('pending')}
          >
            {t('dashboard.reviews.filterPending')}
          </button>
        </div>

        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.loading}>{t('dashboard.loading')}</div>
          ) : reviews.length === 0 ? (
            <div className={styles.empty}>
              <p>{t('dashboard.noReviews')}</p>
              <Link href="/dashboard/reviews/new" className="btn btn-primary">
                {t('dashboard.addNewReview')}
              </Link>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('dashboard.reviews.tableCustomer')}</th>
                  <th>{t('dashboard.reviews.tableCompany')}</th>
                  <th>{t('dashboard.reviews.tableRating')}</th>
                  <th>{t('dashboard.reviews.tableStatus')}</th>
                  <th>{t('dashboard.reviews.tableDate')}</th>
                  <th>{t('dashboard.reviews.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td>
                      <div className={styles.titleCell}>
                        <strong>{review.customer_name}</strong>
                        {review.position && <p>{review.position}</p>}
                      </div>
                    </td>
                    <td>{review.company_name || '-'}</td>
                    <td>
                      <div className={styles.rating}>
                        {[...Array(review.rating)].map((_, i) => (
                          <FiStar key={i} className={styles.starFilled} />
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${review.status === 'published' ? styles.badgeSuccess : styles.badgeWarning}`}>
                        {getStatusLabel(review.status)}
                      </span>
                    </td>
                    <td>{formatDate(review.created_at)}</td>
                    <td>
                      <div className={styles.tableActions}>
                        <Link href={`/dashboard/reviews/${review.id}`} className={styles.actionBtn}>
                          <FiEdit />
                        </Link>
                        <button onClick={() => handleDelete(review.id)} className={`${styles.actionBtn} ${styles.danger}`}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
