import Link from 'next/link';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { FaTwitter, FaLinkedinIn, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import styles from './Footer.module.css';

const quickLinks = [
  { href: '/services', label: 'خدماتنا' },
  { href: '/about', label: 'من نحن' },
  { href: '/tracking', label: 'تتبع الشحنة' },
  { href: '/quote', label: 'طلب عرض سعر' },
  { href: '/careers', label: 'الوظائف' },
  { href: '/contact', label: 'اتصل بنا' },
];

const services = [
  { href: '/services#delivery', label: 'التوصيل السريع' },
  { href: '/services#storage', label: 'التخزين والمستودعات' },
  { href: '/services#fulfillment', label: 'خدمات الفلفلمنت' },
  { href: '/services#cod', label: 'الدفع عند الاستلام' },
  { href: '/services#returns', label: 'إدارة المرتجعات' },
];

const socialLinks = [
  { href: 'https://twitter.com/tdlogistics', icon: FaTwitter, label: 'تويتر' },
  { href: 'https://linkedin.com/company/tdlogistics', icon: FaLinkedinIn, label: 'لينكدإن' },
  { href: 'https://instagram.com/tdlogistics', icon: FaInstagram, label: 'انستغرام' },
  { href: 'https://wa.me/966500000000', icon: FaWhatsapp, label: 'واتساب' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Main Footer */}
        <div className={styles.footerMain}>
          {/* Company Info */}
          <div className={styles.footerSection}>
            <div className={styles.footerLogo}>
              <div className={styles.logoIcon}>TD</div>
              <div className={styles.logoText}>
                <span className={styles.logoMain}>تي دي</span>
                <span className={styles.logoSub}>للخدمات اللوجستية</span>
              </div>
            </div>
            <p className={styles.footerDesc}>
              شريكك الموثوق في الشحن والتوصيل. نقدم خدمات لوجستية متكاملة بأعلى معايير الجودة والأمان.
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
            <h4 className={styles.footerTitle}>روابط سريعة</h4>
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
            <h4 className={styles.footerTitle}>خدماتنا</h4>
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
            <h4 className={styles.footerTitle}>تواصل معنا</h4>
            <ul className={styles.contactList}>
              <li>
                <FiMapPin />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
              <li>
                <FiPhone />
                <a href="tel:+966500000000">+966 50 000 0000</a>
              </li>
              <li>
                <FiMail />
                <a href="mailto:info@tdlogistics.sa">info@tdlogistics.sa</a>
              </li>
              <li>
                <FiClock />
                <span>الأحد - الخميس: 8 ص - 6 م</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} تي دي للخدمات اللوجستية. جميع الحقوق محفوظة.</p>
          <div className={styles.footerBottomLinks}>
            <Link href="/privacy">سياسة الخصوصية</Link>
            <Link href="/terms">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
