'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CustomVideoPlayer from '../../components/CustomVideoPlayer';
import SubscriptionPrompt from '../../components/SubscriptionPrompt';
import styles from './page.module.css';

interface Lesson {
  id: number;
  documentId: string;
  title: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

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

interface CourseResponse {
  data: Course[];
}

export default function CoursePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user, token, isLoading: authLoading } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, any>>({});
  // Fetch course data and progress when auth is ready
  useEffect(() => {
    const fetchCourse = async () => {
      // Poczekaj aż auth się załaduje
      if (authLoading) return;

      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };

        // Dodaj token do nagłówków tylko jeśli jest dostępny
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('Fetching course with slug:', slug);
        const response = await fetch(
          `http://localhost:1337/api/courses/public/${slug}`,
          { headers }
        );
        
        if (!response.ok) {
          throw new Error(`Błąd podczas pobierania kursu: ${response.status}`);
        }
        
        const data: CourseResponse = await response.json();
        
        if (data.data.length === 0) {
          throw new Error('Kurs nie został znaleziony');
        }
        
        const courseData = data.data[0];
        console.log('Fetched Course Data:', courseData);
        setCourse(courseData);
        
        // Ustaw pierwszą lekcję jako aktualną
        if (courseData.lessons && courseData.lessons.length > 0) {
          setCurrentLesson(courseData.lessons[0]);
        }

        // Fetch user progress for this course only if user is logged in
        if (token) {
          await fetchCourseProgress(courseData.documentId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCourseProgress = async (courseId: string) => {
      try {
        const response = await fetch(`http://localhost:1337/api/user-progress/course/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const progressData = await response.json();
          const progressMap: Record<string, any> = {};
          
          if (progressData.data && progressData.data.lessons) {
            progressData.data.lessons.forEach((lesson: any) => {
              progressMap[lesson.lesson.documentId] = lesson;
            });
          }
          setLessonProgress(progressMap);
        }
      } catch (error) {
        console.error('Error fetching course progress:', error);
      }
    };

    if (slug) {
      fetchCourse();
    }
  }, [slug, token, authLoading]);

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };


  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Ładowanie kursu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h1>Błąd</h1>
        <p>{error}</p>
        <Link href="/kursy" className={styles.backButton}>
          Powrót do kursów
        </Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={styles.error}>
        <h1>Kurs nie znaleziony</h1>
        <Link href="/kursy" className={styles.backButton}>
          Powrót do kursów
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.coursePage}>
      <div className={styles.courseHeader}>
        <div className={styles.headerContent}>
          <Link href="/kursy" className={styles.backLink}>
            ← Powrót do kursów
          </Link>
          <h1 className={styles.courseTitle}>{course.title}</h1>
          <p className={styles.courseDescription}>{course.description}</p>
        </div>
      </div>

      <div className={styles.courseContent}>
        <div className={styles.videoSection}>
          {currentLesson ? (
            <div className={styles.videoContainer}>
              <CustomVideoPlayer 
                lessonId={currentLesson.documentId}
                title={currentLesson.title}
              />
            </div>
          ) : (
            <div className={styles.noLesson}>
              <p>Wybierz lekcję z listy aby rozpocząć</p>
            </div>
          )}
        </div>

        <div className={styles.lessonsList}>
          <h3 className={styles.lessonsTitle}>
            Lekcje ({course.lessons?.length || 0})
          </h3>
          
          {course.lessons && course.lessons.length > 0 ? (
            <div className={styles.lessons}>
              {course.lessons.map((lesson, index) => {
                const progress = lessonProgress[lesson.documentId];
                
                const isCompleted = progress?.completed || false;
                const progressPercentage = progress?.totalDuration > 0 
                  ? Math.round((progress.watchedDuration / progress.totalDuration) * 100)
                  : 0;
                
                return (
                  <div
                    key={lesson.id}
                    className={`${styles.lessonItem} ${
                      currentLesson?.id === lesson.id ? styles.active : ''
                    } ${isCompleted ? styles.completed : ''}`}
                    onClick={() => handleLessonSelect(lesson)}
                  >
                    <div className={styles.lessonNumber}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className={styles.lessonInfo}>
                      <h4 className={styles.lessonItemTitle}>{lesson.title}</h4>
                      <span className={styles.lessonStatus}>
                        {lesson.videoUrl ? '🎥 Video dostępne' : '📄 Bez video'}
                      </span>
                      {progress && (
                        <div className={styles.lessonProgress}>
                          <div className={styles.progressBar}>
                            <div 
                              className={styles.progressFill}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <span className={styles.progressText}>
                            {isCompleted ? 'Ukończone' : `${progressPercentage}%`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Dodaj banner subskrypcji na końcu listy lekcji - tylko dla użytkowników bez subskrypcji */}
              {user && user.isSubscribe !== true && (
                <div className={styles.subscriptionBanner}>
                  <SubscriptionPrompt
                    variant="banner"
                    courseTitle={course.title}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className={styles.noLessons}>
              <p>Brak dostępnych lekcji</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}