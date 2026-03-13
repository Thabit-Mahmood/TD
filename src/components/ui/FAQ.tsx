'use client';

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './FAQ.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  description?: string;
}

export default function FAQ({ items, title, description }: FAQProps) {
  const { t } = useLanguage();
  const displayTitle = title || t('faq.title');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>{displayTitle}</h2>
          {description && <p>{description}</p>}
        </div>

        <div className={styles.faqList}>
          {items.map((item, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => toggleItem(index)}
                aria-expanded={openIndex === index}
              >
                <span>{item.question}</span>
                <FiChevronDown className={styles.icon} />
              </button>
              <div className={styles.faqAnswer}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
