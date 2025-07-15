'use client';
import React, { useState } from 'react';
import styles from './SubscriptionPrompt.module.css';

interface SubscriptionPromptProps {
  variant?: 'modal' | 'banner' | 'card';
  courseTitle?: string;
  onClose?: () => void;
}

const SubscriptionPrompt: React.FC<SubscriptionPromptProps> = ({
  variant = 'card',
  courseTitle,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const getContainerClasses = () => {
    const baseClass = styles.baseContainer;
    switch (variant) {
      case 'modal':
        return styles.modalVariant;
      case 'banner':
        return `${baseClass} ${styles.bannerVariant}`;
      case 'card':
        return `${baseClass} ${styles.cardVariant}`;
      default:
        return `${baseClass} ${styles.cardVariant}`;
    }
  };

  const getContentClasses = () => {
    switch (variant) {
      case 'modal':
        return styles.modalContent;
      case 'banner':
        return styles.bannerContent;
      case 'card':
        return styles.cardContent;
      default:
        return styles.cardContent;
    }
  };

  const Content = () => (
    <div className={getContentClasses()}>
      {/* Close button */}
      {onClose && (
        <button
          onClick={handleClose}
          className={styles.closeButton}
        >
          ×
        </button>
      )}

      {/* Icon */}
      <div className={styles.iconContainer}>
        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      {/* Title */}
      <h3 className={styles.title}>
        Odblokuj pełny dostęp
      </h3>

      {/* Subtitle */}
      {courseTitle && (
        <p className={styles.subtitle}>
          do kursu: <span className={styles.subtitleBold}>{courseTitle}</span>
        </p>
      )}

      {/* Features list */}
      <div className={styles.featuresContainer}>
        <h4 className={styles.featuresTitle}>Co zyskasz z subskrypcją:</h4>
        <ul className={styles.featuresList}>
          {[
            'Dostęp do wszystkich filmów wideo',
            'Materiały dodatkowe i ćwiczenia',
            'Certyfikaty ukończenia kursów',
            'Wsparcie od instruktorów',
            'Najnowsze aktualizacje kursów'
          ].map((feature, index) => (
            <li key={index} className={styles.featureItem}>
              <svg className={styles.featureIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Action buttons */}
      <div className={styles.actionsContainer}>
        <button className={styles.primaryButton}>
          Kup subskrypcję - 49 zł/miesiąc
        </button>
        <button className={styles.secondaryButton}>
          Dowiedz się więcej
        </button>
      </div>

      {/* Footer */}
      <p className={styles.footer}>
        Anuluj w każdej chwili. Bez zobowiązań.
      </p>
    </div>
  );

  if (variant === 'modal') {
    return (
      <div className={getContainerClasses()}>
        <Content />
      </div>
    );
  }

  return (
    <div className={getContainerClasses()}>
      <Content />
    </div>
  );
};

export default SubscriptionPrompt;