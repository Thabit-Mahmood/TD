'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiImage, FiUpload } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from '../page.module.css';

interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
  type: string;
  is_active: number;
}

export default function BrandsPage() {
  const { t, language } = useLanguage();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: '', logo_url: '', type: 'platform' });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BackIcon = language === 'ar' ? FiArrowRight : FiArrowLeft;

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/brands?all=true&t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      setBrands(data.brands || []);
    } catch (err) {
      console.error('Error fetching brands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    setError('');

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'brands');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setFormData({ ...formData, logo_url: data.url });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Form submitted with data:', formData);

    if (uploading) {
      setError('Please wait for the image to finish uploading');
      return;
    }

    if (!formData.name.trim()) {
      setError(t('dashboard.brands.nameRequired'));
      return;
    }

    setLoading(true);

    try {
      const url = '/api/brands';
      const method = editingBrand ? 'PUT' : 'POST';
      const body = editingBrand
        ? { id: editingBrand.id, ...formData, is_active: editingBrand.is_active }
        : formData;

      console.log('Sending request:', { method, url, body });

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log('Response:', { status: res.status, data });

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      setShowForm(false);
      setEditingBrand(null);
      setFormData({ name: '', logo_url: '', type: 'platform' });
      setPreviewUrl(null);
      await fetchBrands();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dashboard.errorOccurred'));
      console.error('Error saving brand:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, logo_url: brand.logo_url || '', type: brand.type });
    setPreviewUrl(brand.logo_url);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('dashboard.brands.confirmDelete'))) return;

    try {
      await fetch(`/api/brands?id=${id}`, { method: 'DELETE' });
      fetchBrands();
    } catch (err) {
      console.error('Error deleting brand:', err);
    }
  };

  const handleToggleActive = async (brand: Brand) => {
    try {
      await fetch('/api/brands', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...brand, is_active: brand.is_active ? 0 : 1 }),
      });
      fetchBrands();
    } catch (err) {
      console.error('Error toggling brand:', err);
    }
  };

  const openForm = () => {
    setShowForm(true);
    setEditingBrand(null);
    setFormData({ name: '', logo_url: '', type: 'platform' });
    setPreviewUrl(null);
    setError('');
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBrand(null);
    setFormData({ name: '', logo_url: '', type: 'platform' });
    setPreviewUrl(null);
    setError('');
  };

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <Link href="/dashboard" className={styles.backLink}>
              <BackIcon />
              {t('dashboard.backToDashboard')}
            </Link>
            <h1>{t('dashboard.brands.title')}</h1>
            <p>{t('dashboard.brands.subtitle')}</p>
          </div>
          <button className="btn btn-primary" onClick={openForm}>
            <FiPlus />
            {t('dashboard.brands.addNew')}
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>{editingBrand ? t('dashboard.brands.edit') : t('dashboard.brands.addNew')}</h2>
                <button onClick={closeForm} className={styles.closeBtn}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleSubmit} className={styles.settingsForm}>
                {error && <div className={styles.errorAlert}>{error}</div>}
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('dashboard.brands.name')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                    placeholder={t('dashboard.brands.namePlaceholder')}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('dashboard.brands.logo')}</label>
                  <div className={styles.uploadArea}>
                    {previewUrl ? (
                      <div className={styles.uploadPreview}>
                        <Image 
                          src={previewUrl} 
                          alt="Preview" 
                          width={120} 
                          height={60} 
                          style={{ objectFit: 'contain' }}
                        />
                        <button 
                          type="button" 
                          className={styles.removePreview}
                          onClick={() => {
                            setPreviewUrl(null);
                            setFormData({ ...formData, logo_url: '' });
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className={styles.uploadPlaceholder}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploading ? (
                          <span className={styles.spinner}></span>
                        ) : (
                          <>
                            <FiUpload size={24} />
                            <span>{t('dashboard.brands.uploadLogo')}</span>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={styles.fileInput}
                      disabled={uploading}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('dashboard.brands.type')}</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={styles.input}
                  >
                    <option value="platform">{t('dashboard.brands.typePlatform')}</option>
                    <option value="partner">{t('dashboard.brands.typePartner')}</option>
                  </select>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className="btn btn-primary" disabled={uploading || loading}>
                    {loading ? (
                      <span className={styles.spinner}></span>
                    ) : (
                      editingBrand ? t('dashboard.saveChanges') : t('dashboard.brands.add')
                    )}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closeForm} disabled={loading}>
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Brands List */}
        <div className={styles.card}>
          {loading ? (
            <div className={styles.loading}>{t('dashboard.loading')}</div>
          ) : brands.length === 0 ? (
            <div className={styles.empty}>{t('dashboard.brands.noBrands')}</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t('dashboard.brands.logo')}</th>
                    <th>{t('dashboard.brands.name')}</th>
                    <th>{t('dashboard.brands.type')}</th>
                    <th>{t('dashboard.brands.status')}</th>
                    <th>{t('dashboard.brands.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.id}>
                      <td>
                        {brand.logo_url ? (
                          <Image 
                            src={brand.logo_url} 
                            alt={brand.name} 
                            width={60} 
                            height={30} 
                            className={styles.logoPreview}
                            style={{ objectFit: 'contain' }}
                          />
                        ) : (
                          <div className={styles.noLogo}><FiImage /></div>
                        )}
                      </td>
                      <td>{brand.name}</td>
                      <td>
                        <span className={styles.typeLabel}>
                          {brand.type === 'platform' ? t('dashboard.brands.typePlatform') : t('dashboard.brands.typePartner')}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${brand.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                          {brand.is_active ? t('dashboard.brands.active') : t('dashboard.brands.inactive')}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button onClick={() => handleToggleActive(brand)} className={styles.actionBtn} title={brand.is_active ? t('dashboard.brands.deactivate') : t('dashboard.brands.activate')}>
                            {brand.is_active ? <FiX /> : <FiCheck />}
                          </button>
                          <button onClick={() => handleEdit(brand)} className={styles.actionBtn}>
                            <FiEdit2 />
                          </button>
                          <button onClick={() => handleDelete(brand.id)} className={`${styles.actionBtn} ${styles.danger}`}>
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
