'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiAlertCircle, FiBox, FiMapPin, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './Hero.module.css';

const TRACKING_HISTORY_KEY = 'td_tracking_history';
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

// Milestone stages
enum MilestoneStage {
  RECEIVED = 1,
  PROCESSING = 2,
  OUT_FOR_DELIVERY = 3,
  DELIVERED = 4,
}

// Simplified milestones for homepage - will be translated dynamically
const getMilestoneLabels = (t: (key: string) => string) => [
  { stage: MilestoneStage.RECEIVED, label: t('tracking.milestones.received') || 'تم الاستلام', icon: <FiBox /> },
  { stage: MilestoneStage.PROCESSING, label: t('tracking.milestones.processing') || 'قيد المعالجة', icon: <FiPackage /> },
  { stage: MilestoneStage.OUT_FOR_DELIVERY, label: t('tracking.milestones.outForDelivery') || 'خارجة للتوصيل', icon: <FiTruck /> },
  { stage: MilestoneStage.DELIVERED, label: t('tracking.milestones.delivered') || 'تم التوصيل', icon: <FiCheckCircle /> },
];

// Map API status to milestone stage
const statusToMilestone: Record<string, MilestoneStage> = {
  'DELIVERED_TO_RECIPIENT': MilestoneStage.DELIVERED,
  'DELIVERED': MilestoneStage.DELIVERED,
  'COMPLETED': MilestoneStage.DELIVERED,
  'SCANNED_BY_DRIVER_AND_IN_CAR': MilestoneStage.OUT_FOR_DELIVERY,
  'OUT_FOR_DELIVERY': MilestoneStage.OUT_FOR_DELIVERY,
  'IN_TRANSIT': MilestoneStage.OUT_FOR_DELIVERY,
  'READY_FOR_PICKUP': MilestoneStage.PROCESSING,
  'IN_WAREHOUSE': MilestoneStage.PROCESSING,
  'PROCESSING': MilestoneStage.PROCESSING,
  'AT_HUB': MilestoneStage.PROCESSING,
  'PICKED_UP': MilestoneStage.RECEIVED,
  'RECEIVED': MilestoneStage.RECEIVED,
  'CREATED': MilestoneStage.RECEIVED,
};

export default function Hero() {
  const { t, language, isRTL } = useLanguage();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState<string[]>([]);

  const milestones = getMilestoneLabels(t);

  // Load tracking history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(TRACKING_HISTORY_KEY);
      if (saved) {
        setTrackingHistory(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save tracking number to history
  const saveToHistory = useCallback((barcode: string) => {
    try {
      const updated = [barcode, ...trackingHistory.filter(item => item !== barcode)].slice(0, MAX_HISTORY_ITEMS);
      setTrackingHistory(updated);
      localStorage.setItem(TRACKING_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  }, [trackingHistory]);

  const handleTrack = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      setError(t('tracking.errors.enterNumber'));
      return;
    }

    // Sanitize input - only allow alphanumeric
    const sanitized = trackingNumber.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    
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
      setShowResults(true);
      // Save successful tracking number to history
      saveToHistory(sanitized);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tracking.errors.searchError'));
    } finally {
      setIsLoading(false);
    }
  }, [trackingNumber, saveToHistory, t]);

  // Get current milestone stage
  const getCurrentMilestone = useCallback((status: string): MilestoneStage => {
    return statusToMilestone[status] || MilestoneStage.RECEIVED;
  }, []);

  // Get progress percentage
  const getProgressPercentage = useCallback((status: string): number => {
    const stage = getCurrentMilestone(status);
    return Math.round((stage / 4) * 100);
  }, [getCurrentMilestone]);

  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.heroPattern}></div>
      </div>
      
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              {t('home.hero.titlePart1')}
              <span className={styles.highlight}> {t('home.hero.titlePart2')}</span>
            </h1>
            <p className={styles.heroSubtitle}>
              {t('home.hero.subtitle')}
            </p>
          </div>

          {/* Tracking Box */}
          <div className={styles.trackingBox}>
            <div className={styles.trackingHeader}>
              <FiPackage className={styles.trackingIcon} />
              <h2>{t('tracking.title')}</h2>
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
                  placeholder={t('tracking.placeholder')}
                  className={styles.trackingInput}
                  maxLength={30}
                  aria-label={t('tracking.title')}
                  dir="ltr"
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
                      <span>{t('tracking.button')}</span>
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

            {/* Tracking Results - Enhanced Simplified Version */}
            {showResults && trackingData && (
              <div className={styles.trackingResults}>
                <div className={styles.resultHeader}>
                  <div className={styles.resultInfo}>
                    <h3 className={styles.resultStatus}>
                      {language === 'ar' ? trackingData.arStatus : trackingData.enStatus}
                    </h3>
                    <p className={styles.trackingId}>{t('tracking.trackingNumber')}: {trackingData.barcode}</p>
                  </div>
                  <div className={styles.resultPercentage}>
                    {getProgressPercentage(trackingData.status)}%
                  </div>
                  <button 
                    className={styles.closeResults}
                    onClick={() => setShowResults(false)}
                    aria-label={t('common.close')}
                  >
                    ×
                  </button>
                </div>

                {/* Simplified Progress Bar */}
                <div className={styles.progressBar}>
                  {milestones.map((milestone, index) => {
                    const currentStage = getCurrentMilestone(trackingData.status);
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
                        {index < milestones.length - 1 && (
                          <div className={`${styles.progressLine} ${isCompleted ? styles.completed : ''}`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Destination */}
                {trackingData.destinationAddress && (
                  <div className={styles.destinationInfo}>
                    <FiMapPin />
                    <span>
                      {language === 'ar' 
                        ? (trackingData.destinationAddress.arabicCityName || trackingData.destinationAddress.city)
                        : trackingData.destinationAddress.city}
                      {language === 'ar' && trackingData.destinationAddress.arabicRegionName && `, ${trackingData.destinationAddress.arabicRegionName}`}
                      {language === 'en' && trackingData.destinationAddress.region && `, ${trackingData.destinationAddress.region}`}
                    </span>
                  </div>
                )}

                {/* View More Link */}
                <Link 
                  href={`/tracking?barcode=${trackingData.barcode}`}
                  className={styles.viewMoreLink}
                >
                  <span>{t('tracking.viewDetails')}</span>
                  {isRTL ? <FiArrowLeft /> : <FiArrowRight />}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Stats - Temporarily Hidden */}
        {/* <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+500K</span>
            <span className={styles.statLabel}>{t('home.stats.deliveries')}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+1000</span>
            <span className={styles.statLabel}>{t('home.stats.clients')}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>+50</span>
            <span className={styles.statLabel}>{t('home.stats.cities')}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>99%</span>
            <span className={styles.statLabel}>{t('home.stats.onTime')}</span>
          </div>
        </div> */}
      </div>
    </section>
  );
}
