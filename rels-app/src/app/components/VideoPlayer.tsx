'use client';
import React from 'react';
import { useUserAccess } from '../hooks/useUserAccess';
import { useAuth } from '../contexts/AuthContext';

interface VideoPlayerProps {
  lessonId: string;
  videoUrl?: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ lessonId, videoUrl, title }) => {
  const { user } = useAuth();
  const { accessData, loading, error } = useUserAccess(lessonId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-gray-500">Sprawdzanie dostępu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-red-500">Błąd: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-gray-700 text-lg mb-4">Zaloguj się, aby oglądać lekcje</div>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Zaloguj się
        </button>
      </div>
    );
  }

  if (!accessData?.hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-yellow-50 rounded-lg border-2 border-yellow-200">
        <div className="text-yellow-800 text-lg mb-2">🔒 Wymaga subskrypcji</div>
        <div className="text-gray-700 text-center mb-4">
          Ta lekcja jest dostępna tylko dla użytkowników z aktywną subskrypcją
        </div>
        <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
          Kup subskrypcję
        </button>
      </div>
    );
  }

  // User has access - show video player
  return (
    <div className="w-full">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <div className="relative bg-black rounded-lg overflow-hidden">
        {accessData.lesson.videoUrl ? (
          <video
            className="w-full h-auto"
            controls
            preload="metadata"
          >
            <source src={accessData.lesson.videoUrl} type="video/mp4" />
            Twoja przeglądarka nie obsługuje odtwarzacza wideo.
          </video>
        ) : (
          <div className="flex items-center justify-center h-64 text-white">
            Brak dostępnego wideo
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;