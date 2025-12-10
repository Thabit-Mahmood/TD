'use client';

import Link from 'next/link';
import { FiSmartphone, FiSettings, FiMail, FiBarChart, FiCheckCircle, FiActivity } from 'react-icons/fi';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FAQ from '@/components/ui/FAQ';
import { useLanguage } from '@/lib/i18n';
import styles from '../last-mile/page.module.css';

export default function TechnologyPage() {
  const { t, tArray, language } = useLanguage();

  const features = [
    {
      icon: FiSmartphone,
      title: t('services.technology.features.gps.title'),
      description: t('services.technology.features.gps.description'),
    },
    {
      icon: FiSettings,
      title: t('services.technology.features.api.title'),
      description: t('services.technology.features.api.description'),
    },
    {
      icon: FiMail,
      title: t('services.technology.features.notifications.title'),
      description: t('services.technology.features.notifications.description'),
    },
    {
      icon: FiBarChart,
      title: t('services.technology.features.analytics.title'),
      description: t('services.technology.features.analytics.description'),
    },
  ];

  const benefits = tArray('services.technology.benefits');

  const faqItems = [
    {
      question: t('services.technology.faq.q1'),
      answer: t('services.technology.faq.a1'),
    },
    {
      question: t('services.technology.faq.q2'),
      answer: t('services.technology.faq.a2'),
    },
    {
      question: t('services.technology.faq.q3'),
      answer: t('services.technology.faq.a3'),
    },
    {
      question: t('services.technology.faq.q4'),
      answer: t('services.technology.faq.a4'),
    },
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: language === 'ar' ? 'ميزات التكنولوجيا اللوجستية' : 'Logistics Technology Features',
    provider: {
      '@type': 'Organization',
      name: language === 'ar' ? 'تي دي للخدمات اللوجستية' : 'TD Logistics',
      url: 'https://tdlogistics.sa',
    },
    areaServed: {
      '@type': 'Country',
      name: language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia',
    },
    description: t('services.technology.description'),
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
          { label: t('services.technology.title') }
        ]} 
      />
      
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <div className={styles.iconWrapper}>
                <FiActivity />
              </div>
              <h1>{t('services.technology.title')}</h1>
              <p>{t('services.technology.description')}</p>
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
                <FiActivity size={80} />
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
              <h2>{t('services.technology.whyChoose')}</h2>
              <p>{t('services.technology.whyChooseDesc')}</p>
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
                <FiBarChart size={60} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ items={faqItems} />

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>{t('services.technology.ctaTitle')}</h2>
            <p>{t('services.technology.ctaDesc')}</p>
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
