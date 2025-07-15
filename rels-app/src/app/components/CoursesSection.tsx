'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CoursesSection.module.css';

interface Course {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  lessons?: any[];
  coursePhoto?: {
    id: number;
    url: string;
    alternativeText?: string;
  }[];
}

interface CoursesResponse {
  data: Course[];
  meta: {
    pagination: {
      total: number;
    };
  };
}

const CoursesSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/courses/public`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        
        const data: CoursesResponse = await response.json();
        // Pokaż tylko pierwsze 3 kursy
        setCourses(data.data.slice(0, 3));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getCourseIcon = (index: number) => {
    const icons = ['🏠', '🏗️', '⚖️', '💼', '📚', '🏛️'];
    return icons[index % icons.length];
  };

  const getDifficultyLevel = (index: number) => {
    const levels = ['Początkujący', 'Średniozaawansowany', 'Zaawansowany'];
    return levels[index % levels.length];
  };

  if (isLoading) {
    return (
      <section className={styles.coursesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Popularne Kursy</h2>
          </div>
          <div className={styles.coursesGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.courseCard}>
                <div className={styles.courseImage}>
                  <div className={styles.imagePlaceholder}>
                    <div className={styles.loadingSpinner}></div>
                  </div>
                </div>
                <div className={styles.courseContent}>
                  <div className={styles.loadingSkeleton}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.coursesSection}>
        <div className={styles.container}>
          <div className={styles.errorMessage}>
            <p>Nie udało się załadować kursów: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.coursesSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Popularne Kursy</h2>
          <Link href="/kursy" className={styles.viewAllLink}>
            Zobacz Wszystkie Kursy
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className={styles.coursesGrid}>
          {courses.map((course, index) => (
            <Link key={course.id} href={`/kursy/${course.slug}`} className={styles.courseCard}>
              <div className={styles.courseImage}>
                {course.coursePhoto && course.coursePhoto.length > 0 ? (
                  <img 
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${course.coursePhoto[0].url}`}
                    alt={course.coursePhoto[0].alternativeText || course.title}
                    className={styles.courseImagePhoto}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <span className={styles.courseEmoji}>{getCourseIcon(index)}</span>
                  </div>
                )}
              </div>
              <div className={styles.courseContent}>
                <div className={styles.courseMeta}>
                  <span className={styles.courseCategory}>
                    {getDifficultyLevel(index)}
                  </span>
                  <div className={styles.courseRating}>
                    <span className={styles.ratingStars}>
                      <i className="fas fa-star"></i>
                    </span>
                    <span>4.{5 + index}</span>
                  </div>
                </div>
                
                <h3 className={styles.courseTitle}>{course.title}</h3>
                
                <p className={styles.courseDescription}>
                  {course.description}
                </p>
                
                <div className={styles.courseFooter}>
                  <div className={styles.courseSubscription}>
                    <i className="fas fa-lock"></i>
                    <span className={styles.subscriptionLabel}>PREMIUM</span>
                  </div>
                  <span className={styles.courseDuration}>
                    <i className="far fa-clock"></i>
                    {course.lessons?.length || 0} lekcji
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;