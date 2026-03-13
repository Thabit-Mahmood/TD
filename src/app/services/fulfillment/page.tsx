'use client';

import Link from 'next/link';
import { FiPackage, FiBox, FiTruck, FiSettings, FiCheckCircle, FiDatabase } from 'react-icons/fi';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FAQ from '@/components/ui/FAQ';
import { useLanguage } from '@/lib/i18n';
import styles from '../last-mile/page.module.css';

export default function FulfillmentPage() {
  const { t, tArray, language } = useLanguage();

  const features = [
    {
      icon: FiBox,
      title: t('services.fulfillment.features.storage.title'),
      description: t('services.fulfillment.features.storage.description'),
    },
    {
      icon: FiDatabase,
      title: t('services.fulfillment.features.inventory.title'),
      description: t('services.fulfillment.features.inventory.description'),
    },
    {
      icon: FiTruck,
      title: t('services.fulfillment.features.packaging.title'),
      description: t('services.fulfillment.features.packaging.description'),
    },
    {
      icon: FiSettings,
      title: t('services.fulfillment.features.shipping.title'),
      description: t('services.fulfillment.features.shipping.description'),
    },
    {
      icon: FiPackage,
      title: t('services.fulfillment.features.reports.title'),
      description: t('services.fulfillment.features.reports.description'),
    },
    {
      icon: FiCheckCircle,
      title: t('services.fulfillment.features.support.title'),
      description: t('services.fulfillment.features.support.description'),
    },
  ];

  const benefits = tArray('services.fulfillment.benefits');

  const faqItems = [
    {
      question: t('services.fulfillment.faq.q1'),
      answer: t('services.fulfillment.faq.a1'),
    },
    {
      question: t('services.fulfillment.faq.q2'),
      answer: t('services.fulfillment.faq.a2'),
    },
    {
      question: t('services.fulfillment.faq.q3'),
      answer: t('services.fulfillment.faq.a3'),
    },
    {
      question: t('services.fulfillment.faq.q4'),
      answer: t('services.fulfillment.faq.a4'),
    },
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: language === 'ar' ? 'خدمة إدارة المخزون والشحن' : 'Fulfillment Services',
    provider: {
      '@type': 'Organization',
      name: language === 'ar' ? 'تي دي للخدمات اللوجستية' : 'TD Logistics',
      url: 'https://tdlogistics.sa',
    },
    areaServed: {
      '@type': 'Country',
      name: language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia',
    },
    description: t('services.fulfillment.description'),
  };

  return (
    <div className={styles.servicePage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Breadcrumbs 
        items={[
          { label: t('services.ourServices'), href: '/services' },
          { label: t('services.fulfillment.title') }
        ]} 
      />
      
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <div className={styles.iconWrapper}>
                <FiPackage />
              </div>
              <h1>{t('services.fulfillment.title')}</h1>
              <p>{t('services.fulfillment.description')}</p>
              <div className={styles.heroActions}>
                <Link href="/quote" className="btn btn-primary btn-lg">
                  {t('services.getQuote')}
                </Link>
                <Link href="/contact" className={styles.secondaryLink}>
                  {t('services.talkToSales')}
                </Link>
              </div>
            </div>
            <div className={styles.heroImage}>
              <div className={styles.imagePlaceholder}>
                <FiPackage size={80} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>{t('services.keyFeatures')}</h2>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <feature.icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.benefitsSection}>
        <div className="container">
          <div className={styles.benefitsContent}>
            <div className={styles.benefitsText}>
              <h2>{t('services.fulfillment.whyChoose')}</h2>
              <p>{t('services.fulfillment.whyChooseDesc')}</p>
              <div className={styles.benefitsList}>
                {benefits.map((benefit, index) => (
                  <div key={index} className={styles.benefitItem}>
                    <FiCheckCircle />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.benefitsImage}>
              <div className={styles.imagePlaceholder}>
                <FiSettings size={60} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>{t('services.fulfillment.ctaTitle')}</h2>
            <p>{t('services.fulfillment.ctaDesc')}</p>
            <div className={styles.ctaActions}>
              <Link href="/quote" className="btn btn-primary btn-lg">
                {t('services.requestQuoteNow')}
              </Link>
              <Link href="/services" className={styles.ctaSecondary}>
                {t('services.viewAllServices')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
