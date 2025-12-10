'use client';

import { FiMapPin, FiTruck, FiUsers } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './QaseemSection.module.css';

export default function QaseemSection() {
  const { t } = useLanguage();

  return (
    <section className={styles.qaseemSection}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.textContent}>
            <div className={styles.badge}>
              <FiMapPin />
              <span>{t('qaseem.coverage')}</span>
            </div>
            <h2>{t('qaseem.title')}</h2>
            <p className={styles.subtitle}>{t('qaseem.subtitle')}</p>
            <p className={styles.description}>{t('qaseem.description')}</p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <FiMapPin className={styles.featureIcon} />
                <span>{t('qaseem.coverage')}</span>
              </div>
              <div className={styles.feature}>
                <FiTruck className={styles.featureIcon} />
                <span>{t('qaseem.fastDelivery')}</span>
              </div>
              <div className={styles.feature}>
                <FiUsers className={styles.featureIcon} />
                <span>{t('qaseem.localTeam')}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.mapContent}>
            <div className={styles.mapPlaceholder}>
              <div className={styles.mapIcon}>
                <FiMapPin />
              </div>
              <div className={styles.cities}>
                <span className={styles.city}>بريدة</span>
                <span className={styles.city}>عنيزة</span>
                <span className={styles.city}>الرس</span>
                <span className={styles.city}>المذنب</span>
                <span className={styles.city}>البكيرية</span>
                <span className={styles.city}>البدائع</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
