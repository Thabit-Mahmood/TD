'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiArrowLeft, FiLock, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from '../page.module.css';

const ADMIN_EMAIL = 'info@tdlogistics.co';

export default function SettingsPage() {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<'request' | 'verify' | 'newPassword'>('request');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', email: ADMIN_EMAIL }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('dashboard.settings.error'));
      }

      setStep('verify');
      setSuccess(t('dashboard.settings.otpSent'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dashboard.settings.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email: ADMIN_EMAIL, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('dashboard.settings.error'));
      }

      setStep('newPassword');
      setSuccess(t('dashboard.settings.otpVerified'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dashboard.settings.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError(t('dashboard.settings.passwordMinLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('dashboard.settings.passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'changePassword', email: ADMIN_EMAIL, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('dashboard.settings.error'));
      }

      setSuccess(t('dashboard.settings.passwordChanged'));
      setStep('request');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dashboard.settings.error'));
    } finally {
      setLoading(false);
    }
  };

  const BackIcon = language === 'ar' ? FiArrowRight : FiArrowLeft;

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <Link href="/dashboard" className={styles.backLink}>
              <BackIcon />
              {t('dashboard.settings.backToDashboard')}
            </Link>
            <h1>{t('dashboard.settings.title')}</h1>
          </div>
        </div>

        <div className={styles.settingsGrid}>
          <div className={styles.settingsCard}>
            <div className={styles.settingsCardHeader}>
              <FiLock className={styles.settingsIcon} />
              <h2>{t('dashboard.settings.changePassword')}</h2>
            </div>

            {success && (
              <div className={styles.successAlert}>
                <FiCheck />
                {success}
              </div>
            )}

            {error && (
              <div className={styles.errorAlert}>
                <FiAlertCircle />
                {error}
              </div>
            )}

            {step === 'request' && (
              <form onSubmit={handleRequestOTP} className={styles.settingsForm}>
                <p className={styles.settingsDesc}>
                  {t('dashboard.settings.requestOtpDesc')}
                </p>
                <p className={styles.adminEmail}>{ADMIN_EMAIL}</p>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? t('dashboard.settings.sending') : t('dashboard.settings.sendOtp')}
                </button>
              </form>
            )}

            {step === 'verify' && (
              <form onSubmit={handleVerifyOTP} className={styles.settingsForm}>
                <p className={styles.settingsDesc}>
                  {t('dashboard.settings.enterOtp')}
                </p>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('dashboard.settings.otpCode')}</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={styles.input}
                    placeholder="123456"
                    maxLength={6}
                    required
                    dir="ltr"
                    style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.5rem' }}
                  />
                </div>
                <div className={styles.formActions}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? t('dashboard.settings.verifying') : t('dashboard.settings.verify')}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => { setStep('request'); setError(''); setSuccess(''); }}
                  >
                    {t('common.back')}
                  </button>
                </div>
              </form>
            )}

            {step === 'newPassword' && (
              <form onSubmit={handleChangePassword} className={styles.settingsForm}>
                <p className={styles.settingsDesc}>
                  {t('dashboard.settings.enterNewPassword')}
                </p>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('dashboard.settings.newPassword')}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.input}
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('dashboard.settings.confirmPassword')}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>
                <div className={styles.formActions}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? t('dashboard.settings.changing') : t('dashboard.settings.changePasswordBtn')}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => { setStep('request'); setError(''); setSuccess(''); }}
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
