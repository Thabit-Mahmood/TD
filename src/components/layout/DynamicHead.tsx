'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function DynamicHead() {
  const { t, language } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    // Map pathnames to SEO keys
    const getSeoKey = (path: string): string => {
      if (path === '/') return 'home';
      if (path.startsWith('/about')) return 'about';
      if (path.startsWith('/services')) return 'services';
      if (path.startsWith('/tracking')) return 'tracking';
      if (path.startsWith('/contact')) return 'contact';
      if (path.startsWith('/careers')) return 'careers';
      if (path.startsWith('/partners')) return 'partners';
      if (path.startsWith('/blog')) return 'blog';
      if (path.startsWith('/quote')) return 'quote';
      return 'home';
    };

    const seoKey = getSeoKey(pathname);
    const title = t(`seo.${seoKey}.title`);
    const description = t(`seo.${seoKey}.description`);

    // Update document title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', description);

    // Update Twitter tags
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', title);

    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', description);

    // Update html lang attribute
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';

  }, [pathname, language, t]);

  return null;
}
