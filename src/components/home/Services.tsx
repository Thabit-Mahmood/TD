import { FiTruck, FiPackage, FiRefreshCw, FiDollarSign, FiBox, FiShield } from 'react-icons/fi';
import styles from './Services.module.css';

const services = [
  {
    icon: FiTruck,
    title: 'التوصيل السريع',
    description: 'توصيل سريع وآمن لجميع أنحاء المملكة خلال 24-48 ساعة مع تتبع مباشر للشحنات.',
  },
  {
    icon: FiBox,
    title: 'التخزين والمستودعات',
    description: 'مستودعات حديثة ومجهزة بأحدث التقنيات لتخزين منتجاتك بأمان تام.',
  },
  {
    icon: FiPackage,
    title: 'خدمات الفلفلمنت',
    description: 'إدارة كاملة للمخزون والتعبئة والشحن لتجارتك الإلكترونية.',
  },
  {
    icon: FiDollarSign,
    title: 'الدفع عند الاستلام',
    description: 'خدمة تحصيل المبالغ نقداً عند التسليم مع تحويل سريع للأرباح.',
  },
  {
    icon: FiRefreshCw,
    title: 'إدارة المرتجعات',
    description: 'نظام متكامل لإدارة المرتجعات بكفاءة عالية وتكلفة منخفضة.',
  },
  {
    icon: FiShield,
    title: 'التأمين على الشحنات',
    description: 'حماية شاملة لشحناتك ضد التلف أو الفقدان مع تعويض سريع.',
  },
];

export default function Services() {
  return (
    <section className={styles.services} id="services">
      <div className="container">
        <div className="section-title">
          <h2>خدماتنا المتميزة</h2>
          <p>نقدم مجموعة شاملة من الخدمات اللوجستية المصممة لتلبية احتياجات عملك</p>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div key={index} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <service.icon />
              </div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDesc}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
