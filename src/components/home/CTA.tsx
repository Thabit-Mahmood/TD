'use client';

import Link from 'next/link';
import { FiArrowLeft, FiArrowRight, FiPhone } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './CTA.module.css';

export default function CTA() {
  const { t, isRTL } = useLanguage();

  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.ctaContent}>
          <div className={styles.ctaText}>
            <h2 className={styles.ctaTitle}>
              {t('home.cta.title')}
            </h2>
            <p className={styles.ctaSubtitle}>
              {t('home.cta.subtitle')}
            </p>
          </div>
          
          <div className={styles.ctaActions}>
            <Link href="/quote" className={styles.ctaPrimary}>
              {t('home.cta.getQuote')}
              {isRTL ? <FiArrowLeft /> : <FiArrowRight />}
            </Link>
            <a href="tel:920015499" className={styles.ctaSecondary}>
              <FiPhone />
              {t('home.cta.callNow')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
