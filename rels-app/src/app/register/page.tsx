'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import styles from './page.module.css';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne');
      setIsLoading(false);
      return;
    }

    const username = email;

    try {
      const success = await register({
        username,
        email,
        password,
      });

      if (success) {
        router.push('/dashboard');
      } else {
        setError('Błąd rejestracji. Sprawdź dane i spróbuj ponownie.');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas rejestracji.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <div className={styles.registerHeader}>
            <h1 className={styles.registerTitle}>Zarejestruj się</h1>
            <p className={styles.registerSubtitle}>
              Utwórz nowe konto aby uzyskać dostęp do panelu RELS
            </p>
          </div>
          
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          
          <form className={styles.registerForm} onSubmit={handleSubmit}>
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
            
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.inputLabel}>
                Potwierdź hasło
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={styles.input}
                placeholder="potwierdź swoje hasło"
                required
              />
            </div>
            
            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} required />
                <span className={styles.checkboxText}>
                  Akceptuję <a href="/terms" className={styles.link}>Warunki korzystania z usługi</a> i <a href="/privacy" className={styles.link}>Politykę prywatności</a>
                </span>
              </label>
            </div>
            
            <button type="submit" className={styles.registerButton} disabled={isLoading}>
              {isLoading ? 'Rejestruję...' : 'Zarejestruj się'}
            </button>
          </form>
          
          <div className={styles.registerFooter}>
            <p className={styles.loginText}>
              Masz już konto?{' '}
              <a href="/login" className={styles.loginLink}>
                Zaloguj się
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}