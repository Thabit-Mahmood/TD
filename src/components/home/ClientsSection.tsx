'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './ClientsSection.module.css';

interface Client {
  id: number;
  name: string;
  logo_url: string | null;
}

export default function ClientsSection() {
  const { t, language } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/clients', { cache: 'no-store' });
        const data = await res.json();
        if (data.clients) setClients(data.clients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchClients();
  }, []);

  if (clients.length === 0) return null;

  const renderClient = (client: Client, index: number) => (
    <div key={`${client.id}-${index}`} className={styles.item}>
      {client.logo_url ? (
        <img src={client.logo_url} alt={client.name} className={styles.logo} />
      ) : (
        <div className={styles.placeholder}>
          <span>{client.name.charAt(0)}</span>
        </div>
      )}
    </div>
  );

  // Triple the clients for seamless infinite loop
  const tripleClients = [...clients, ...clients, ...clients];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2>{t('clients.title')}</h2>
          <p>{t('clients.subtitle')}</p>
        </div>
      </div>

      <div className={styles.sliderWrapper}>
        <div className={`${styles.slider} ${language === 'ar' ? styles.sliderRtl : ''}`}>
          {tripleClients.map((client, index) => renderClient(client, index))}
        </div>
      </div>
    </section>
  );
}
