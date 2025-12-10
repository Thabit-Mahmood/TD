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

  return (
    <FAQ 
      items={faqItems} 
      title={t('faq.title')}
      description={t('faq.description')} 
    />
  );
}
