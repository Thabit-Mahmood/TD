'use client';

import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n';
import styles from './Testimonials.module.css';

interface Review {
  id: number;
  customer_name: string;
  company_name: string | null;
  position: string | null;
  review_text: string;
  rating: number;
  avatar_url: string | null;
}

export default function Testimonials() {
  const { t, language } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews?limit=12', { cache: 'no-store' });
        const data = await res.json();
        if (data.reviews) setReviews(data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  if (reviews.length === 0) return null;

  const MAX_TEXT_LENGTH = 150;

  const renderCard = (review: Review, index: number) => {
    const displayText = review.review_text.length > MAX_TEXT_LENGTH 
      ? review.review_text.slice(0, MAX_TEXT_LENGTH) + '...'
      : review.review_text;

    return (
      <div key={`${review.id}-${index}`} className={styles.card}>
        <div className={styles.rating}>
          {[...Array(review.rating)].map((_, i) => (
            <FiStar key={i} className={styles.star} />
          ))}
        </div>
        <div className={styles.textWrapper}>
          <p className={styles.text}>{displayText}</p>
        </div>
        <div className={styles.author}>
          <div className={styles.avatar}>
            {review.avatar_url ? (
              <img src={review.avatar_url} alt={review.customer_name} />
            ) : (
              <span>{review.customer_name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h4>{review.customer_name}</h4>
            <p>
              {review.position && `${review.position}${language === 'ar' ? '، ' : ', '}`}
              {review.company_name}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Triple the reviews for seamless infinite loop
  const tripleReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2>{t('home.testimonials.title')}</h2>
          <p>{t('home.testimonials.subtitle')}</p>
        </div>
      </div>

      <div className={styles.sliderWrapper}>
        <div className={`${styles.slider} ${language === 'ar' ? styles.sliderRtl : ''}`}>
          {tripleReviews.map((review, index) => renderCard(review, index))}
        </div>
      </div>
    </section>
  );
}
