import Link from 'next/link';
import { FiArrowLeft, FiPhone } from 'react-icons/fi';
import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.ctaContent}>
          <div className={styles.ctaText}>
            <h2 className={styles.ctaTitle}>
              هل أنت مستعد لتطوير أعمالك؟
            </h2>
            <p className={styles.ctaSubtitle}>
              انضم إلى آلاف العملاء الذين يثقون بنا في توصيل شحناتهم. 
              احصل على عرض سعر مخصص لاحتياجاتك اليوم.
            </p>
          </div>
          
          <div className={styles.ctaActions}>
            <Link href="/quote" className={styles.ctaPrimary}>
              اطلب عرض سعر
              <FiArrowLeft />
            </Link>
            <a href="tel:+966500000000" className={styles.ctaSecondary}>
              <FiPhone />
              اتصل بنا الآن
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
