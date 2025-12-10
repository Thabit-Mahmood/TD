'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './ClientLogos.module.css';

interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
}

// Default platforms if no brands in database
const defaultPlatforms = [
  { id: 1, name: 'noon', logo_url: null },
  { id: 2, name: 'Zid', logo_url: null },
  { id: 3, name: 'Salla', logo_url: null },
  { id: 4, name: 'Shopify', logo_url: null },
  { id: 5, name: 'WooCommerce', logo_url: null },
];

export default function ClientLogos() {
  const { t } = useLanguage();
  const [brands, setBrands] = useState<Brand[]>(defaultPlatforms);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('/api/brands?type=platform', { cache: 'no-store' });
        const data = await res.json();
        if (data.brands && data.brands.length > 0) {
          setBrands(data.brands);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (brands.length <= 5) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % brands.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [brands.length]);

  const getVisibleBrands = () => {
    if (brands.length <= 5) return brands;
    
    const visible = [];
    for (let i = 0; i < 5; i++) {
      const index = (currentIndex + i) % brands.length;
      visible.push(brands[index]);
    }
    return visible;
  };

  const renderLogo = (brand: Brand) => {
    if (brand.logo_url) {
      return <img src={brand.logo_url} alt={brand.name} className={styles.logoImg} />;
    }
    
    return (
      <svg viewBox="0 0 120 40" className={styles.logo}>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" fontSize="20" fontWeight="700" fontFamily="Arial, sans-serif">
          {brand.name}
        </text>
      </svg>
    );
  };
  
  return (
    <section className={styles.clientLogos}>
      <div className="container">
        <h2 className={styles.title}>{t('home.clientLogos.title')}</h2>
        <div className={styles.logosGrid}>
          {getVisibleBrands().map((brand, index) => (
            <div key={`${brand.id}-${index}`} className={styles.logoItem}>
              {renderLogo(brand)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
