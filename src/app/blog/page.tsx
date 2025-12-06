import Link from 'next/link';
import { FiCalendar, FiUser, FiArrowLeft } from 'react-icons/fi';
import styles from './page.module.css';

// Sample blog posts (in production, these would come from the database)
const blogPosts = [
  {
    id: 1,
    slug: 'logistics-trends-2024',
    title: 'أهم اتجاهات الخدمات اللوجستية في 2024',
    excerpt: 'تعرف على أحدث الاتجاهات التي تشكل مستقبل صناعة الخدمات اللوجستية في المملكة العربية السعودية والعالم.',
    author: 'فريق تي دي',
    date: '2024-01-15',
    category: 'اتجاهات السوق',
  },
  {
    id: 2,
    slug: 'ecommerce-shipping-tips',
    title: 'نصائح لتحسين شحن متجرك الإلكتروني',
    excerpt: 'اكتشف أفضل الممارسات لتحسين عمليات الشحن في متجرك الإلكتروني وزيادة رضا العملاء.',
    author: 'فريق تي دي',
    date: '2024-01-10',
    category: 'التجارة الإلكترونية',
  },
  {
    id: 3,
    slug: 'warehouse-management',
    title: 'كيف تدير مستودعك بكفاءة عالية',
    excerpt: 'دليل شامل لإدارة المستودعات بكفاءة وتقليل التكاليف وتحسين سرعة التوصيل.',
    author: 'فريق تي دي',
    date: '2024-01-05',
    category: 'إدارة المستودعات',
  },
  {
    id: 4,
    slug: 'last-mile-delivery',
    title: 'تحديات التوصيل للميل الأخير وحلولها',
    excerpt: 'استكشف التحديات الرئيسية في التوصيل للميل الأخير وكيف يمكن التغلب عليها.',
    author: 'فريق تي دي',
    date: '2024-01-01',
    category: 'التوصيل',
  },
  {
    id: 5,
    slug: 'cod-best-practices',
    title: 'أفضل ممارسات الدفع عند الاستلام',
    excerpt: 'تعلم كيفية إدارة خدمة الدفع عند الاستلام بفعالية وتقليل المخاطر المالية.',
    author: 'فريق تي دي',
    date: '2023-12-28',
    category: 'المدفوعات',
  },
  {
    id: 6,
    slug: 'sustainable-logistics',
    title: 'الاستدامة في الخدمات اللوجستية',
    excerpt: 'كيف يمكن للشركات اللوجستية تبني ممارسات مستدامة وصديقة للبيئة.',
    author: 'فريق تي دي',
    date: '2023-12-20',
    category: 'الاستدامة',
  },
];

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

export default function BlogPage() {
  return (
    <div className={styles.blogPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>المدونة</h1>
          <p>آخر الأخبار والمقالات حول الخدمات اللوجستية والشحن</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className={styles.blogSection}>
        <div className="container">
          <div className={styles.blogGrid}>
            {blogPosts.map((post) => (
              <article key={post.id} className={styles.blogCard}>
                <div className={styles.blogImage}>
                  <span className={styles.category}>{post.category}</span>
                </div>
                <div className={styles.blogContent}>
                  <h2 className={styles.blogTitle}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className={styles.blogExcerpt}>{post.excerpt}</p>
                  <div className={styles.blogMeta}>
                    <span className={styles.metaItem}>
                      <FiUser />
                      {post.author}
                    </span>
                    <span className={styles.metaItem}>
                      <FiCalendar />
                      {formatDate(post.date)}
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                    اقرأ المزيد
                    <FiArrowLeft />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
