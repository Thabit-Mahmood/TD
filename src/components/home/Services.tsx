'use client';

import Link from 'next/link';
import { FiTruck, FiPackage, FiSettings, FiCreditCard, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './Services.module.css';

// Updated order: Package Delivery, Fulfillment Services, E-commerce Solutions, Customized Delivery
const serviceKeys = [
  { icon: FiTruck, key: 'lastMile', link: '/services/last-mile' },
  { icon: FiPackage, key: 'fulfillment', link: '/services/fulfillment' },
  { icon: FiCreditCard, key: 'ecommerce', link: '/services/ecommerce' },
  { icon: FiSettings, key: 'customized', link: '/services/customized' },
];

export default function Services() {
  const { t, isRTL } = useLanguage();

  return (
    <section className={styles.services} id="services">
      <div className="container">
        <div className="section-title">
          <h2>{t('home.services.title')}</h2>
          <p>{t('home.services.subtitle')}</p>
        </div>

        <div className={styles.servicesGrid}>
          {serviceKeys.map((service, index) => (
            <Link key={index} href={service.link} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <service.icon />
              </div>
              <h3 className={styles.serviceTitle}>{t(`home.services.items.${service.key}.title`)}</h3>
              <p className={styles.serviceDesc}>{t(`home.services.items.${service.key}.description`)}</p>
              <div className={styles.serviceLink}>
                <span>{t('common.learnMore')}</span>
                {isRTL ? <FiArrowLeft /> : <FiArrowRight />}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
