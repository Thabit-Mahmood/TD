'use client';

import Link from 'next/link';
import { FiHome, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n';
import styles from './not-found.module.css';

export default function NotFound() {
  const { t, isRTL } = useLanguage();
  const Arrow = isRTL ? FiArrowLeft : FiArrowRight;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>{t('notFound.title')}</h1>
        <p className={styles.description}>{t('notFound.description')}</p>
        
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            <FiHome />
            <span>{t('notFound.goHome')}</span>
            <Arrow />
          </Link>
        </div>

        <div className={styles.suggestions}>
          <h2 className={styles.suggestionsTitle}>{t('notFound.suggestionsTitle')}</h2>
          <ul className={styles.suggestionsList}>
            <li>
              <Link href="/services">{t('nav.services')}</Link>
            </li>
            <li>
              <Link href="/tracking">{t('nav.tracking')}</Link>
            </li>
            <li>
              <Link href="/quote">{t('nav.getQuote')}</Link>
            </li>
            <li>
              <Link href="/contact">{t('nav.contact')}</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
