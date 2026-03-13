'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from '../privacy/page.module.css';

export default function TermsPage() {
  const { t, tArray } = useLanguage();

  return (
    <div className={styles.legalPage}>
      <section className={styles.hero}>
        <div className="container">
          <h1>{t('terms.title')}</h1>
          <p>{t('terms.lastUpdated')}</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.contentCard}>
            <h2>{t('terms.intro.title')}</h2>
            <p>{t('terms.intro.content')}</p>

            <h2>{t('terms.definitions.title')}</h2>
            <ul>
              {tArray('terms.definitions.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2>{t('terms.serviceTerms.title')}</h2>
            <p>{t('terms.serviceTerms.content')}</p>
            <ul>
              {tArray('terms.serviceTerms.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2>{t('terms.prohibited.title')}</h2>
            <p>{t('terms.prohibited.content')}</p>
            <ul>
              {tArray('terms.prohibited.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2>{t('terms.liability.title')}</h2>
            <p>{t('terms.liability.content')}</p>
            <ul>
              {tArray('terms.liability.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2>{t('terms.payment.title')}</h2>
            <ul>
              {tArray('terms.payment.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2>{t('terms.cancellation.title')}</h2>
            <p>{t('terms.cancellation.content')}</p>

            <h2>{t('terms.disputes.title')}</h2>
            <p>{t('terms.disputes.content')}</p>

            <h2>{t('terms.modifications.title')}</h2>
            <p>{t('terms.modifications.content')}</p>

            <h2>{t('terms.contact.title')}</h2>
            <p>{t('terms.contact.content')}</p>
            <ul>
              <li>{t('terms.contact.email')}</li>
              <li>{t('terms.contact.phone')}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
