'use client';

import Link from 'next/link';
import { FiCreditCard, FiRotateCcw, FiSettings, FiBarChart, FiCheckCircle, FiPackage } from 'react-icons/fi';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FAQ from '@/components/ui/FAQ';
import { useLanguage } from '@/lib/i18n';
import styles from '../last-mile/page.module.css';

export default function EcommercePage() {
  const { t, tArray, language } = useLanguage();

  const features = [
    {
      icon: FiCreditCard,
      title: t('services.ecommerce.features.cod.title'),
      description: t('services.ecommerce.features.cod.description'),
    },
    {
      icon: FiRotateCcw,
      title: t('services.ecommerce.features.returns.title'),
      description: t('services.ecommerce.features.returns.description'),
    },
    {
      icon: FiSettings,
      title: t('services.ecommerce.features.api.title'),
      description: t('services.ecommerce.features.api.description'),
    },
    {
      icon: FiBarChart,
      title: t('services.ecommerce.features.analytics.title'),
      description: t('services.ecommerce.features.analytics.description'),
    },
  ];

  const benefits = tArray('services.ecommerce.benefits');

  const faqItems = [
    {
      question: t('services.ecommerce.faq.q1'),
      answer: t('services.ecommerce.faq.a1'),
    },
    {
      question: t('services.ecommerce.faq.q2'),
      answer: t('services.ecommerce.faq.a2'),
    },
    {
      question: t('services.ecommerce.faq.q3'),
      answer: t('services.ecommerce.faq.a3'),
    },
    {
      question: t('services.ecommerce.faq.q4'),
      answer: t('services.ecommerce.faq.a4'),
    },
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: language === 'ar' ? 'حلول التجارة الإلكترونية' : 'E-commerce Solutions',
    provider: {
      '@type': 'Organization',
      name: language === 'ar' ? 'تي دي للخدمات اللوجستية' : 'TD Logistics',
      url: 'https://tdlogistics.sa',
    },
    areaServed: {
      '@type': 'Country',
      name: language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia',
    },
    description: t('services.ecommerce.description'),
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
          { label: t('services.ecommerce.title') }
        ]} 
      />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <div className={styles.iconWrapper}>
                <FiCreditCard />
              </div>
              <h1>{t('services.ecommerce.title')}</h1>
              <p>{t('services.ecommerce.description')}</p>
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
              <h2>{t('services.ecommerce.whyChoose')}</h2>
              <p>{t('services.ecommerce.whyChooseDesc')}</p>
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

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>{t('services.ecommerce.ctaTitle')}</h2>
            <p>{t('services.ecommerce.ctaDesc')}</p>
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
