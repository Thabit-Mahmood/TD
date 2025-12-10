'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ar from './translations/ar.json';
import en from './translations/en.json';

type Language = 'ar' | 'en';
type Translations = typeof ar;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
}

const translations: Record<Language, Translations> = { ar, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Update document direction and language
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.body.style.direction = language === 'ar' ? 'rtl' : 'ltr';
      document.body.style.textAlign = language === 'ar' ? 'right' : 'left';
      
      // Update font family
      if (language === 'en') {
        document.body.style.fontFamily = "'Inter', 'Segoe UI', sans-serif";
      } else {
        document.body.style.fontFamily = "'Cairo', sans-serif";
      }
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Get nested translation value by dot notation key
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  // Get nested translation array by dot notation key
  const tArray = (key: string): string[] => {
    const keys = key.split('.');
    let value: unknown = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return [];
      }
    }
    
    return Array.isArray(value) ? value : [];
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  // Default values for SSR
  const defaultT = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations['ar'];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  // Default array values for SSR
  const defaultTArray = (key: string): string[] => {
    const keys = key.split('.');
    let value: unknown = translations['ar'];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return [];
      }
    }
    
    return Array.isArray(value) ? value : [];
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t: mounted ? t : defaultT,
      tArray: mounted ? tArray : defaultTArray,
      dir, 
      isRTL 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
