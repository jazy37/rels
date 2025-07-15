'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './whyChooseFeatureCard.module.css'; 
interface WhyChooseFeatureCardProps {
  icon: string;
  title: string;
  description: string;
  index?: number;
}

export default function WhyChooseFeatureCard({ icon, title, description, index = 0 }: WhyChooseFeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, index * 200);
        }
      },
      { threshold: 0.9 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`${styles.whyChooseFeatureCard} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.whyChooseFeatureIcon}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
}