'use client';

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n';
import CTA from '@/components/home/CTA';
import styles from './page.module.css';

export default function FAQPage() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      question: t('faq.items.coverage.question'),
      answer: t('faq.items.coverage.answer'),
    },
    {
      question: t('faq.items.tracking.question'),
      answer: t('faq.items.tracking.answer'),
    },
    {
      question: t('faq.items.cod.question'),
      answer: t('faq.items.cod.answer'),
    },
    {
      question: t('faq.items.onTime.question'),
      answer: t('faq.items.onTime.answer'),
    },
    {
      question: t('faq.items.quote.question'),
      answer: t('faq.items.quote.answer'),
    },
    {
      question: t('faq.items.integration.question'),
      answer: t('faq.items.integration.answer'),
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>{t('faq.title')}</h1>
          <p>{t('faq.description')}</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className={styles.content}>
        <div className="container">
          <div className={styles.faqList}>
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
              >
                <button
                  className={styles.question}
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{item.question}</span>
                  <FiChevronDown className={styles.icon} />
                </button>
                <div className={styles.answer}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
