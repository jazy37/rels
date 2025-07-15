import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LessonAccess {
  lessonId: string;
  hasAccess: boolean;
  lesson: {
    title: string;
    videoUrl: string;
    course: {
      title: string;
      slug: string;
    };
  };
  subscriptionRequired: boolean;
}

export const useUserAccess = (lessonId: string) => {
  const [accessData, setAccessData] = useState<LessonAccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token || !lessonId) {
      setLoading(false);
      return;
    }

    const checkAccess = async () => {
      try {
        // Pobierz aktualne dane użytkownika z serwera
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to get user data');
        }

        const userData = await userResponse.json();
        const hasAccess = userData.isSubscribe || false;
        
        console.log('📊 useUserAccess Debug:');
        console.log('- UserData from API:', userData);
        console.log('- isSubscribe:', userData.isSubscribe);
        console.log('- hasAccess:', hasAccess);

        // Pobierz podstawowe informacje o lekcji
        const lessonResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/lessons/${lessonId}?populate=course`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!lessonResponse.ok) {
          throw new Error('Failed to get lesson data');
        }

        const lessonData = await lessonResponse.json();
        console.log('Full Lesson Data:', lessonData);

        const finalAccessData = {
          lessonId,
          hasAccess,
          lesson: {
            title: lessonData.data.course.title,
            videoUrl: lessonData.data.videoUrl || '',
            course: {
              title: lessonData.data.course?.data?.attributes?.title || 'Unknown Course',
              slug: lessonData.data.course?.data?.attributes?.slug || ''
            }
          },
          subscriptionRequired: !hasAccess
        };
        
        console.log('🎯 Final accessData being set:', finalAccessData);
        setAccessData(finalAccessData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [token, lessonId]); // Usunęliśmy 'user' żeby uniknąć pętli

  return { accessData, loading, error };
};