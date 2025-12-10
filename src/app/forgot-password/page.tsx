'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiAlertCircle, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import styles from './page.module.css';

const ADMIN_EMAIL = 'info@tdlogistics.co';

export default function ForgotPasswordPage() {
  const { language, t } = useLanguage();
  const [step, setStep] = useState<'email' | 'verify' | 'newPassword' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const BackIcon = language === 'ar' ? FiArrowRight : FiArrowLeft;

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError(t('forgotPassword.emailRequired'));
      return;
    }

    // Check if email matches admin email
    if (email !== ADMIN_EMAIL) {
      setError(t('forgotPassword.emailNotFound'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('forgotPassword.error'));
      }

      setStep('verify');
      setSuccess(t('forgotPassword.otpSent'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('forgotPassword.error'));
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError(t('forgotPassword.otpRequired'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('forgotPassword.error'));
      }

      setStep('newPassword');
      setSuccess(t('forgotPassword.otpVerified'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('forgotPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError(t('forgotPassword.passwordMinLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('forgotPassword.passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'changePassword', email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('forgotPassword.error'));
      }

      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('forgotPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image src="/logo.png" alt="TD Logistics" width={150} height={75} className={styles.logoImage} />
          </Link>

          <h1>{t('forgotPassword.title')}</h1>
          <p className={styles.subtitle}>{t('forgotPassword.subtitle')}</p>

          {success && step !== 'success' && (
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

          {/* Step 1: Enter Email */}
          {step === 'email' && (
            <form onSubmit={handleRequestOTP} className={styles.form}>
              <p className={styles.stepDesc}>{t('forgotPassword.enterEmail')}</p>
              <div className={styles.inputGroup}>
                <label>{t('forgotPassword.email')}</label>
                <div className={styles.inputWrapper}>
                  <FiMail className={styles.inputIcon} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className={styles.input}
                    dir="ltr"
                    autoComplete="email"
                  />
                </div>
              </div>
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? t('forgotPassword.sending') : t('forgotPassword.sendOtp')}
              </button>
              <Link href="/login" className={styles.backLink}>
                <BackIcon />
                {t('forgotPassword.backToLogin')}
              </Link>
            </form>
          )}


          {/* Step 2: Verify OTP */}
          {step === 'verify' && (
            <form onSubmit={handleVerifyOTP} className={styles.form}>
              <p className={styles.stepDesc}>{t('forgotPassword.enterOtp')}</p>
              <div className={styles.inputGroup}>
                <label>{t('forgotPassword.otpCode')}</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={styles.otpInput}
                  placeholder="123456"
                  maxLength={6}
                  dir="ltr"
                />
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? t('forgotPassword.verifying') : t('forgotPassword.verify')}
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => { setStep('email'); setError(''); setSuccess(''); }}
                >
                  {t('common.back')}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 'newPassword' && (
            <form onSubmit={handleChangePassword} className={styles.form}>
              <p className={styles.stepDesc}>{t('forgotPassword.enterNewPassword')}</p>
              <div className={styles.inputGroup}>
                <label>{t('forgotPassword.newPassword')}</label>
                <div className={styles.inputWrapper}>
                  <FiLock className={styles.inputIcon} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={styles.input}
                    minLength={6}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>{t('forgotPassword.confirmPassword')}</label>
                <div className={styles.inputWrapper}>
                  <FiLock className={styles.inputIcon} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={styles.input}
                    minLength={6}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? t('forgotPassword.changing') : t('forgotPassword.changePassword')}
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => { setStep('email'); setError(''); setSuccess(''); setOtp(''); }}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className={styles.successContainer}>
              <div className={styles.successIcon}>
                <FiCheck />
              </div>
              <h2>{t('forgotPassword.successTitle')}</h2>
              <p>{t('forgotPassword.successDesc')}</p>
              <Link href="/login" className={styles.submitButton}>
                {t('forgotPassword.goToLogin')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
