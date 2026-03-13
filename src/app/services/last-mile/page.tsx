'use client';

import Link from 'next/link';
import { FiTruck, FiClock, FiMapPin, FiSmartphone, FiCheckCircle, FiUsers } from 'react-icons/fi';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FAQ from '@/components/ui/FAQ';
import { useLanguage } from '@/lib/i18n';
import styles from './page.module.css';

export default function LastMilePage() {
  const { t, tArray, language } = useLanguage();

  const features = [
    {
      icon: FiClock,
      title: t('services.lastMile.features.sameDay.title'),
      description: t('services.lastMile.features.sameDay.description'),
    },
    {
      icon: FiMapPin,
      title: t('services.lastMile.features.gpsTracking.title'),
      description: t('services.lastMile.features.gpsTracking.description'),
    },
    {
      icon: FiClock,
      title: t('services.lastMile.features.flexibleSlots.title'),
      description: t('services.lastMile.features.flexibleSlots.description'),
    },
    {
      icon: FiUsers,
      title: t('services.lastMile.features.professionalTeam.title'),
      description: t('services.lastMile.features.professionalTeam.description'),
    },
  ];

  const benefits = tArray('services.lastMile.benefits');

  const faqItems = [
    {
      question: t('services.lastMile.faq.q1'),
      answer: t('services.lastMile.faq.a1'),
    },
    {
      question: t('services.lastMile.faq.q2'),
      answer: t('services.lastMile.faq.a2'),
    },
    {
      question: t('services.lastMile.faq.q3'),
      answer: t('services.lastMile.faq.a3'),
    },
    {
      question: t('services.lastMile.faq.q4'),
      answer: t('services.lastMile.faq.a4'),
    },
  ];

  // Structured Data for Service
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: language === 'ar' ? 'التوصيل للميل الأخير' : 'Last Mile Delivery',
    provider: {
      '@type': 'Organization',
      name: language === 'ar' ? 'تي دي للخدمات اللوجستية' : 'TD Logistics',
      url: 'https://tdlogistics.sa',
    },
    areaServed: {
      '@type': 'Country',
      name: language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia',
    },
    description: t('services.lastMile.description'),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className={styles.servicePage}>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Breadcrumbs 
        items={[
          { label: t('services.ourServices'), href: '/services' },
          { label: t('services.lastMile.title') }
        ]} 
      />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <div className={styles.iconWrapper}>
                <FiTruck />
              </div>
              <h1>{t('services.lastMile.title')}</h1>
              <p>{t('services.lastMile.description')}</p>
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
                <FiTruck size={80} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className="container">
          <div className={styles.benefitsContent}>
            <div className={styles.benefitsText}>
              <h2>{t('services.lastMile.whyChoose')}</h2>
              <p>{t('services.lastMile.whyChooseDesc')}</p>
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
                <FiSmartphone size={60} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ items={faqItems} />

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>{t('services.lastMile.ctaTitle')}</h2>
            <p>{t('services.lastMile.ctaDesc')}</p>
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
