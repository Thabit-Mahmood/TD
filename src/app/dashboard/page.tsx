import Link from 'next/link';
import { FiPackage, FiTruck, FiClock, FiCheckCircle, FiFileText, FiUser, FiSettings } from 'react-icons/fi';
import styles from './page.module.css';

const stats = [
  { icon: FiPackage, label: 'إجمالي الشحنات', value: '156', color: 'primary' },
  { icon: FiTruck, label: 'قيد التوصيل', value: '12', color: 'warning' },
  { icon: FiClock, label: 'في الانتظار', value: '8', color: 'info' },
  { icon: FiCheckCircle, label: 'تم التوصيل', value: '136', color: 'success' },
];

const recentShipments = [
  { id: 'TDL100378632203', status: 'تم التوصيل', date: '2024-01-15', destination: 'الرياض' },
  { id: 'TDL100378630889', status: 'خارجة للتوصيل', date: '2024-01-15', destination: 'جدة' },
  { id: 'TDL100378616773', status: 'جاهزة للاستلام', date: '2024-01-14', destination: 'الدمام' },
];

const quickLinks = [
  { icon: FiPackage, label: 'تتبع شحنة', href: '/tracking' },
  { icon: FiFileText, label: 'طلب عرض سعر', href: '/quote' },
  { icon: FiUser, label: 'الملف الشخصي', href: '/dashboard/profile' },
  { icon: FiSettings, label: 'الإعدادات', href: '/dashboard/settings' },
];

export default function DashboardPage() {
  return (
    <div className={styles.dashboard}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1>مرحباً بك!</h1>
            <p>إليك ملخص نشاط حسابك</p>
          </div>
          <Link href="/quote" className="btn btn-primary">
            طلب شحنة جديدة
          </Link>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles[stat.color]}`}>
                <stat.icon />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.mainGrid}>
          {/* Recent Shipments */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>آخر الشحنات</h2>
              <Link href="/dashboard/shipments" className={styles.viewAll}>
                عرض الكل
              </Link>
            </div>
            <div className={styles.shipmentsList}>
              {recentShipments.map((shipment) => (
                <div key={shipment.id} className={styles.shipmentItem}>
                  <div className={styles.shipmentInfo}>
                    <span className={styles.shipmentId}>{shipment.id}</span>
                    <span className={styles.shipmentDest}>{shipment.destination}</span>
                  </div>
                  <div className={styles.shipmentMeta}>
                    <span className={styles.shipmentStatus}>{shipment.status}</span>
                    <span className={styles.shipmentDate}>{shipment.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>روابط سريعة</h2>
            </div>
            <div className={styles.quickLinks}>
              {quickLinks.map((link, index) => (
                <Link key={index} href={link.href} className={styles.quickLink}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
