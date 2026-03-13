'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaComments, FaWhatsapp } from 'react-icons/fa';
import { FiX, FiPackage } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n';
import styles from './FloatingContact.module.css';

export default function FloatingContact() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      icon: FaPhone,
      label: t('floatingContact.call'),
      href: 'tel:920015499',
      color: '#DC2626',
    },
    {
      icon: FaWhatsapp,
      label: 'WhatsApp',
      href: 'https://wa.me/966920015499',
      color: '#25D366',
    },
    {
      icon: FaEnvelope,
      label: t('floatingContact.email'),
      href: 'mailto:info@tdlogistics.co',
      color: '#1F2937',
    },
  ];

  return (
    <div className={styles.container}>
      {/* Contact Options */}
      <div className={`${styles.options} ${isOpen ? styles.open : ''}`}>
        {contactOptions.map((option, index) => (
          <a
            key={index}
            href={option.href}
            target={option.href.startsWith('http') ? '_blank' : undefined}
            rel={option.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={styles.option}
            style={{ 
              '--delay': `${index * 0.05}s`,
              '--color': option.color 
            } as React.CSSProperties}
            aria-label={option.label}
          >
            <option.icon />
            <span className={styles.optionLabel}>{option.label}</span>
          </a>
        ))}
      </div>

      {/* Main Contact Button */}
      <button
        className={`${styles.mainButton} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('floatingContact.contactUs')}
      >
        {isOpen ? <FiX /> : <FaComments />}
      </button>

      {/* Tracking Button - stacked below contact */}
      <Link href="/tracking" className={styles.trackingButton} aria-label={t('floatingContact.tracking')}>
        <FiPackage />
      </Link>
    </div>
  );
}
