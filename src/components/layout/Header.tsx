'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { FiMenu, FiX, FiPhone, FiMail } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n';
import LanguageToggle from '@/components/ui/LanguageToggle';
import styles from './Header.module.css';

export default function Header() {
  const { t, isRTL } = useLanguage();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/services', label: t('nav.services') },
    { href: '/partners', label: t('nav.partners') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/careers', label: t('nav.careers') },
    { href: '/contact', label: t('nav.support') },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setIsScrolled(currentScrollY > 20);
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarContent}>
            <div className={styles.topBarContact}>
              <a href="tel:920015499" dir="ltr" className={styles.phoneLink}>
                <FiPhone /> <span>{t('header.phoneDisplay')}</span>
              </a>
              <a href="mailto:info@tdlogistics.co">
                <FiMail /> {t('header.email')}
              </a>
            </div>
            <div className={styles.topBarActions}>
              <Link href="/tracking" className={styles.topBarLink}>
                {t('nav.tracking')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''} ${!isVisible ? styles.hidden : ''}`}>
        <div className="container">
          <div className={styles.headerContent}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <Image 
                src="/logo.png" 
                alt="TD Logistics" 
                width={120} 
                height={60} 
                className={styles.logoImage}
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.nav}>
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`${styles.navLink} ${isActiveLink(link.href) ? styles.active : ''}`} 
                  prefetch={true}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button & Language Toggle */}
            <div className={styles.headerActions}>
              <div className={styles.desktopLangToggle}>
                <LanguageToggle />
              </div>
              <Link href="/quote" className="btn btn-primary">
                {t('nav.getQuote')}
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className={styles.mobileToggle}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isRTL ? 'القائمة' : 'Menu'}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuHeader}>
            <Link href="/" className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
              <Image 
                src="/logo.png" 
                alt="TD Logistics" 
                width={100} 
                height={50} 
                className={styles.logoImage}
              />
            </Link>
            <button
              className={styles.mobileCloseBtn}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label={isRTL ? 'إغلاق' : 'Close'}
            >
              <FiX size={24} />
            </button>
          </div>
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.mobileNavLink} ${isActiveLink(link.href) ? styles.active : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className={styles.mobileActions}>
              <div className={styles.mobileLangToggle}>
                <LanguageToggle />
              </div>
              <Link href="/tracking" className="btn btn-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                {t('nav.tracking')}
              </Link>
              <Link href="/quote" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
                {t('nav.getQuote')}
              </Link>
            </div>
          </nav>
        </div>
      </header>
      
      {/* Spacer for fixed header */}
      <div className={styles.headerSpacer} />
    </>
  );
}
