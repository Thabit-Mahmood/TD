'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiFileText, FiStar, FiPlus, FiEdit, FiEye, FiRefreshCw, FiSettings, FiMail, FiUsers, FiGrid } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatNumber } from '@/lib/utils/formatNumber';
import styles from './page.module.css';

interface BlogPost {
  id: number;
  title: string;
  status: string;
  created_at: string;
  views: number;
}

interface Review {
  id: number;
  customer_name: string;
  company_name: string | null;
  rating: number;
  status: string;
}

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ posts: 0, reviews: 0, views: 0, subscribers: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsRes, reviewsRes, subscribersRes] = await Promise.all([
        fetch('/api/admin/blog?limit=5', { cache: 'no-store' }),
        fetch('/api/admin/reviews?limit=5', { cache: 'no-store' }),
        fetch('/api/admin/subscribers', { cache: 'no-store' }),
      ]);

      const postsData = await postsRes.json();
      const reviewsData = await reviewsRes.json();
      const subscribersData = await subscribersRes.json();

      setPosts(postsData.posts || []);
      setReviews(reviewsData.reviews || []);
      
      const totalViews = (postsData.posts || []).reduce((sum: number, p: BlogPost) => sum + (p.views || 0), 0);
      const activeSubscribers = (subscribersData.subscribers || []).filter((s: { is_active: number }) => s.is_active === 1).length;
      
      setStats({
        posts: postsData.total || 0,
        reviews: reviewsData.total || 0,
        views: totalViews,
        subscribers: activeSubscribers,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    // Always use en-US to ensure Western numerals
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusLabel = (status: string) => {
    return t(`dashboard.status.${status}`) || status;
  };

  return (
    <div className={styles.dashboard}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1>{t('dashboard.title')}</h1>
            <p>{t('dashboard.subtitle')}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/dashboard/settings" className={styles.refreshBtn}>
              <FiSettings />
              {t('dashboard.settings')}
            </Link>
            <button onClick={fetchData} className={styles.refreshBtn} disabled={loading}>
              <FiRefreshCw className={loading ? styles.spinning : ''} />
              {t('dashboard.refresh')}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.primary}`}>
              <FiFileText />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatNumber(stats.posts)}</span>
              <span className={styles.statLabel}>{t('dashboard.blogPosts')}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.success}`}>
              <FiStar />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatNumber(stats.reviews)}</span>
              <span className={styles.statLabel}>{t('dashboard.customerReviews')}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.info}`}>
              <FiEye />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatNumber(stats.views)}</span>
              <span className={styles.statLabel}>{t('dashboard.blogViews')}</span>
            </div>
          </div>
          <Link href="/dashboard/subscribers" className={styles.statCard} style={{ textDecoration: 'none' }}>
            <div className={`${styles.statIcon} ${styles.warning}`}>
              <FiMail />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatNumber(stats.subscribers)}</span>
              <span className={styles.statLabel}>{t('dashboard.newsletterSubscribers')}</span>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className={styles.quickLinks}>
          <Link href="/dashboard/clients" className={styles.quickLinkCard}>
            <FiUsers className={styles.quickLinkIcon} />
            <span>{t('dashboard.clients.title')}</span>
          </Link>
          <Link href="/dashboard/brands" className={styles.quickLinkCard}>
            <FiGrid className={styles.quickLinkIcon} />
            <span>{t('dashboard.brands.title')}</span>
          </Link>
        </div>

        <div className={styles.mainGrid}>
          {/* Blog Posts Management */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>
                <FiFileText />
                {t('dashboard.blogPosts')}
              </h2>
              <Link href="/dashboard/blog/new" className="btn btn-primary btn-sm">
                <FiPlus />
                {t('dashboard.newPost')}
              </Link>
            </div>
            <div className={styles.contentList}>
              {loading ? (
                <div className={styles.loading}>{t('dashboard.loading')}</div>
              ) : posts.length === 0 ? (
                <div className={styles.empty}>{t('dashboard.noPosts')}</div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className={styles.contentItem}>
                    <div className={styles.contentInfo}>
                      <h3>{post.title}</h3>
                      <div className={styles.contentMeta}>
                        <span className={`${styles.badge} ${post.status === 'published' ? styles.badgeSuccess : styles.badgeWarning}`}>
                          {getStatusLabel(post.status)}
                        </span>
                        <span className={styles.date}>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                    <div className={styles.contentActions}>
                      <Link href={`/dashboard/blog/${post.id}`} className={styles.actionBtn}>
                        <FiEdit />
                        {t('dashboard.edit')}
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/dashboard/blog" className={styles.viewAll}>
              {t('dashboard.viewAllPosts')}
            </Link>
          </div>

          {/* Customer Reviews Management */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>
                <FiStar />
                {t('dashboard.customerReviews')}
              </h2>
              <Link href="/dashboard/reviews/new" className="btn btn-primary btn-sm">
                <FiPlus />
                {t('dashboard.newReview')}
              </Link>
            </div>
            <div className={styles.contentList}>
              {loading ? (
                <div className={styles.loading}>{t('dashboard.loading')}</div>
              ) : reviews.length === 0 ? (
                <div className={styles.empty}>{t('dashboard.noReviews')}</div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className={styles.contentItem}>
                    <div className={styles.contentInfo}>
                      <h3>{review.customer_name}</h3>
                      <p className={styles.company}>{review.company_name}</p>
                      <div className={styles.contentMeta}>
                        <div className={styles.rating}>
                          {[...Array(review.rating)].map((_, i) => (
                            <FiStar key={i} className={styles.starFilled} />
                          ))}
                        </div>
                        <span className={`${styles.badge} ${review.status === 'published' ? styles.badgeSuccess : styles.badgeWarning}`}>
                          {getStatusLabel(review.status)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.contentActions}>
                      <Link href={`/dashboard/reviews/${review.id}`} className={styles.actionBtn}>
                        <FiEdit />
                        {t('dashboard.edit')}
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/dashboard/reviews" className={styles.viewAll}>
              {t('dashboard.viewAllReviews')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
