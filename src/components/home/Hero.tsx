'use client';

import { useState } from 'react';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import styles from './Hero.module.css';

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
  receiverPhone: string;
  fullReceiverName: string;
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

const statusIcons: Record<string, React.ReactNode> = {
  'DELIVERED_TO_RECIPIENT': <FiCheckCircle className={styles.statusIconDelivered} />,
  'SCANNED_BY_DRIVER_AND_IN_CAR': <FiTruck className={styles.statusIconOutForDelivery} />,
  'READY_FOR_PICKUP': <FiPackage className={styles.statusIconReady} />,
  'default': <FiClock className={styles.statusIconPending} />,
};

const statusColors: Record<string, string> = {
  'DELIVERED_TO_RECIPIENT': 'delivered',
  'SCANNED_BY_DRIVER_AND_IN_CAR': 'outForDelivery',
  'READY_FOR_PICKUP': 'ready',
};

export default function Hero() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      setError('يرجى إدخال رقم التتبع');
      return;
    }

    // Sanitize input - only allow alphanumeric
    const sanitized = trackingNumber.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    
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
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء البحث');
    } finally {
      setIsLoading(false);
    }
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

  const getStatusClass = (status: string | null) => {
    if (!status) return '';
    return statusColors[status] || '';
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.heroPattern}></div>
      </div>
      
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              شريكك الموثوق في
              <span className={styles.highlight}> الشحن والتوصيل</span>
            </h1>
            <p className={styles.heroSubtitle}>
              نقدم خدمات لوجستية متكاملة بأعلى معايير الجودة والأمان. 
              تتبع شحنتك بسهولة واحصل على تحديثات فورية.
            </p>
          </div>

          {/* Tracking Box */}
          <div className={styles.trackingBox}>
            <div className={styles.trackingHeader}>
              <FiPackage className={styles.trackingIcon} />
              <h2>تتبع شحنتك</h2>
            </div>
            
            <form onSubmit={handleTrack} className={styles.trackingForm}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value);
                    setError('');
                  }}
                  placeholder="أدخل رقم التتبع (مثال: TDL100378632203)"
                  className={styles.trackingInput}
                  maxLength={30}
                  aria-label="رقم التتبع"
                />
                <button 
                  type="submit" 
                  className={styles.trackingButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className={styles.spinner}></span>
                  ) : (
                    <>
                      <FiSearch />
                      <span>تتبع</span>
                    </>
                  )}
                </button>
              </div>
              
              {error && (
                <div className={styles.errorMessage}>
                  <FiAlertCircle />
                  <span>{error}</span>
                </div>
              )}
            </form>

            {/* Tracking Results */}
            {showResults && trackingData && (
              <div className={styles.trackingResults}>
                <div className={styles.resultHeader}>
                  <div className={styles.resultStatus}>
                    {statusIcons[trackingData.status] || statusIcons['default']}
                    <div>
                      <span className={`${styles.statusBadge} ${styles[getStatusClass(trackingData.status)]}`}>
                        {trackingData.arStatus || trackingData.enStatus}
                      </span>
                      <p className={styles.trackingId}>رقم التتبع: {trackingData.barcode}</p>
                    </div>
                  </div>
                  <button 
                    className={styles.closeResults}
                    onClick={() => setShowResults(false)}
                    aria-label="إغلاق"
                  >
                    ×
                  </button>
                </div>

                {trackingData.destinationAddress && (
                  <div className={styles.destinationInfo}>
                    <p>
                      <strong>الوجهة:</strong> {trackingData.destinationAddress.arabicCityName || trackingData.destinationAddress.city}
                      {trackingData.destinationAddress.arabicRegionName && `, ${trackingData.destinationAddress.arabicRegionName}`}
                    </p>
                  </div>
                )}

                {/* Timeline */}
                <div className={styles.timeline}>
                  <h4>سجل التتبع</h4>
                  <div className={styles.timelineList}>
                    {trackingData.deliveryRoute?.slice(0, 5).map((event, index) => (
                      <div key={index} className={styles.timelineItem}>
                        <div className={styles.timelineDot}></div>
                        <div className={styles.timelineContent}>
                          <p className={styles.timelineEvent}>
                            {event.arabicName || event.name}
                          </p>
                          <span className={styles.timelineDate}>
                            {formatDate(event.deliveryDate)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {trackingData.deliveryRoute?.length > 5 && (
                    <p className={styles.moreEvents}>
                      +{trackingData.deliveryRoute.length - 5} أحداث أخرى
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+500K</span>
            <span className={styles.statLabel}>شحنة تم توصيلها</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+1000</span>
            <span className={styles.statLabel}>عميل راضٍ</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+50</span>
            <span className={styles.statLabel}>مدينة نغطيها</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>99%</span>
            <span className={styles.statLabel}>نسبة التوصيل في الوقت</span>
          </div>
        </div>
      </div>
    </section>
  );
}
