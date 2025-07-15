'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import styles from './page.module.css';
import { log } from 'console';

interface Course {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  lessons?: Lesson[];
}

interface CourseProgress {
  course: {
    id: number;
    title: string;
    slug: string;
  };
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lastWatchedLesson?: {
    id: number;
    title: string;
    documentId: string;
    lastWatchedAt: string;
  };
}

interface Lesson {
  id: number;
  documentId: string;
  title: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface CoursesResponse {
  data: Course[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export default function Kursy() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const { token, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      // Poczekaj aż auth się załaduje
      if (authLoading) return;
      
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        // Dodaj token do nagłówków jeśli jest dostępny
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('http://localhost:1337/api/courses/public', {
          headers,
        });
        
        if (!response.ok) {
          throw new Error(`Błąd podczas pobierania kursów: ${response.status}`);
        }
        
        const data: CoursesResponse = await response.json();
        setCourses(data.data);
        console.log('Pobrane kursy:', data.data);
        
        // Fetch progress for each course if user is logged in
        if (token && data.data.length > 0) {
          await fetchCoursesProgress(data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCoursesProgress = async (courses: Course[]) => {
      const progressPromises = courses.map(async (course) => {
        try {
          const response = await fetch(`http://localhost:1337/api/user-progress/course/${course.documentId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const progressData = await response.json();
            console.log(`Postęp dla kursu ${course.documentId}:`, progressData);
            return { courseId: course.documentId, progress: progressData.data };
          }
        } catch (error) {
          console.error(`Error fetching progress for course ${course.documentId}:`, error);
        }
        return null;
      });

      const progressResults = await Promise.all(progressPromises);
      const progressMap: Record<string, CourseProgress> = {};
      
      progressResults.forEach(result => {
        if (result) {
          progressMap[result.courseId] = result.progress;
        }
      });
      
      setCourseProgress(progressMap);
    };

    fetchCourses();
  }, [token, authLoading]);

  const getCourseIcon = (index: number) => {
    const icons = ['🏠', '🏗️', '⚖️', '💼', '📚', '🏛️', '📋', '🔍'];
    return icons[index % icons.length];
  };

  const handleDownloadCertificate = async (courseId: string, courseName: string) => {
    try {
      setIsDownloading(courseId);
      
      const response = await fetch(`http://localhost:1337/api/certificate/generate/${courseId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Błąd podczas generowania certyfikatu');
      }

      // Pobranie pliku PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `certyfikat-${courseName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setNotification('Certyfikat został pobrany pomyślnie!');
      
      // Ukryj powiadomienie po 3 sekundach
      setTimeout(() => setNotification(null), 3000);
      
    } catch (error) {
      console.error('Error downloading certificate:', error);
      setNotification(error instanceof Error ? error.message : 'Błąd podczas pobierania certyfikatu');
      
      // Ukryj powiadomienie po 5 sekundach dla błędów
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIsDownloading(null);
    }
  };
  return (
    <div className={styles.kursyPage}>
      {notification && (
        <div className={`${styles.notification} ${notification.includes('Błąd') ? styles.error : styles.success}`}>
          {notification}
        </div>
      )}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            Kursy prawnicze RELS
          </h1>
          <p className={styles.heroDescription}>
            Profesjonalne szkolenia z zakresu prawa nieruchomości, 
            prowadzone przez doświadczonych prawników i ekspertów branżowych.
          </p>
        </div>
      </section>

      <section className={styles.courses}>
        <div className={styles.coursesContainer}>
          <h2 className={styles.coursesTitle}>Dostępne kursy</h2>
          
          {isLoading && (
            <div className={styles.loading}>
              <p>Ładowanie kursów...</p>
            </div>
          )}
          
          {error && (
            <div className={styles.error}>
              <p>Błąd: {error}</p>
            </div>
          )}
          
          {!isLoading && !error && courses.length === 0 && (
            <div className={styles.noCourses}>
              <p>Brak dostępnych kursów.</p>
            </div>
          )}
          
          {!isLoading && !error && courses.length > 0 && (
            <div className={styles.coursesGrid}>
              {courses.map((course, index) => {
                const progress = courseProgress[course.documentId];
                return (
                  <div key={course.id} className={styles.courseCard}>
                    <div className={styles.courseImage}>
                      <div className={styles.courseIcon}>
                        {getCourseIcon(index)}
                      </div>
                    </div>
                    <div className={styles.courseContent}>
                      <h3>{course.title}</h3>
                      <p className={styles.courseDescription}>
                        {course.description}
                      </p>
                      <div className={styles.courseDetails}>
                        <span className={styles.courseDuration}>
                          📅 {course.lessons?.length || 0} lekcji
                        </span>
                        <span className={styles.courseLevel}>📊 Różne poziomy</span>
                      </div>
                      
                      {progress && (
                        <div className={styles.progressSection}>
                          <div className={styles.progressBar}>
                            <div 
                              className={styles.progressFill}
                              style={{ width: `${progress.progressPercentage}%` }}
                            />
                          </div>
                          <div className={styles.progressText}>
                            {progress.completedLessons} / {progress.totalLessons} lekcji ukończonych
                          </div>
                          {/* {progress.lastWatchedLesson && (
                            <div className={styles.lastWatched}>
                              Ostatnio: {progress.lastWatchedLesson.title}
                            </div>
                          )} */}
                        </div>
                      )}
                      
                      {progress && progress.completedLessons === progress.totalLessons && progress.totalLessons > 0 ? (
                        <div className={styles.completedActions}>
                          <button 
                            className={styles.certificateButton}
                            onClick={() => handleDownloadCertificate(course.documentId, course.title)}
                            disabled={isDownloading === course.documentId}
                          >
                            {isDownloading === course.documentId ? (
                              '⏳ Generowanie...'
                            ) : (
                              '📜 Pobierz certyfikat'
                            )}
                          </button>
                          <Link href={`/kursy/${course.slug}`} className={styles.reviewButton}>
                            🔄 Obejrzyj ponownie
                          </Link>
                        </div>
                      ) : (
                        <Link href={`/kursy/${course.slug}`} className={styles.courseButton}>
                          {progress && progress.completedLessons > 0 ? 'Kontynuuj' : 'Start'}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className={styles.benefits}>
        <div className={styles.benefitsContainer}>
          <h2 className={styles.benefitsTitle}>Dlaczego warto wybrać nasze kursy?</h2>
          
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>👨‍🏫</div>
              <h3>Eksperci z praktyką</h3>
              <p>Kursy prowadzone przez prawników z wieloletnim doświadczeniem</p>
            </div>
            
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>📜</div>
              <h3>Certyfikaty</h3>
              <p>Otrzymasz oficjalny certyfikat ukończenia kursu</p>
            </div>
            
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>💻</div>
              <h3>Elastyczna forma</h3>
              <p>Kursy online i stacjonarne dostosowane do Twoich potrzeb</p>
            </div>
            
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>📚</div>
              <h3>Materiały</h3>
              <p>Kompletne materiały szkoleniowe i dostęp do biblioteki</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}