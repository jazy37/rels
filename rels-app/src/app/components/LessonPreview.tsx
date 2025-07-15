'use client';
import React from 'react';
import { useUserAccess } from '../hooks/useUserAccess';
import VideoPlayer from './VideoPlayer';

interface LessonPreviewProps {
  lessonId: string;
  title: string;
  description?: string;
  videoUrl?: string;
}

const LessonPreview: React.FC<LessonPreviewProps> = ({ 
  lessonId, 
  title, 
  description,
  videoUrl 
}) => {
  const { accessData, loading } = useUserAccess(lessonId);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="lesson-preview">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      
      {description && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Opis lekcji:</h3>
          <p className="text-gray-700">{description}</p>
        </div>
      )}

      <VideoPlayer 
        lessonId={lessonId}
        videoUrl={videoUrl}
        title={title}
      />

      {!accessData?.hasAccess && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">🎓 Chcesz uzyskać pełny dostęp?</h3>
          <p className="text-blue-700 mb-4">
            Kup subskrypcję, aby odblokować wszystkie lekcje w tym kursie oraz uzyskać dostęp do:
          </p>
          <ul className="list-disc list-inside text-blue-700 mb-4">
            <li>Wszystkich filmów wideo</li>
            <li>Materiałów dodatkowych</li>
            <li>Certyfikatów ukończenia</li>
            <li>Wsparcia od instruktorów</li>
          </ul>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Kup subskrypcję
            </button>
            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Dowiedz się więcej
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPreview;