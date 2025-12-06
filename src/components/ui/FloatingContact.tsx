'use client';

import { useState } from 'react';
import { FaWhatsapp, FaPhone, FaEnvelope, FaComments } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './FloatingContact.module.css';

const contactOptions = [
  {
    icon: FaWhatsapp,
    label: 'واتساب',
    href: 'https://wa.me/966500000000',
    color: '#25D366',
  },
  {
    icon: FaPhone,
    label: 'اتصل بنا',
    href: 'tel:+966500000000',
    color: '#DC2626',
  },
  {
    icon: FaEnvelope,
    label: 'البريد الإلكتروني',
    href: 'mailto:support@tdlogistics.sa',
    color: '#1F2937',
  },
];

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* Contact Options */}
      <div className={`${styles.options} ${isOpen ? styles.open : ''}`}>
        {contactOptions.map((option, index) => (
          <a
            key={option.label}
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

      {/* Main Button */}
      <button
        className={`${styles.mainButton} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="تواصل معنا"
      >
        {isOpen ? <FiX /> : <FaComments />}
      </button>
    </div>
  );
}
