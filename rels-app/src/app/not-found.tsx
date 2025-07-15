import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Strona nie została znaleziona</h2>
          <p className={styles.description}>
            Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
          </p>
          <div className={styles.actions}>
            <Link href="/" className={styles.homeButton}>
              Powrót do strony głównej
            </Link>
            <Link href="/kursy" className={styles.coursesButton}>
              Zobacz nasze kursy
            </Link>
          </div>
        </div>
        <div className={styles.illustration}>
          <div className={styles.errorIcon}>🏠</div>
          <p className={styles.errorText}>Nie ma takiej strony w naszym systemie</p>
        </div>
      </div>
    </div>
  );
}