'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n';
import styles from './page.module.css';

function UnsubscribeContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus('error');
      setMessage(t('unsubscribe.noEmail'));
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('unsubscribe.error'));
      }

      setStatus('success');
      setMessage(t('unsubscribe.success'));
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : t('unsubscribe.error'));
    }
  };

  useEffect(() => {
    if (email && status === 'idle') {
      handleUnsubscribe();
    }
  }, [email]);

  return (
    <div className={styles.unsubscribePage}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            {status === 'success' ? (
              <FiCheck className={styles.successIcon} />
            ) : status === 'error' ? (
              <FiAlertCircle className={styles.errorIcon} />
            ) : (
              <FiMail className={styles.mailIcon} />
            )}
          </div>

          <h1>{t('unsubscribe.title')}</h1>

          {status === 'loading' && (
            <p className={styles.loadingText}>{t('common.loading')}</p>
          )}

          {status === 'success' && (
            <>
              <p className={styles.successText}>{message}</p>
              <p className={styles.subText}>{t('unsubscribe.successDesc')}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <p className={styles.errorText}>{message}</p>
            </>
          )}

          {status === 'idle' && !email && (
            <p className={styles.errorText}>{t('unsubscribe.noEmail')}</p>
          )}

          <div className={styles.actions}>
            <Link href="/" className="btn btn-primary">
              {t('unsubscribe.backHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  const { t } = useLanguage();
  
  return (
    <Suspense fallback={
      <div className={styles.unsubscribePage}>
        <div className="container">
          <div className={styles.card}>
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
