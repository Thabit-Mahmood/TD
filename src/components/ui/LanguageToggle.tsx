'use client';

import { useLanguage } from '@/lib/i18n';
import styles from './LanguageToggle.module.css';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={styles.toggle}
      aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      title={language === 'ar' ? 'English' : 'العربية'}
    >
      <span className={styles.flag}>
        {language === 'ar' ? '🇬🇧' : '🇸🇦'}
      </span>
      <span className={styles.label}>
        {language === 'ar' ? 'EN' : 'ع'}
      </span>
    </button>
  );
}
