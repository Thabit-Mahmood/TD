'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n';
import { formatNumber } from '@/lib/utils/formatNumber';
import styles from '../page.module.css';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  created_at: string;
  views: number;
}

export default function BlogListPage() {
  const { t, language, isRTL } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/api/admin/blog' : `/api/admin/blog?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const handleDelete = async (id: number) => {
    if (!confirm(t('dashboard.confirmDeletePost'))) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const formatDate = (dateString: string) => {
    // Always use en-US to ensure Western numerals
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: t('dashboard.status.draft'),
      published: t('dashboard.status.published'),
      archived: t('dashboard.status.archived'),
    };
    return statusMap[status] || status;
  };

  const ArrowIcon = isRTL ? FiArrowRight : FiArrowLeft;

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <Link href="/dashboard" className={styles.backLink}>
              <ArrowIcon />
              {t('dashboard.backToDashboard')}
            </Link>
            <h1>{t('dashboard.blogManagement')}</h1>
          </div>
          <Link href="/dashboard/blog/new" className="btn btn-primary">
            <FiPlus />
            {t('dashboard.newPost')}
          </Link>
        </div>

        <div className={styles.filters}>
          <button 
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('dashboard.blog.filterAll')}
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'published' ? styles.active : ''}`}
            onClick={() => setFilter('published')}
          >
            {t('dashboard.blog.filterPublished')}
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'draft' ? styles.active : ''}`}
            onClick={() => setFilter('draft')}
          >
            {t('dashboard.blog.filterDraft')}
          </button>
        </div>

        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.loading}>{t('dashboard.loading')}</div>
          ) : posts.length === 0 ? (
            <div className={styles.empty}>
              <p>{t('dashboard.noPosts')}</p>
              <Link href="/dashboard/blog/new" className="btn btn-primary">
                {t('dashboard.createNewPost')}
              </Link>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('dashboard.blog.tableTitle')}</th>
                  <th>{t('dashboard.blog.tableStatus')}</th>
                  <th>{t('dashboard.blog.tableViews')}</th>
                  <th>{t('dashboard.blog.tableDate')}</th>
                  <th>{t('dashboard.blog.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div className={styles.titleCell}>
                        <strong>{post.title}</strong>
                        {post.excerpt && <p>{post.excerpt.substring(0, 60)}...</p>}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${post.status === 'published' ? styles.badgeSuccess : styles.badgeWarning}`}>
                        {getStatusLabel(post.status)}
                      </span>
                    </td>
                    <td>{formatNumber(post.views)}</td>
                    <td>{formatDate(post.created_at)}</td>
                    <td>
                      <div className={styles.tableActions}>
                        {post.status === 'published' && (
                          <Link href={`/blog/${post.slug}`} className={styles.actionBtn} target="_blank">
                            <FiEye />
                          </Link>
                        )}
                        <Link href={`/dashboard/blog/${post.id}`} className={styles.actionBtn}>
                          <FiEdit />
                        </Link>
                        <button onClick={() => handleDelete(post.id)} className={`${styles.actionBtn} ${styles.danger}`}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
