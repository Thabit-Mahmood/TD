'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Admin route - redirects to dashboard
 * This page exists to handle /admin URLs and redirect them to /dashboard
 */
export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '50vh',
      fontSize: '1rem',
      color: '#666'
    }}>
      Redirecting to dashboard...
    </div>
  );
}
