'use client';

import { useAuth } from '../contexts/AuthContext';
import styles from './page.module.css';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Dashboard</h1>
        <p className={styles.contentSubtitle}>
          Witaj z powrotem, {user?.username}! Oto przegląd Twojej aktywności
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Moje Kursy</h3>
            <p className={styles.statNumber}>3</p>
            <p className={styles.statDesc}>Aktywne kursy</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Certyfikaty</h3>
            <p className={styles.statNumber}>2</p>
            <p className={styles.statDesc}>Uzyskane certyfikaty</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏱️</div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Czas nauki</h3>
            <p className={styles.statNumber}>24h</p>
            <p className={styles.statDesc}>W tym miesiącu</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Postęp</h3>
            <p className={styles.statNumber}>78%</p>
            <p className={styles.statDesc}>Ukończone lekcje</p>
          </div>
        </div>
      </div>

      <div className={styles.sectionsGrid}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>📚</div>
            <h3 className={styles.sectionTitle}>Kontynuuj naukę</h3>
          </div>
          <p className={styles.sectionDesc}>
            Wróć do swoich kursów i kontynuuj tam, gdzie skończyłeś
          </p>
          <button className={styles.sectionButton}>
            Przejdź do kursów
          </button>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>🏆</div>
            <h3 className={styles.sectionTitle}>Twoje osiągnięcia</h3>
          </div>
          <p className={styles.sectionDesc}>
            Sprawdź swoje certyfikaty i odznaki
          </p>
          <button className={styles.sectionButton}>
            Zobacz certyfikaty
          </button>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>📊</div>
            <h3 className={styles.sectionTitle}>Statystyki</h3>
          </div>
          <p className={styles.sectionDesc}>
            Analizuj swój postęp i wydajność nauki
          </p>
          <button className={styles.sectionButton}>
            Pokaż statystyki
          </button>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>⚙️</div>
            <h3 className={styles.sectionTitle}>Ustawienia</h3>
          </div>
          <p className={styles.sectionDesc}>
            Zarządzaj swoim profilem i preferencjami
          </p>
          <button className={styles.sectionButton}>
            Otwórz ustawienia
          </button>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h2 className={styles.activityTitle}>Ostatnia aktywność</h2>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>✅</div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>
                <strong>Ukończono lekcję:</strong> "Podstawy umów kupna-sprzedaży"
              </p>
              <p className={styles.activityTime}>2 godziny temu</p>
            </div>
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>🏆</div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>
                <strong>Zdobyto certyfikat:</strong> "Prawo nieruchomości - poziom podstawowy"
              </p>
              <p className={styles.activityTime}>1 dzień temu</p>
            </div>
          </div>

          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>📚</div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>
                <strong>Rozpoczęto kurs:</strong> "Zaawansowane transakcje nieruchomościowe"
              </p>
              <p className={styles.activityTime}>3 dni temu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}