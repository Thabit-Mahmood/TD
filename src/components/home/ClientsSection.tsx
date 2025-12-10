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
  const { t } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/clients', { cache: 'no-store' });
        const data = await res.json();
        if (data.clients && data.clients.length > 0) {
          setClients(data.clients);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (clients.length <= 6) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % clients.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [clients.length]);

  // Don't render if no clients
  if (!loading && clients.length === 0) {
    return null;
  }

  const getVisibleClients = () => {
    if (clients.length <= 6) return clients;
    
    const visible = [];
    for (let i = 0; i < 6; i++) {
      const index = (currentIndex + i) % clients.length;
      visible.push(clients[index]);
    }
    return visible;
  };

  const renderLogo = (client: Client) => {
    if (client.logo_url) {
      return <img src={client.logo_url} alt={client.name} className={styles.logoImg} />;
    }
    
    return (
      <div className={styles.logoPlaceholder}>
        <span>{client.name.charAt(0)}</span>
      </div>
    );
  };

  return (
    <section className={styles.clientsSection}>
      <div className="container">
        <div className={styles.header}>
          <h2>{t('clients.title')}</h2>
          <p>{t('clients.subtitle')}</p>
        </div>
        <div className={styles.logosGrid}>
          {getVisibleClients().map((client, index) => (
            <div key={`${client.id}-${index}`} className={styles.logoItem}>
              {renderLogo(client)}
              <span className={styles.clientName}>{client.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
