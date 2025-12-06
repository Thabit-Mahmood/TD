'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiAlertCircle, FiMapPin } from 'react-icons/fi';
import styles from './page.module.css';

interface TrackingEvent {
  name: string;
  arabicName: string;
  deliveryDate: string;
  type: string;
  status: string | null;
  userName: string;
  arrived: boolean;
}

interface TrackingData {
  barcode: string;
  status: string;
  arStatus: string;
  enStatus: string;
  fullReceiverName: string | null;
  destinationAddress?: {
    city: string;
    arabicCityName: string;
    region: string;
    arabicRegionName: string;
  };
  deliveryRoute: TrackingEvent[];
  createdDate: string;
  deliveryDate?: string;
  expectedDeliveryDate?: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  'DELIVERED_TO_RECIPIENT': { 
    icon: <FiCheckCircle />, 
    color: 'success',
    label: 'تم التوصيل'
  },
  'SCANNED_BY_DRIVER_AND_IN_CAR': { 
    icon: <FiTruck />, 
    color: 'warning',
    label: 'خارجة للتوصيل'
  },
  'READY_FOR_PICKUP': { 
    icon: <FiPackage />, 
    color: 'info',
    label: 'جاهزة للاستلام'
  },
};

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const barcode = searchParams.get('barcode');
    if (barcode) {
      setTrackingNumber(barcode);
      handleTrack(barcode);
    }
  }, [searchParams]);

  const handleTrack = async (barcode?: string) => {
    const number = barcode || trackingNumber;
    
    if (!number.trim()) {
      setError('يرجى إدخال رقم التتبع');
      return;
    }

    const sanitized = number.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (sanitized.length < 5 || sanitized.length > 30) {
      setError('رقم التتبع غير صالح');
      return;
    }

    setIsLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await fetch(`/api/tracking?barcode=${encodeURIComponent(sanitized)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء البحث');
      }

      setTrackingData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء البحث');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status] || { 
      icon: <FiClock />, 
      color: 'default',
      label: 'قيد المعالجة'
    };
  };

  return (
    <div className={styles.trackingPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>تتبع شحنتك</h1>
          <p>أدخل رقم التتبع للحصول على آخر تحديثات شحنتك</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          {/* Search Form */}
          <div className={styles.searchCard}>
            <form onSubmit={handleSubmit} className={styles.searchForm}>
              <div className={styles.inputWrapper}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value);
                    setError('');
                  }}
                  placeholder="أدخل رقم التتبع (مثال: TDL100378632203)"
                  className={styles.searchInput}
                  maxLength={30}
                  dir="ltr"
                />
              </div>
              <button 
                type="submit" 
                className={styles.searchButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  'تتبع'
                )}
              </button>
            </form>
            
            {error && (
              <div className={styles.error}>
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Results */}
          {trackingData && (
            <div className={styles.results}>
              {/* Status Card */}
              <div className={styles.statusCard}>
                <div className={`${styles.statusIcon} ${styles[getStatusConfig(trackingData.status).color]}`}>
                  {getStatusConfig(trackingData.status).icon}
                </div>
                <div className={styles.statusInfo}>
                  <span className={`${styles.statusBadge} ${styles[getStatusConfig(trackingData.status).color]}`}>
                    {trackingData.arStatus || trackingData.enStatus}
                  </span>
                  <p className={styles.trackingId}>رقم التتبع: {trackingData.barcode}</p>
                </div>
              </div>

              {/* Destination */}
              {trackingData.destinationAddress && (
                <div className={styles.destinationCard}>
                  <FiMapPin className={styles.destinationIcon} />
                  <div>
                    <h3>الوجهة</h3>
                    <p>
                      {trackingData.destinationAddress.arabicCityName || trackingData.destinationAddress.city}
                      {trackingData.destinationAddress.arabicRegionName && 
                        `, ${trackingData.destinationAddress.arabicRegionName}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className={styles.timelineCard}>
                <h3>سجل التتبع</h3>
                <div className={styles.timeline}>
                  {trackingData.deliveryRoute?.map((event, index) => (
                    <div key={index} className={styles.timelineItem}>
                      <div className={`${styles.timelineDot} ${index === 0 ? styles.active : ''}`}></div>
                      <div className={styles.timelineContent}>
                        <p className={styles.timelineEvent}>
                          {event.arabicName || event.name}
                        </p>
                        <div className={styles.timelineMeta}>
                          <span>{formatDate(event.deliveryDate)}</span>
                          {event.userName && <span>• {event.userName}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
