'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import FAQ from '@/components/ui/FAQ';

export default function HomeFAQ() {
  const { t } = useLanguage();

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
      question: t('faq.items.storage.question'),
      answer: t('faq.items.storage.answer'),
    },
    {
      question: t('faq.items.fulfillment.question'),
      answer: t('faq.items.fulfillment.answer'),
    },
    {
      question: t('faq.items.coverage_delivery.question'),
      answer: t('faq.items.coverage_delivery.answer'),
    },
    {
      question: t('faq.items.inventory_tracking.question'),
      answer: t('faq.items.inventory_tracking.answer'),
    },
  ];

  return (
    <FAQ 
      items={faqItems} 
      title={t('faq.title')}
      description={t('faq.description')} 
    />
  );
}
