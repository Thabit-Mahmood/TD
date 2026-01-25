'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import styles from './LanguageToggle.module.css';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<'ar' | 'en' | null>(null);

  const toggleLanguage = () => {
    if (isAnimating) return;
    
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setPendingLanguage(newLanguage);
    setIsAnimating(true);
    
    // Wait for animation to complete before changing language
    setTimeout(() => {
      setLanguage(newLanguage);
      setIsAnimating(false);
      setPendingLanguage(null);
    }, 400);
  };

  // Use pending language for visual state during animation
  const visualLanguage = pendingLanguage || language;

  return (
    <div className={styles.toggleContainer}>
      <button
        onClick={toggleLanguage}
        className={`${styles.toggle} ${visualLanguage === 'en' ? styles.english : styles.arabic}`}
        aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
        disabled={isAnimating}
      >
        <span className={`${styles.option} ${styles.arOption} ${visualLanguage === 'ar' ? styles.active : ''}`}>
          <span className={styles.label}>ع</span>
        </span>
        <span className={`${styles.option} ${styles.enOption} ${visualLanguage === 'en' ? styles.active : ''}`}>
          <span className={styles.label}>EN</span>
        </span>
        <span className={styles.slider} />
      </button>
    </div>
  );
}
