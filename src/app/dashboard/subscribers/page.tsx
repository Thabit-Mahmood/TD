'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiArrowLeft, FiMail, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n';
import { formatNumber } from '@/lib/utils/formatNumber';
import styles from '../page.module.css';

interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  source: string;
  is_active: number;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export default function SubscribersPage() {
  const { t, language, isRTL } = useLanguage();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const sourceLabels: Record<string, string> = {
    contact: t('dashboard.subscribers.sourceContact'),
    quote: t('dashboard.subscribers.sourceQuote'),
    manual: t('dashboard.subscribers.sourceManual'),
    blog: t('dashboard.subscribers.sourceBlog'),
  };

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/subscribers', { cache: 'no-store' });
      const data = await res.json();
      if (data.subscribers) {
        setSubscribers(data.subscribers);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const toggleStatus = async (id: number, currentStatus: number) => {
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: currentStatus === 1 ? 0 : 1 }),
      });

      if (res.ok) {
        fetchSubscribers();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const deleteSubscriber = async (id: number) => {
    if (!confirm(t('dashboard.confirmDeleteSubscriber'))) return;

    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchSubscribers();
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Always use en-US to ensure Western numerals
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const filteredSubscribers = subscribers.filter(sub => {
    if (filter === 'active') return sub.is_active === 1;
    if (filter === 'inactive') return sub.is_active === 0;
    return true;
  });

  const activeCount = subscribers.filter(s => s.is_active === 1).length;
  const inactiveCount = subscribers.filter(s => s.is_active === 0).length;

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
            <h1>{t('dashboard.subscribersManagement')}</h1>
          </div>
          <button onClick={fetchSubscribers} className={styles.refreshBtn} disabled={loading}>
            <FiRefreshCw className={loading ? styles.spinning : ''} />
            {t('dashboard.refresh')}
          </button>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.primary}`}>
              <FiMail />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatNumber(subscribers.length)}</span>
              <span className={styles.statLabel}>{t('dashboard.subscribers.totalSubscribers')}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.success}`}>
              <FiCheck />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatNumber(activeCount)}</span>
              <span className={styles.statLabel}>{t('dashboard.subscribers.activeSubscribers')}</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.warning}`}>
              <FiX />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatNumber(inactiveCount)}</span>
              <span className={styles.statLabel}>{t('dashboard.subscribers.unsubscribed')}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('dashboard.subscribers.filterAll')} ({formatNumber(subscribers.length)})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'active' ? styles.active : ''}`}
            onClick={() => setFilter('active')}
          >
            {t('dashboard.subscribers.filterActive')} ({formatNumber(activeCount)})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'inactive' ? styles.active : ''}`}
            onClick={() => setFilter('inactive')}
          >
            {t('dashboard.subscribers.filterInactive')} ({formatNumber(inactiveCount)})
          </button>
        </div>

        {/* Table */}
        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.loading}>{t('dashboard.loading')}</div>
          ) : filteredSubscribers.length === 0 ? (
            <div className={styles.empty}>
              <p>{t('dashboard.subscribers.noSubscribers')}</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('dashboard.subscribers.tableEmail')}</th>
                  <th>{t('dashboard.subscribers.tableName')}</th>
                  <th>{t('dashboard.subscribers.tableSource')}</th>
                  <th>{t('dashboard.subscribers.tableStatus')}</th>
                  <th>{t('dashboard.subscribers.tableDate')}</th>
                  <th>{t('dashboard.subscribers.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td dir="ltr" style={{ textAlign: isRTL ? 'right' : 'left' }}>{subscriber.email}</td>
                    <td>{subscriber.name || '-'}</td>
                    <td>{sourceLabels[subscriber.source] || subscriber.source}</td>
                    <td>
                      <span className={`${styles.badge} ${subscriber.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                        {subscriber.is_active ? t('dashboard.subscribers.statusActive') : t('dashboard.subscribers.statusInactive')}
                      </span>
                    </td>
                    <td>{formatDate(subscriber.subscribed_at)}</td>
                    <td>
                      <div className={styles.tableActions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => toggleStatus(subscriber.id, subscriber.is_active)}
                          title={subscriber.is_active ? t('dashboard.subscribers.deactivate') : t('dashboard.subscribers.activate')}
                        >
                          {subscriber.is_active ? <FiX /> : <FiCheck />}
                          {subscriber.is_active ? t('dashboard.subscribers.deactivate') : t('dashboard.subscribers.activate')}
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() => deleteSubscriber(subscriber.id)}
                          title={t('dashboard.delete')}
                        >
                          {t('dashboard.delete')}
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
