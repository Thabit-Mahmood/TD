'use client';

import Link from 'next/link';
import { FiHome, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './Breadcrumbs.module.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { t, isRTL } = useLanguage();
  const Separator = isRTL ? FiChevronLeft : FiChevronRight;

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>
            <FiHome />
            <span>{t('nav.home')}</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            <Separator className={styles.separator} />
            {item.href && index < items.length - 1 ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
