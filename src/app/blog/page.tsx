'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiCalendar, FiUser, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n';
import styles from './page.module.css';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  views: number;
}

export default function BlogPage() {
  const { t, language, isRTL } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog?limit=20', { cache: 'no-store' });
        const data = await res.json();
        if (data.posts) setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const ArrowIcon = isRTL ? FiArrowLeft : FiArrowRight;

  return (
    <div className={styles.blogPage}>
      <section className={styles.hero}>
        <div className="container">
          <h1>{t('blog.title')}</h1>
          <p>{t('blog.subtitle')}</p>
        </div>
      </section>
      <section className={styles.blogSection}>
        <div className="container">
          {loading ? (
            <div className={styles.loading}>{t('common.loading')}</div>
          ) : posts.length === 0 ? (
            <div className={styles.loading}>{language === 'ar' ? 'لا توجد مقالات بعد' : 'No articles yet'}</div>
          ) : (
            <div className={styles.blogGrid}>
              {posts.map((post) => (
                <article key={post.id} className={styles.blogCard}>
                  <div className={styles.blogImage}>
                    {post.featured_image ? (
                      <img src={post.featured_image} alt={post.title} />
                    ) : (
                      <span className={styles.category}>{t('blog.article')}</span>
                    )}
                  </div>
                  <div className={styles.blogContent}>
                    <h2 className={styles.blogTitle}>
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className={styles.blogExcerpt}>{post.excerpt}</p>
                    <div className={styles.blogMeta}>
                      <span className={styles.metaItem}>
                        <FiUser />
                        {t('blog.author')}
                      </span>
                      <span className={styles.metaItem}>
                        <FiCalendar />
                        {formatDate(post.published_at)}
                      </span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                      {t('blog.readMore')}
                      <ArrowIcon />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
