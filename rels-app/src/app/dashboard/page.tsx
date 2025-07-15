'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import styles from './page.module.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className={styles.dashboardPage}>
        <div className={styles.dashboardContainer}>
          <header className={styles.dashboardHeader}>
            <div className={styles.headerContent}>
              <h1 className={styles.dashboardTitle}>
                Panel administracyjny RELS
              </h1>
              <p className={styles.welcomeText}>
                Witaj, {user?.username}!
              </p>
            </div>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Wyloguj się
            </button>
          </header>

          <div className={styles.dashboardContent}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📊</div>
                <h3>Aktywne sprawy</h3>
                <p className={styles.statNumber}>23</p>
                <p className={styles.statDesc}>W trakcie realizacji</p>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📋</div>
                <h3>Nowe wnioski</h3>
                <p className={styles.statNumber}>8</p>
                <p className={styles.statDesc}>Oczekują na przegląd</p>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <h3>Zakończone</h3>
                <p className={styles.statNumber}>156</p>
                <p className={styles.statDesc}>W tym miesiącu</p>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <h3>Klienci</h3>
                <p className={styles.statNumber}>342</p>
                <p className={styles.statDesc}>Aktywni użytkownicy</p>
              </div>
            </div>

            <div className={styles.sectionsGrid}>
              <div className={styles.sectionCard}>
                <h3>🏠 Zarządzaj nieruchomościami</h3>
                <p>Przeglądaj i edytuj informacje o nieruchomościach w systemie</p>
                <button className={styles.sectionButton}>Przejdź do zarządzania</button>
              </div>
              
              <div className={styles.sectionCard}>
                <h3>📄 Dokumenty prawne</h3>
                <p>Dostęp do wszystkich dokumentów prawnych i umów</p>
                <button className={styles.sectionButton}>Przeglądaj dokumenty</button>
              </div>
              
              <div className={styles.sectionCard}>
                <h3>💼 Sprawy klientów</h3>
                <p>Zarządzaj sprawami klientów i statusem ich realizacji</p>
                <button className={styles.sectionButton}>Zarządzaj sprawami</button>
              </div>
              
              <div className={styles.sectionCard}>
                <h3>📈 Raporty i analizy</h3>
                <p>Generuj raporty i analizuj dane biznesowe</p>
                <button className={styles.sectionButton}>Generuj raporty</button>
              </div>
            </div>

            <div className={styles.recentActivity}>
              <h3>Ostatnia aktywność</h3>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>📝</div>
                  <div className={styles.activityContent}>
                    <p><strong>Nowa umowa kupna-sprzedaży</strong></p>
                    <p className={styles.activityTime}>2 godziny temu</p>
                  </div>
                </div>
                
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>✅</div>
                  <div className={styles.activityContent}>
                    <p><strong>Zakończono proces due diligence</strong></p>
                    <p className={styles.activityTime}>5 godzin temu</p>
                  </div>
                </div>
                
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>👤</div>
                  <div className={styles.activityContent}>
                    <p><strong>Nowy klient zarejestrowany</strong></p>
                    <p className={styles.activityTime}>1 dzień temu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}