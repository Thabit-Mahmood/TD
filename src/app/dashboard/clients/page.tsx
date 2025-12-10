'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiImage, FiUpload } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from '../page.module.css';

interface Client {
  id: number;
  name: string;
  logo_url: string | null;
  is_active: number;
}

export default function ClientsPage() {
  const { t, language } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({ name: '', logo_url: '' });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BackIcon = language === 'ar' ? FiArrowRight : FiArrowLeft;

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/clients?all=true&t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
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
      uploadData.append('folder', 'clients');

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
      setError(t('dashboard.clients.nameRequired'));
      return;
    }

    setLoading(true);

    try {
      const url = '/api/clients';
      const method = editingClient ? 'PUT' : 'POST';
      const body = editingClient
        ? { id: editingClient.id, ...formData, is_active: editingClient.is_active }
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
      setEditingClient(null);
      setFormData({ name: '', logo_url: '' });
      setPreviewUrl(null);
      await fetchClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dashboard.errorOccurred'));
      console.error('Error saving client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({ name: client.name, logo_url: client.logo_url || '' });
    setPreviewUrl(client.logo_url);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('dashboard.clients.confirmDelete'))) return;

    try {
      await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
      fetchClients();
    } catch (err) {
      console.error('Error deleting client:', err);
    }
  };

  const handleToggleActive = async (client: Client) => {
    try {
      await fetch('/api/clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...client, is_active: client.is_active ? 0 : 1 }),
      });
      fetchClients();
    } catch (err) {
      console.error('Error toggling client:', err);
    }
  };

  const openForm = () => {
    setShowForm(true);
    setEditingClient(null);
    setFormData({ name: '', logo_url: '' });
    setPreviewUrl(null);
    setError('');
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingClient(null);
    setFormData({ name: '', logo_url: '' });
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
            <h1>{t('dashboard.clients.title')}</h1>
          </div>
          <button className="btn btn-primary" onClick={openForm}>
            <FiPlus />
            {t('dashboard.clients.addNew')}
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>{editingClient ? t('dashboard.clients.edit') : t('dashboard.clients.addNew')}</h2>
                <button onClick={closeForm} className={styles.closeBtn}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleSubmit} className={styles.settingsForm}>
                {error && <div className={styles.errorAlert}>{error}</div>}
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('dashboard.clients.name')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                    placeholder={t('dashboard.clients.namePlaceholder')}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('dashboard.clients.logo')}</label>
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
                            <span>{t('dashboard.clients.uploadLogo')}</span>
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

                <div className={styles.formActions}>
                  <button type="submit" className="btn btn-primary" disabled={uploading || loading}>
                    {loading ? (
                      <span className={styles.spinner}></span>
                    ) : (
                      editingClient ? t('dashboard.saveChanges') : t('dashboard.clients.add')
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

        {/* Clients List */}
        <div className={styles.card}>
          {loading ? (
            <div className={styles.loading}>{t('dashboard.loading')}</div>
          ) : clients.length === 0 ? (
            <div className={styles.empty}>{t('dashboard.clients.noClients')}</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t('dashboard.clients.logo')}</th>
                    <th>{t('dashboard.clients.name')}</th>
                    <th>{t('dashboard.clients.status')}</th>
                    <th>{t('dashboard.clients.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        {client.logo_url ? (
                          <Image 
                            src={client.logo_url} 
                            alt={client.name} 
                            width={60} 
                            height={30} 
                            className={styles.logoPreview}
                            style={{ objectFit: 'contain' }}
                          />
                        ) : (
                          <div className={styles.noLogo}><FiImage /></div>
                        )}
                      </td>
                      <td>{client.name}</td>
                      <td>
                        <span className={`${styles.badge} ${client.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                          {client.is_active ? t('dashboard.clients.active') : t('dashboard.clients.inactive')}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button onClick={() => handleToggleActive(client)} className={styles.actionBtn} title={client.is_active ? t('dashboard.clients.deactivate') : t('dashboard.clients.activate')}>
                            {client.is_active ? <FiX /> : <FiCheck />}
                          </button>
                          <button onClick={() => handleEdit(client)} className={styles.actionBtn}>
                            <FiEdit2 />
                          </button>
                          <button onClick={() => handleDelete(client.id)} className={`${styles.actionBtn} ${styles.danger}`}>
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
