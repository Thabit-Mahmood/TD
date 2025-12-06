import Link from 'next/link';
import { FiMapPin, FiBriefcase, FiClock, FiArrowLeft, FiUsers, FiTrendingUp, FiHeart, FiAward } from 'react-icons/fi';
import styles from './page.module.css';

const benefits = [
  { icon: FiTrendingUp, title: 'فرص النمو', description: 'مسار وظيفي واضح وفرص للتطور المهني' },
  { icon: FiHeart, title: 'بيئة عمل محفزة', description: 'فريق متعاون وبيئة عمل إيجابية' },
  { icon: FiAward, title: 'مكافآت تنافسية', description: 'رواتب ومزايا تنافسية في السوق' },
  { icon: FiUsers, title: 'تدريب مستمر', description: 'برامج تدريبية لتطوير مهاراتك' },
];

const jobs = [
  {
    id: 1,
    title: 'مندوب توصيل',
    department: 'العمليات',
    location: 'الرياض',
    type: 'دوام كامل',
    description: 'نبحث عن مندوبي توصيل متميزين للانضمام لفريقنا في الرياض.',
  },
  {
    id: 2,
    title: 'مسؤول خدمة عملاء',
    department: 'خدمة العملاء',
    location: 'الرياض',
    type: 'دوام كامل',
    description: 'انضم لفريق خدمة العملاء وساعد عملائنا في الحصول على أفضل تجربة.',
  },
  {
    id: 3,
    title: 'مدير مستودع',
    department: 'العمليات',
    location: 'جدة',
    type: 'دوام كامل',
    description: 'نبحث عن مدير مستودع ذو خبرة لإدارة عمليات المستودع في جدة.',
  },
  {
    id: 4,
    title: 'مطور برمجيات',
    department: 'التقنية',
    location: 'الرياض',
    type: 'دوام كامل',
    description: 'انضم لفريقنا التقني وساهم في تطوير أنظمتنا اللوجستية.',
  },
];

export default function CareersPage() {
  return (
    <div className={styles.careersPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>انضم لفريقنا</h1>
          <p>كن جزءاً من فريق تي دي وساهم في تشكيل مستقبل الخدمات اللوجستية في المملكة</p>
        </div>
      </section>

      {/* Benefits */}
      <section className={styles.benefits}>
        <div className="container">
          <h2 className={styles.sectionTitle}>لماذا تعمل معنا؟</h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  <benefit.icon />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className={styles.jobs}>
        <div className="container">
          <h2 className={styles.sectionTitle}>الوظائف المتاحة</h2>
          <div className={styles.jobsList}>
            {jobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobHeader}>
                  <h3 className={styles.jobTitle}>{job.title}</h3>
                  <span className={styles.jobDepartment}>{job.department}</span>
                </div>
                <p className={styles.jobDescription}>{job.description}</p>
                <div className={styles.jobMeta}>
                  <span className={styles.jobMetaItem}>
                    <FiMapPin />
                    {job.location}
                  </span>
                  <span className={styles.jobMetaItem}>
                    <FiBriefcase />
                    {job.type}
                  </span>
                </div>
                <Link href={`/careers/${job.id}`} className={styles.jobLink}>
                  عرض التفاصيل
                  <FiArrowLeft />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>لم تجد الوظيفة المناسبة؟</h2>
            <p>أرسل سيرتك الذاتية وسنتواصل معك عند توفر فرصة مناسبة</p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
