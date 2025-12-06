'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiPhone, FiMail, FiUser, FiUserPlus } from 'react-icons/fi';
import styles from './Header.module.css';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/services', label: 'خدماتنا' },
  { href: '/about', label: 'من نحن' },
  { href: '/blog', label: 'المدونة' },
  { href: '/careers', label: 'الوظائف' },
  { href: '/contact', label: 'اتصل بنا' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarContent}>
            <div className={styles.topBarContact}>
              <a href="tel:+966500000000">
                <FiPhone /> +966 50 000 0000
              </a>
              <a href="mailto:info@tdlogistics.sa">
                <FiMail /> info@tdlogistics.sa
              </a>
            </div>
            <div className={styles.topBarActions}>
              <Link href="/login" className={styles.topBarLink}>
                <FiUser /> تسجيل الدخول
              </Link>
              <Link href="/register" className={styles.topBarLink}>
                <FiUserPlus /> انضم إلينا
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className="container">
          <div className={styles.headerContent}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}>TD</div>
              <div className={styles.logoText}>
                <span className={styles.logoMain}>تي دي</span>
                <span className={styles.logoSub}>للخدمات اللوجستية</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.nav}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className={styles.headerActions}>
              <Link href="/quote" className="btn btn-primary">
                اطلب عرض سعر
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className={styles.mobileToggle}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className={styles.mobileActions}>
              <Link href="/login" className="btn btn-outline" onClick={() => setIsMobileMenuOpen(false)}>
                تسجيل الدخول
              </Link>
              <Link href="/quote" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
                اطلب عرض سعر
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
