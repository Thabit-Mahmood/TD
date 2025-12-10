'use client';

import { useState, useEffect, useRef } from 'react';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews?limit=12', { cache: 'no-store' });
        const data = await res.json();
        if (data.reviews) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Auto-scroll when more than 3 reviews
  useEffect(() => {
    if (reviews.length <= 3 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [reviews.length, isPaused]);

  // Don't render section if no reviews
  if (!loading && reviews.length === 0) {
    return null;
  }

  const isCarousel = reviews.length > 3;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const getVisibleReviews = () => {
    if (!isCarousel) return reviews;
    
    // On mobile, show 1 review; on tablet, show 2; on desktop, show 3
    // This will be controlled by CSS grid, but we'll return enough items
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % reviews.length;
      visible.push(reviews[index]);
    }
    return visible;
  };

  return (
    <section className={styles.testimonials}>
      <div className="container">
        <div className={styles.header}>
          <h2>{t('home.testimonials.title')}</h2>
          <p>{t('home.testimonials.subtitle')}</p>
        </div>

        <div 
          className={styles.carouselWrapper}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {isCarousel && (
            <button 
              className={`${styles.navButton} ${styles.prevButton}`} 
              onClick={prevSlide}
              aria-label="Previous"
            >
              <FiChevronRight />
            </button>
          )}

          <div className={styles.testimonialsGrid} ref={carouselRef}>
            {getVisibleReviews().map((review, idx) => (
              <div 
                key={`${review.id}-${idx}`} 
                className={`${styles.testimonialCard} ${isCarousel ? styles.animated : ''}`}
              >
                <div className={styles.rating}>
                  {[...Array(review.rating)].map((_, i) => (
                    <FiStar key={i} className={styles.star} />
                  ))}
                </div>

                <p className={styles.text}>{review.review_text}</p>

                <div className={styles.author}>
                  <div className={styles.avatar}>
                    {review.avatar_url ? (
                      <img src={review.avatar_url} alt={review.customer_name} />
                    ) : (
                      <span>{review.customer_name.charAt(0)}</span>
                    )}
                  </div>
                  <div className={styles.authorInfo}>
                    <h4>{review.customer_name}</h4>
                    <p>
                      {review.position && `${review.position}${language === 'ar' ? '، ' : ', '}`}
                      {review.company_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isCarousel && (
            <button 
              className={`${styles.navButton} ${styles.nextButton}`} 
              onClick={nextSlide}
              aria-label="Next"
            >
              <FiChevronLeft />
            </button>
          )}
        </div>

        {isCarousel && (
          <div className={styles.dots}>
            {reviews.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
