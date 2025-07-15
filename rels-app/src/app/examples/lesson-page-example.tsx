// Przykład użycia na stronie lekcji
import React from 'react';
import LessonPreview from '../components/LessonPreview';
import VideoPlayer from '../components/VideoPlayer';
import SubscriptionPrompt from '../components/SubscriptionPrompt';

// Przykład 1: Strona pojedynczej lekcji
const LessonPage = ({ lessonId, title, description, videoUrl }: {
  lessonId: string;
  title: string;
  description: string;
  videoUrl: string;
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <LessonPreview
        lessonId={lessonId}
        title={title}
        description={description}
        videoUrl={videoUrl}
      />
    </div>
  );
};

// Przykład 2: Tylko player wideo
const VideoOnlyPage = ({ lessonId, videoUrl }: {
  lessonId: string;
  videoUrl: string;
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <VideoPlayer
        lessonId={lessonId}
        videoUrl={videoUrl}
      />
    </div>
  );
};

// Przykład 3: Strona z modalem subskrypcji
const CoursePageWithModal = ({ courseTitle }: { courseTitle: string }) => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{courseTitle}</h1>
      
      <button 
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Pokaż modal subskrypcji
      </button>

      {showModal && (
        <SubscriptionPrompt
          variant="modal"
          courseTitle={courseTitle}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

// Przykład 4: Banner subskrypcji
const CoursePageWithBanner = ({ courseTitle }: { courseTitle: string }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <SubscriptionPrompt
        variant="banner"
        courseTitle={courseTitle}
      />
      
      <div className="mt-6">
        <h1 className="text-3xl font-bold">{courseTitle}</h1>
        <p>Zawartość kursu...</p>
      </div>
    </div>
  );
};

export {
  LessonPage,
  VideoOnlyPage,
  CoursePageWithModal,
  CoursePageWithBanner
};