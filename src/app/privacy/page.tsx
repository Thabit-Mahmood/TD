'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './page.module.css';

export default function PrivacyPage() {
  const { t, tArray } = useLanguage();

  return (
    <div className={styles.legalPage}>
      <section className={styles.hero}>
        <div className="container">
          <h1>{t('privacy.title')}</h1>
          <p>{t('privacy.lastUpdated')}</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.contentCard}>
            <h2>{t('privacy.intro.title')}</h2>
            <p>{t('privacy.intro.content')}</p>

            <h2>{t('privacy.dataCollection.title')}</h2>
            <p>{t('privacy.dataCollection.content')}</p>
            <ul>
              {tArray('privacy.dataCollection.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2>{t('privacy.dataUsage.title')}</h2>
            <p>{t('privacy.dataUsage.content')}</p>
            <ul>
              {tArray('privacy.dataUsage.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2>{t('privacy.dataProtection.title')}</h2>
            <p>{t('privacy.dataProtection.content')}</p>
            <ul>
              {tArray('privacy.dataProtection.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2>{t('privacy.dataSharing.title')}</h2>
            <p>{t('privacy.dataSharing.content')}</p>
            <ul>
              {tArray('privacy.dataSharing.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2>{t('privacy.rights.title')}</h2>
            <p>{t('privacy.rights.content')}</p>
            <ul>
              {tArray('privacy.rights.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2>{t('privacy.cookies.title')}</h2>
            <p>{t('privacy.cookies.content')}</p>

            <h2>{t('privacy.contact.title')}</h2>
            <p>{t('privacy.contact.content')}</p>
            <ul>
              <li>{t('privacy.contact.email')}</li>
              <li>{t('privacy.contact.phone')}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
