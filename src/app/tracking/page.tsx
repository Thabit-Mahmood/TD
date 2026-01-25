'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiAlertCircle, 
  FiMapPin, FiBox, FiHome, FiChevronDown, FiChevronUp, FiCalendar,
  FiUser, FiPhone, FiInfo
} from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './page.module.css';

// Local storage key for tracking history
const TRACKING_HISTORY_KEY = 'tdl_tracking_history';
const MAX_HISTORY_ITEMS = 10;

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

// Milestone stages for progress bar (flexible system)
enum MilestoneStage {
  RECEIVED = 1,
  PROCESSING = 2,
  OUT_FOR_DELIVERY = 3,
  DELIVERED = 4,
  RETURNED = 5,
  FAILED = 6,
  CANCELLED = 7,
}

// Dynamic milestones based on status - with translation support
const getMilestones = (status: string, t: (key: string) => string) => {
  // Check for special statuses first
  if (status.includes('RETURN') || status.includes('REJECTED')) {
    return [
      { stage: MilestoneStage.RECEIVED, label: t('tracking.milestones.received'), icon: <FiBox /> },
      { stage: MilestoneStage.PROCESSING, label: t('tracking.milestones.processing'), icon: <FiPackage /> },
      { stage: MilestoneStage.OUT_FOR_DELIVERY, label: t('tracking.milestones.outForDelivery'), icon: <FiTruck /> },
      { stage: MilestoneStage.RETURNED, label: t('tracking.milestones.returned'), icon: <FiAlertCircle /> },
    ];
  }
  
  if (status.includes('FAIL') || status.includes('CANCEL')) {
    return [
      { stage: MilestoneStage.RECEIVED, label: t('tracking.milestones.received'), icon: <FiBox /> },
      { stage: MilestoneStage.PROCESSING, label: t('tracking.milestones.processing'), icon: <FiPackage /> },
      { stage: MilestoneStage.FAILED, label: t('tracking.milestones.failed') || 'Failed', icon: <FiAlertCircle /> },
    ];
  }

  // Default normal flow
  return [
    { stage: MilestoneStage.RECEIVED, label: t('tracking.milestones.received'), icon: <FiBox /> },
    { stage: MilestoneStage.PROCESSING, label: t('tracking.milestones.processing'), icon: <FiPackage /> },
    { stage: MilestoneStage.OUT_FOR_DELIVERY, label: t('tracking.milestones.outForDelivery'), icon: <FiTruck /> },
    { stage: MilestoneStage.DELIVERED, label: t('tracking.milestones.delivered'), icon: <FiCheckCircle /> },
  ];
};

// Map API status to milestone stage (flexible mapping)
const statusToMilestone: Record<string, MilestoneStage> = {
  // Delivered statuses
  'DELIVERED_TO_RECIPIENT': MilestoneStage.DELIVERED,
  'DELIVERED': MilestoneStage.DELIVERED,
  'COMPLETED': MilestoneStage.DELIVERED,
  
  // Out for delivery statuses
  'SCANNED_BY_DRIVER_AND_IN_CAR': MilestoneStage.OUT_FOR_DELIVERY,
  'OUT_FOR_DELIVERY': MilestoneStage.OUT_FOR_DELIVERY,
  'IN_TRANSIT': MilestoneStage.OUT_FOR_DELIVERY,
  'ON_THE_WAY': MilestoneStage.OUT_FOR_DELIVERY,
  
  // Processing statuses
  'READY_FOR_PICKUP': MilestoneStage.PROCESSING,
  'IN_WAREHOUSE': MilestoneStage.PROCESSING,
  'PROCESSING': MilestoneStage.PROCESSING,
  'AT_HUB': MilestoneStage.PROCESSING,
  'SORTING': MilestoneStage.PROCESSING,
  
  // Received statuses
  'PICKED_UP': MilestoneStage.RECEIVED,
  'RECEIVED': MilestoneStage.RECEIVED,
  'CREATED': MilestoneStage.RECEIVED,
  'REGISTERED': MilestoneStage.RECEIVED,
  
  // Returned statuses
  'RETURNED': MilestoneStage.RETURNED,
  'RETURN_TO_SENDER': MilestoneStage.RETURNED,
  'REJECTED': MilestoneStage.RETURNED,
  
  // Failed statuses
  'FAILED': MilestoneStage.FAILED,
  'CANCELLED': MilestoneStage.CANCELLED,
  'DELIVERY_FAILED': MilestoneStage.FAILED,
};

// Enhanced status descriptions in Arabic
const statusDescriptions: Record<string, string> = {
  'DELIVERED_TO_RECIPIENT': 'تم تسليم الشحنة بنجاح للمستلم',
  'DELIVERED': 'تم تسليم الشحنة بنجاح',
  'COMPLETED': 'تم إكمال التوصيل',
  'SCANNED_BY_DRIVER_AND_IN_CAR': 'السائق استلم الشحنة وهي في طريقها إليك',
  'OUT_FOR_DELIVERY': 'الشحنة خارجة للتوصيل',
  'IN_TRANSIT': 'الشحنة في الطريق',
  'ON_THE_WAY': 'الشحنة في طريقها إليك',
  'READY_FOR_PICKUP': 'الشحنة جاهزة للاستلام من مركز التوزيع',
  'IN_WAREHOUSE': 'الشحنة موجودة في المستودع',
  'AT_HUB': 'الشحنة في مركز التوزيع',
  'SORTING': 'جاري فرز الشحنة',
  'PROCESSING': 'جاري معالجة الشحنة',
  'PICKED_UP': 'تم استلام الشحنة من المرسل',
  'RECEIVED': 'تم استلام الشحنة في النظام',
  'CREATED': 'تم إنشاء طلب الشحن',
  'REGISTERED': 'تم تسجيل الشحنة',
  'RETURNED': 'تم إرجاع الشحنة',
  'RETURN_TO_SENDER': 'تم إرجاع الشحنة للمرسل',
  'REJECTED': 'تم رفض استلام الشحنة',
  'FAILED': 'فشلت محاولة التوصيل',
  'DELIVERY_FAILED': 'فشل التوصيل',
  'CANCELLED': 'تم إلغاء الشحنة',
};

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
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState<string[]>([]);

  // Load tracking history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(TRACKING_HISTORY_KEY);
      if (saved) {
        setTrackingHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load tracking history:', e);
    }
  }, []);

  // Save tracking number to history
  const saveToHistory = (number: string) => {
    try {
      const sanitized = number.trim().toUpperCase();
      if (!sanitized) return;
      
      setTrackingHistory(prev => {
        const filtered = prev.filter(n => n !== sanitized);
        const updated = [sanitized, ...filtered].slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(TRACKING_HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error('Failed to save tracking history:', e);
    }
  };

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
      setError(t('tracking.errors.enterNumber'));
      return;
    }

    const sanitized = number.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (sanitized.length < 5 || sanitized.length > 30) {
      setError(t('tracking.errors.invalidNumber'));
      return;
    }

    setIsLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await fetch(`/api/tracking?barcode=${encodeURIComponent(sanitized)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('tracking.errors.searchError'));
      }

      setTrackingData(data);
      saveToHistory(sanitized); // Save successful tracking number to history
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tracking.errors.searchError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack();
  };

  // PRIMARY: Gregorian date format based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // SECONDARY: Islamic date
  const formatIslamicDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // Translate event text based on language
  const translateEvent = (eventName: string, arabicName?: string): string => {
    const name = (eventName || '').toLowerCase();
    
    // For English, return the original event name or a cleaned version
    if (language === 'en') {
      if (!name) return 'Status update';
      
      if (name.includes('signed') || name.includes('delivered to') || name.includes('received by')) {
        return 'Shipment delivered to recipient';
      }
      if (name.includes('changed') && name.includes('delivered')) {
        return 'Status changed to "Delivered"';
      }
      if (name.includes('is delivering') || name.includes('out for delivery')) {
        return 'Driver is on the way to deliver';
      }
      if (name.includes('left') && (name.includes('sorting') || name.includes('station'))) {
        return 'Shipment left distribution center';
      }
      if (name.includes('arrived') && (name.includes('station') || name.includes('sorting'))) {
        return 'Shipment arrived at distribution center';
      }
      if (name.includes('picked up') || name.includes('has picked')) {
        return 'Shipment picked up by courier';
      }
      if (name.includes('added the package') || name.includes('created')) {
        return 'Shipment order created';
      }
      if (name.includes('transit') || name.includes('on the way')) {
        return 'Shipment in transit';
      }
      if (name.includes('return') || name.includes('rejected')) {
        return 'Shipment returned';
      }
      if (name.includes('failed')) {
        return 'Delivery attempt failed';
      }
      return 'Status update';
    }
    
    // Arabic translations
    if (!name && !arabicName) {
      return 'تحديث حالة الشحنة';
    }

    if (name.includes('signed') || name.includes('delivered to') || name.includes('received by') || 
        (name.includes('parcel') && name.includes('signed'))) {
      return 'تم تسليم الشحنة للمستلم بنجاح';
    }
    
    if (name.includes('changed') && name.includes('delivered')) {
      return 'تم تغيير حالة الشحنة إلى "تم التوصيل"';
    }
    
    if (name.includes('is delivering') || name.includes('out for delivery') || 
        (name.includes('courier') && name.includes('delivering'))) {
      return 'السائق في طريقه لتوصيل الشحنة';
    }
    
    if (name.includes('left') && (name.includes('sorting') || name.includes('station') || name.includes('center'))) {
      return 'غادرت الشحنة مركز التوزيع';
    }
    
    if (name.includes('arrived') && (name.includes('station') || name.includes('sorting') || name.includes('center'))) {
      return 'وصلت الشحنة إلى مركز التوزيع';
    }
    
    if (name.includes('picked up') || name.includes('has picked') || 
        (name.includes('pickup') && name.includes('courier'))) {
      return 'تم استلام الشحنة من قبل المندوب';
    }
    
    if (name.includes('changed package status') || name.includes('changed status')) {
      if (name.includes('received at sorting')) {
        return 'تم استلام الشحنة في مركز الفرز';
      }
      if (name.includes('dispatching')) {
        return 'الشحنة جاهزة للإرسال';
      }
      return 'تم تحديث حالة الشحنة';
    }
    
    if (name.includes('added the package') || name.includes('added package') || 
        name.includes('created') || name.includes('registered')) {
      return 'تم إنشاء طلب الشحن';
    }
    
    if (name.includes('abnormal') || name.includes('exception') || name.includes('unreceived')) {
      return 'تم تسجيل ملاحظة على الشحنة';
    }
    
    if (name.includes('transit') || name.includes('on the way') || name.includes('in route')) {
      return 'الشحنة في الطريق';
    }
    
    if (name.includes('sorting') || name.includes('processing')) {
      return 'جاري فرز ومعالجة الشحنة';
    }
    
    if (name.includes('return') || name.includes('rejected')) {
      return 'تم إرجاع الشحنة';
    }
    
    if (name.includes('failed') || name.includes('unsuccessful')) {
      return 'فشلت محاولة التوصيل';
    }
    
    if (name.includes('warehouse')) {
      return 'الشحنة في المستودع';
    }
    
    if (name.includes('arrived')) {
      return 'وصلت الشحنة إلى مركز التوزيع';
    }
    
    if (name.includes('left') || name.includes('departed') || name.includes('dispatched')) {
      return 'غادرت الشحنة مركز التوزيع';
    }

    return 'تحديث حالة الشحنة';
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    return formatDate(dateString);
  };

  const getCurrentMilestone = (status: string): MilestoneStage => {
    return statusToMilestone[status] || MilestoneStage.RECEIVED;
  };

  const getProgressPercentage = (currentStage: MilestoneStage, status: string): number => {
    const milestonesList = getMilestones(status, t);
    const totalStages = milestonesList.length;
    const currentIndex = milestonesList.findIndex(m => m.stage === currentStage);
    
    if (currentIndex === -1) return 25;
    
    // Calculate percentage based on position in the milestone list
    return Math.round(((currentIndex + 1) / totalStages) * 100);
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status] || { 
      icon: <FiClock />, 
      color: 'default',
      label: 'قيد المعالجة'
    };
  };

  const getStatusDescription = (status: string, arabicName?: string): string => {
    return statusDescriptions[status] || arabicName || status;
  };

  return (
    <div className={styles.trackingPage}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1>{t('tracking.title')}</h1>
          <p>{t('tracking.subtitle')}</p>
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
                  placeholder={t('tracking.placeholder')}
                  className={styles.searchInput}
                  maxLength={30}
                  dir="ltr"
                  list="tracking-history"
                  autoComplete="on"
                  name="tracking-number"
                />
                {trackingHistory.length > 0 && (
                  <datalist id="tracking-history">
                    {trackingHistory.map((num, idx) => (
                      <option key={idx} value={num} />
                    ))}
                  </datalist>
                )}
              </div>
              <button 
                type="submit" 
                className={styles.searchButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  t('tracking.button')
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
              {/* Progress Bar Card */}
              <div className={styles.progressCard}>
                <div className={styles.progressHeader}>
                  <div>
                    <h2 className={styles.currentStatus}>
                      {language === 'ar' ? trackingData.arStatus : trackingData.enStatus}
                    </h2>
                    <p className={styles.trackingId}>{t('tracking.trackingNumber')}: {trackingData.barcode}</p>
                  </div>
                  <div className={styles.progressPercentage}>
                    {getProgressPercentage(getCurrentMilestone(trackingData.status), trackingData.status)}%
                    <span>{t('tracking.complete')}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className={styles.progressBar}>
                  {getMilestones(trackingData.status, t).map((milestone, index) => {
                    const currentStage = getCurrentMilestone(trackingData.status);
                    const milestonesList = getMilestones(trackingData.status, t);
                    const isCompleted = milestone.stage <= currentStage;
                    const isActive = milestone.stage === currentStage;
                    
                    return (
                      <div key={milestone.stage} className={styles.milestoneWrapper}>
                        <div className={styles.milestoneItem}>
                          <div className={`${styles.milestoneIcon} ${isCompleted ? styles.completed : ''} ${isActive ? styles.active : ''}`}>
                            {milestone.icon}
                          </div>
                          <span className={`${styles.milestoneLabel} ${isCompleted ? styles.completed : ''} ${isActive ? styles.active : ''}`}>
                            {milestone.label}
                          </span>
                        </div>
                        {index < milestonesList.length - 1 && (
                          <div className={`${styles.progressLine} ${isCompleted ? styles.completed : ''}`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Estimated Delivery */}
                {trackingData.expectedDeliveryDate && getCurrentMilestone(trackingData.status) < MilestoneStage.DELIVERED && (
                  <div className={styles.estimatedDelivery}>
                    <FiClock />
                    <span>{t('tracking.expectedDelivery')}: {getRelativeTime(trackingData.expectedDeliveryDate)}</span>
                  </div>
                )}
              </div>

              {/* Destination & Receiver Info */}
              <div className={styles.infoGrid}>
                {trackingData.destinationAddress && (
                  <div className={styles.infoCard}>
                    <FiMapPin className={styles.infoIcon} />
                    <div>
                      <h3>{t('tracking.destination')}</h3>
                      <p>
                        {language === 'ar' 
                          ? (trackingData.destinationAddress.arabicCityName || trackingData.destinationAddress.city)
                          : trackingData.destinationAddress.city}
                        {language === 'ar' && trackingData.destinationAddress.arabicRegionName && 
                          `, ${trackingData.destinationAddress.arabicRegionName}`}
                        {language === 'en' && trackingData.destinationAddress.region && 
                          `, ${trackingData.destinationAddress.region}`}
                      </p>
                    </div>
                  </div>
                )}

                {trackingData.fullReceiverName && (
                  <div className={styles.infoCard}>
                    <FiUser className={styles.infoIcon} />
                    <div>
                      <h3>{t('tracking.receiver')}</h3>
                      <p>{trackingData.fullReceiverName}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Parcel Details Toggle */}
              <button 
                className={styles.detailsToggle}
                onClick={() => setShowDetails(!showDetails)}
              >
                <FiInfo />
                <span>{t('tracking.shipmentDetails')}</span>
                {showDetails ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              {/* Parcel Details */}
              {showDetails && (
                <div className={styles.detailsCard}>
                  <h3>{t('tracking.shipmentInfo')}</h3>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>{t('tracking.trackingNumber')}</span>
                      <span className={styles.detailValue}>{trackingData.barcode}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>{t('tracking.createdDate')}</span>
                      <span className={styles.detailValue}>
                        {formatDate(trackingData.createdDate)}
                        <small>{formatIslamicDate(trackingData.createdDate)}</small>
                      </span>
                    </div>
                    {trackingData.deliveryDate && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('tracking.deliveryDate')}</span>
                        <span className={styles.detailValue}>
                          {formatDate(trackingData.deliveryDate)}
                          <small>{formatIslamicDate(trackingData.deliveryDate)}</small>
                        </span>
                      </div>
                    )}
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>{t('tracking.currentStatus')}</span>
                      <span className={`${styles.detailValue} ${styles.statusValue}`}>
                        {language === 'ar' ? trackingData.arStatus : trackingData.enStatus}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className={styles.timelineCard}>
                <div className={styles.timelineHeader}>
                  <h3>{t('tracking.detailedTimeline')}</h3>
                  {trackingData.deliveryRoute && trackingData.deliveryRoute.length > 3 && (
                    <button 
                      className={styles.timelineToggle}
                      onClick={() => setShowFullTimeline(!showFullTimeline)}
                    >
                      {showFullTimeline ? t('tracking.showLess') : `${t('tracking.showAll')} (${trackingData.deliveryRoute.length})`}
                    </button>
                  )}
                </div>
                
                <div className={styles.timeline}>
                  {(showFullTimeline 
                    ? trackingData.deliveryRoute 
                    : trackingData.deliveryRoute?.slice(0, 3)
                  )?.map((event, index) => (
                    <div key={index} className={styles.timelineItem}>
                      <div className={`${styles.timelineDot} ${index === 0 ? styles.active : ''}`}></div>
                      <div className={styles.timelineContent}>
                        <p className={styles.timelineEvent}>
                          {translateEvent(event.name, event.arabicName)}
                        </p>
                        <div className={styles.timelineMeta}>
                          <FiCalendar />
                          <span className={styles.gregorianDate}>{formatDate(event.deliveryDate)}</span>
                        </div>
                        <div className={styles.timelineMetaSecondary}>
                          <span className={styles.islamicDate}>{formatIslamicDate(event.deliveryDate)}</span>
                        </div>
                        {event.userName && (
                          <div className={styles.timelineMeta}>
                            <FiUser />
                            <span>{event.userName}</span>
                          </div>
                        )}
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
