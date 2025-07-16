'use client';

import styles from './page.module.css';

export default function Certificates() {
  return (
    <div className={styles.certificatesContent}>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Certyfikaty</h1>
        <p className={styles.contentSubtitle}>
          Przeglądaj i pobieraj swoje zdobyte certyfikaty
        </p>
      </div>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <span style={{ fontSize: '48px' }}>🏆</span>
        </div>
        <h2 className={styles.emptyTitle}>Brak certyfikatów</h2>
        <p className={styles.emptyDescription}>
          Nie zdobyłeś jeszcze żadnych certyfikatów. Zanurz się w kursach i pokaż swoje osiągnięcia
        </p>
        <button className={styles.browseButton}>
          Przeglądaj kursy
        </button>
      </div>
    </div>
  );
}