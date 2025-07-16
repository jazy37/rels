'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function DashboardCourses() {
  // Mock data - w rzeczywistości pobierałbyś z API
  const courses = [
    {
      id: 1,
      title: 'Podstawy prawa nieruchomości',
      description: 'Wprowadzenie do podstawowych aspektów prawnych w nieruchomościach',
      progress: 85,
      lessons: 12,
      completedLessons: 10,
      lastAccessed: '2 dni temu',
      status: 'in_progress'
    },
    {
      id: 2,
      title: 'Umowy kupna-sprzedaży',
      description: 'Szczegółowe omówienie umów kupna-sprzedaży nieruchomości',
      progress: 45,
      lessons: 8,
      completedLessons: 4,
      lastAccessed: '1 tydzień temu',
      status: 'in_progress'
    },
    {
      id: 3,
      title: 'Prawo podatkowe w nieruchomościach',
      description: 'Kompleksowe szkolenie z zakresu podatków w transakcjach nieruchomościowych',
      progress: 100,
      lessons: 15,
      completedLessons: 15,
      lastAccessed: '1 miesiąc temu',
      status: 'completed'
    }
  ];

  return (
    <div className={styles.coursesContent}>
      <div className={styles.contentHeader}>
        <h1 className={styles.contentTitle}>Moje Kursy</h1>
        <p className={styles.contentSubtitle}>
          Zarządzaj swoimi kursami i śledź postępy w nauce
        </p>
      </div>

      <div className={styles.coursesGrid}>
        {courses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <div className={styles.courseHeader}>
              <div className={styles.courseStatus}>
                <span className={`${styles.statusBadge} ${styles[course.status]}`}>
                  {course.status === 'completed' ? '✅ Ukończony' : '🎯 W trakcie'}
                </span>
              </div>
              <div className={styles.courseProgress}>
                <span className={styles.progressText}>{course.progress}%</span>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.courseContent}>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <p className={styles.courseDescription}>{course.description}</p>
              
              <div className={styles.courseStats}>
                <div className={styles.courseStat}>
                  <span className={styles.statIcon}>📚</span>
                  <span>{course.completedLessons}/{course.lessons} lekcji</span>
                </div>
                <div className={styles.courseStat}>
                  <span className={styles.statIcon}>🕒</span>
                  <span>{course.lastAccessed}</span>
                </div>
              </div>
            </div>

            <div className={styles.courseActions}>
              <Link href={`/kursy/course-${course.id}`} className={styles.primaryButton}>
                {course.status === 'completed' ? 'Przejrzyj' : 'Kontynuuj'}
              </Link>
              <button className={styles.secondaryButton}>
                {course.status === 'completed' ? 'Certyfikat' : 'Szczegóły'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.exploreSection}>
        <h2 className={styles.exploreTitle}>Odkryj nowe kursy</h2>
        <p className={styles.exploreDescription}>
          Rozszerz swoją wiedzę o nowe obszary prawa nieruchomości
        </p>
        <Link href="/kursy" className={styles.exploreButton}>
          Przeglądaj wszystkie kursy
        </Link>
      </div>
    </div>
  );
}