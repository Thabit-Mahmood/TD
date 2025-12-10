'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { useLanguage } from '@/lib/i18n';
import styles from './Footer.module.css';

const socialLinks = [
  { href: 'https://www.instagram.com/tdlogistics_sa', icon: FaInstagram, label: 'Instagram' },
  { href: 'https://x.com/tdlogistics_sa', icon: FaTwitter, label: 'X' },
  { href: 'https://www.linkedin.com/company/tdlogistics/', icon: FaLinkedinIn, label: 'LinkedIn' },
];

export default function Footer() {
  const { t, language } = useLanguage();

  const quickLinks = [
    { href: '/services', label: t('nav.services') },
    { href: '/about', label: t('nav.about') },
    { href: '/tracking', label: t('nav.tracking') },
    { href: '/quote', label: t('nav.getQuote') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const services = language === 'ar' ? [
    { href: '/services#delivery', label: 'التوصيل السريع' },
    { href: '/services#storage', label: 'التخزين والمستودعات' },
    { href: '/services#fulfillment', label: 'خدمات الفلفلمنت' },
    { href: '/services#cod', label: 'الدفع عند الاستلام' },
    { href: '/services#returns', label: 'إدارة المرتجعات' },
  ] : [
    { href: '/services#delivery', label: 'Express Delivery' },
    { href: '/services#storage', label: 'Storage & Warehousing' },
    { href: '/services#fulfillment', label: 'Fulfillment Services' },
    { href: '/services#cod', label: 'Cash on Delivery' },
    { href: '/services#returns', label: 'Returns Management' },
  ];

  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Main Footer */}
        <div className={styles.footerMain}>
          {/* Company Info */}
          <div className={styles.footerSection}>
            <div className={styles.footerLogo}>
              <Image 
                src="/logo-white.png" 
                alt="TD Logistics" 
                width={140} 
                height={70} 
                className={styles.logoImage}
              />
            </div>
            <p className={styles.footerDesc}>
              {t('footer.description')}
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={social.label}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>{t('footer.quickLinks')}</h4>
            <ul className={styles.footerLinks}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>{t('footer.services')}</h4>
            <ul className={styles.footerLinks}>
              {services.map((service) => (
                <li key={service.href}>
                  <Link href={service.href}>{service.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>{t('footer.contactUs')}</h4>
            <ul className={styles.contactList}>
              <li>
                <FiMapPin />
                <span>{t('footer.address')}</span>
              </li>
              <li>
                <FiPhone />
                <a href="tel:920015499">{t('header.phone')}</a>
              </li>
              <li>
                <FiMail />
                <a href="mailto:info@tdlogistics.co">{t('header.email')}</a>
              </li>
              <li>
                <FiClock />
                <span>{t('footer.workingHours')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} {t('header.logoMain')} {t('header.logoSub')}. {t('footer.copyright')}.</p>
          <div className={styles.footerBottomLinks}>
            <Link href="/privacy">{t('footer.privacyPolicy')}</Link>
            <Link href="/terms">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
