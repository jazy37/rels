'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import styles from './page.module.css';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const success = await login(email, password);

      if (success) {
        router.push('/dashboard');
      } else {
        setError('Nieprawidłowy email lub hasło');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas logowania');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>Zaloguj się</h1>
            <p className={styles.loginSubtitle}>
              Wprowadź swoje dane aby uzyskać dostęp do panelu RELS
            </p>
          </div>
          
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>
                Adres email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
                placeholder="wprowadź swój email"
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>
                Hasło
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={styles.input}
                placeholder="wprowadź swoje hasło"
                required
              />
            </div>
            
            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.checkboxText}>Zapamiętaj mnie</span>
              </label>
              <a href="/forgot-password" className={styles.forgotLink}>
                Zapomniałeś hasła?
              </a>
            </div>
            
            <button type="submit" className={styles.loginButton} disabled={isLoading}>
              {isLoading ? 'Loguję...' : 'Zaloguj się'}
            </button>
          </form>
          
          <div className={styles.loginFooter}>
            <p className={styles.signupText}>
              Nie masz konta?{' '}
              <a href="/register" className={styles.signupLink}>
                Zarejestruj się
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}