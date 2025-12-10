'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiCalendar, FiUser, FiArrowRight, FiArrowLeft, FiEye } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n';
import styles from './page.module.css';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  images: string | null;
  published_at: string;
  views: number;
  meta_title: string | null;
  meta_description: string | null;
}

export default function BlogPostPage() {
  const { t, language, isRTL } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allImages, setAllImages] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const gregorian = new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    }).format(date);
    const islamic = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      year: 'numeric', month: 'long', day: 'numeric',
    }).format(date);
    return `${gregorian} | ${islamic}`;
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`, { cache: 'no-store' });
        if (!res.ok) {
          if (res.status === 404) setError(t('blog.notFound'));
          else throw new Error(t('common.error'));
          return;
        }
        const data: BlogPost = await res.json();
        setPost(data);
        const images: string[] = [];
        if (data.featured_image) images.push(data.featured_image);
        if (data.images) {
          try { images.push(...JSON.parse(data.images)); } catch {}
        }
        setAllImages(images);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPost();
  }, [slug, t]);

  const BackIcon = isRTL ? FiArrowRight : FiArrowLeft;

  if (loading) {
    return (
      <div className={styles.blogPostPage}>
        <div className="container">
          <div className={styles.loading}>{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.blogPostPage}>
        <div className="container">
          <div className={styles.errorPage}>
            <h1>404</h1>
            <p>{error || t('blog.notFound')}</p>
            <Link href="/blog" className="btn btn-primary">
              <BackIcon />
              {t('blog.backToBlog')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.blogPostPage}>
      <section className={styles.hero}>
        <div className="container">
          <Link href="/blog" className={styles.backLink}>
            <BackIcon />
            {t('blog.backToBlog')}
          </Link>
          <h1>{post.title}</h1>
          <div className={styles.meta}>
            <span className={styles.metaItem}><FiUser />{t('blog.author')}</span>
            <span className={styles.metaItem}><FiCalendar />{formatDate(post.published_at)}</span>
            <span className={styles.metaItem}><FiEye />{post.views} {t('blog.views')}</span>
          </div>
        </div>
      </section>
      <section className={styles.content}>
        <div className="container">
          <article className={styles.article}>
            {post.featured_image && (
              <div className={styles.featuredImage}>
                <img src={post.featured_image} alt={post.title} />
              </div>
            )}
            {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
            <div className={styles.articleContent}>
              {post.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </div>
            {allImages.length > 1 && (
              <div className={styles.gallery}>
                <h3>{t('blog.gallery')}</h3>
                <div className={styles.galleryGrid}>
                  {allImages.slice(1).map((image, index) => (
                    <div key={index} className={styles.galleryItem}>
                      <img src={image} alt={`${language === 'ar' ? 'صورة' : 'Image'} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
          <div className={styles.backSection}>
            <Link href="/blog" className="btn btn-secondary">
              <BackIcon />
              {t('blog.backToBlog')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
