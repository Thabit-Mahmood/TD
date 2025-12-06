import Link from 'next/link';
import { FiTruck, FiPackage, FiRefreshCw, FiDollarSign, FiBox, FiShield, FiCheck, FiArrowLeft } from 'react-icons/fi';
import styles from './page.module.css';

const services = [
  {
    id: 'delivery',
    icon: FiTruck,
    title: 'التوصيل السريع',
    description: 'خدمة توصيل سريعة وموثوقة لجميع أنحاء المملكة العربية السعودية.',
    features: [
      'توصيل خلال 24-48 ساعة',
      'تتبع مباشر للشحنات',
      'إشعارات فورية للعميل',
      'تغطية جميع مناطق المملكة',
      'خيارات توصيل مرنة',
    ],
  },
  {
    id: 'storage',
    icon: FiBox,
    title: 'التخزين والمستودعات',
    description: 'مستودعات حديثة ومجهزة بأحدث التقنيات لتخزين منتجاتك بأمان.',
    features: [
      'مستودعات مكيفة ومؤمنة',
      'نظام إدارة مخزون متقدم',
      'مراقبة على مدار الساعة',
      'تقارير مخزون دورية',
      'مواقع استراتيجية',
    ],
  },
  {
    id: 'fulfillment',
    icon: FiPackage,
    title: 'خدمات الفلفلمنت',
    description: 'إدارة كاملة للمخزون والتعبئة والشحن لتجارتك الإلكترونية.',
    features: [
      'استلام وتخزين المنتجات',
      'تعبئة وتغليف احترافي',
      'معالجة الطلبات بسرعة',
      'تكامل مع منصات التجارة',
      'إدارة المرتجعات',
    ],
  },
  {
    id: 'cod',
    icon: FiDollarSign,
    title: 'الدفع عند الاستلام',
    description: 'خدمة تحصيل المبالغ نقداً عند التسليم مع تحويل سريع للأرباح.',
    features: [
      'تحصيل نقدي آمن',
      'تحويل سريع للأرباح',
      'تقارير مالية مفصلة',
      'نظام محاسبي متكامل',
      'دعم متعدد العملات',
    ],
  },
  {
    id: 'returns',
    icon: FiRefreshCw,
    title: 'إدارة المرتجعات',
    description: 'نظام متكامل لإدارة المرتجعات بكفاءة عالية وتكلفة منخفضة.',
    features: [
      'استلام المرتجعات من العميل',
      'فحص وتصنيف المنتجات',
      'إعادة التخزين أو الإرجاع',
      'تقارير مرتجعات مفصلة',
      'تكلفة تنافسية',
    ],
  },
  {
    id: 'insurance',
    icon: FiShield,
    title: 'التأمين على الشحنات',
    description: 'حماية شاملة لشحناتك ضد التلف أو الفقدان مع تعويض سريع.',
    features: [
      'تغطية شاملة للشحنات',
      'تعويض سريع وعادل',
      'إجراءات مطالبات سهلة',
      'أسعار تنافسية',
      'حماية للشحنات الثمينة',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className={styles.servicesPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>خدماتنا</h1>
          <p>حلول لوجستية متكاملة مصممة لتلبية جميع احتياجات عملك</p>
        </div>
      </section>

      {/* Services List */}
      <section className={styles.servicesList}>
        <div className="container">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              id={service.id}
              className={`${styles.serviceItem} ${index % 2 === 1 ? styles.reversed : ''}`}
            >
              <div className={styles.serviceContent}>
                <div className={styles.serviceIcon}>
                  <service.icon />
                </div>
                <h2>{service.title}</h2>
                <p className={styles.serviceDesc}>{service.description}</p>
                <ul className={styles.featuresList}>
                  {service.features.map((feature, i) => (
                    <li key={i}>
                      <FiCheck className={styles.checkIcon} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/quote" className={styles.serviceLink}>
                  اطلب هذه الخدمة
                  <FiArrowLeft />
                </Link>
              </div>
              <div className={styles.serviceImage}>
                <div className={styles.imagePlaceholder}>
                  <service.icon className={styles.placeholderIcon} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>هل تحتاج خدمة مخصصة؟</h2>
            <p>تواصل معنا وسنصمم حلاً يناسب احتياجاتك الخاصة</p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
