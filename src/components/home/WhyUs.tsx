import { FiCheck, FiAward, FiClock, FiHeadphones, FiMapPin, FiShield } from 'react-icons/fi';
import styles from './WhyUs.module.css';

const features = [
  {
    icon: FiClock,
    title: 'سرعة التوصيل',
    description: 'نضمن توصيل شحناتك في الوقت المحدد',
  },
  {
    icon: FiShield,
    title: 'أمان تام',
    description: 'حماية كاملة لشحناتك من الاستلام للتسليم',
  },
  {
    icon: FiMapPin,
    title: 'تغطية شاملة',
    description: 'نصل لجميع مناطق المملكة العربية السعودية',
  },
  {
    icon: FiHeadphones,
    title: 'دعم متواصل',
    description: 'فريق دعم متاح على مدار الساعة لخدمتك',
  },
  {
    icon: FiAward,
    title: 'جودة عالية',
    description: 'معايير جودة صارمة في جميع خدماتنا',
  },
  {
    icon: FiCheck,
    title: 'أسعار تنافسية',
    description: 'أفضل الأسعار مع خدمة متميزة',
  },
];

const clients = [
  'نون',
  'جرير',
  'إكسترا',
  'نمشي',
  'سوق.كوم',
  'زارا',
];

export default function WhyUs() {
  return (
    <section className={styles.whyUs}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2 className={styles.title}>لماذا تختار تي دي؟</h2>
            <p className={styles.subtitle}>
              نحن نفخر بتقديم خدمات لوجستية استثنائية تلبي توقعات عملائنا وتتجاوزها. 
              اكتشف ما يميزنا عن الآخرين.
            </p>

            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <feature.icon />
                  </div>
                  <div>
                    <h4 className={styles.featureTitle}>{feature.title}</h4>
                    <p className={styles.featureDesc}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.imageContent}>
            <div className={styles.imageWrapper}>
              <div className={styles.imagePlaceholder}>
                <FiMapPin className={styles.placeholderIcon} />
                <span>صورة أسطول الشركة</span>
              </div>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgeNumber}>+10</span>
              <span className={styles.badgeText}>سنوات خبرة</span>
            </div>
          </div>
        </div>

        {/* Clients Section */}
        <div className={styles.clients}>
          <h3 className={styles.clientsTitle}>يثق بنا أكثر من 1000 عميل</h3>
          <div className={styles.clientsGrid}>
            {clients.map((client, index) => (
              <div key={index} className={styles.clientItem}>
                {client}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
