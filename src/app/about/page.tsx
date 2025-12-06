import { FiTarget, FiEye, FiHeart, FiAward, FiUsers, FiTruck, FiPackage, FiGlobe } from 'react-icons/fi';
import styles from './page.module.css';

const values = [
  { icon: FiHeart, title: 'الالتزام', description: 'نلتزم بتقديم أفضل خدمة لعملائنا في كل شحنة' },
  { icon: FiAward, title: 'الجودة', description: 'نسعى للتميز في كل ما نقدمه من خدمات' },
  { icon: FiUsers, title: 'العمل الجماعي', description: 'نؤمن بقوة الفريق الواحد لتحقيق النجاح' },
  { icon: FiTarget, title: 'الابتكار', description: 'نبحث دائماً عن حلول مبتكرة لتحسين خدماتنا' },
];

const stats = [
  { icon: FiPackage, number: '+500K', label: 'شحنة تم توصيلها' },
  { icon: FiUsers, number: '+1000', label: 'عميل راضٍ' },
  { icon: FiGlobe, number: '+50', label: 'مدينة نغطيها' },
  { icon: FiTruck, number: '+200', label: 'مركبة في أسطولنا' },
];

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>من نحن</h1>
          <p>شريكك الموثوق في الشحن والتوصيل منذ أكثر من 10 سنوات</p>
        </div>
      </section>

      {/* Story */}
      <section className={styles.story}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyContent}>
              <h2>قصتنا</h2>
              <p>
                بدأت تي دي للخدمات اللوجستية رحلتها في عام 2014 برؤية واضحة: 
                تقديم خدمات شحن وتوصيل استثنائية تلبي احتياجات السوق السعودي المتنامي.
              </p>
              <p>
                على مدار السنوات، نمت الشركة من فريق صغير إلى واحدة من أكبر شركات 
                الخدمات اللوجستية في المملكة، مع تغطية تشمل أكثر من 50 مدينة ومنطقة.
              </p>
              <p>
                اليوم، نفخر بخدمة آلاف العملاء من الأفراد والشركات، ونواصل التزامنا 
                بتقديم خدمات عالية الجودة بأسعار تنافسية.
              </p>
            </div>
            <div className={styles.storyImage}>
              <div className={styles.imagePlaceholder}>
                <FiTruck className={styles.placeholderIcon} />
                <span>صورة فريق العمل</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.missionVision}>
        <div className="container">
          <div className={styles.mvGrid}>
            <div className={styles.mvCard}>
              <div className={styles.mvIcon}>
                <FiTarget />
              </div>
              <h3>رسالتنا</h3>
              <p>
                تقديم خدمات لوجستية متكاملة وموثوقة تساعد عملائنا على النمو 
                وتحقيق أهدافهم التجارية من خلال حلول شحن مبتكرة وفعالة.
              </p>
            </div>
            <div className={styles.mvCard}>
              <div className={styles.mvIcon}>
                <FiEye />
              </div>
              <h3>رؤيتنا</h3>
              <p>
                أن نكون الخيار الأول للخدمات اللوجستية في المملكة العربية السعودية 
                والمنطقة، من خلال التميز في الخدمة والابتكار المستمر.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.values}>
        <div className="container">
          <h2 className={styles.sectionTitle}>قيمنا</h2>
          <div className={styles.valuesGrid}>
            {values.map((value, index) => (
              <div key={index} className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <value.icon />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <stat.icon className={styles.statIcon} />
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
