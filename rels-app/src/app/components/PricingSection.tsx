'use client';
import React, { useState } from 'react';
import styles from './PricingSection.module.css';

const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const togglePricing = (type: 'monthly' | 'annual') => {
    setIsAnnual(type === 'annual');
  };

  return (
    <section className={styles.pricingSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Plan Subskrypcyjny</h2>
        <p className={styles.subtitle}>
          Wybierz opcję płatności, która najlepiej odpowiada Twoim potrzebom
        </p>

        <div className={styles.planCard}>
          <div className={styles.premiumBadge}>Premium</div>

          <div className={styles.pricingToggle}>
            <button 
              className={`${styles.pricingOption} ${!isAnnual ? styles.active : ''}`}
              onClick={() => togglePricing('monthly')}
            >
              Miesięcznie
            </button>
            <button 
              className={`${styles.pricingOption} ${isAnnual ? styles.active : ''}`}
              onClick={() => togglePricing('annual')}
            >
              Rocznie
            </button>
            <div className={`${styles.toggleSlider} ${isAnnual ? styles.annual : ''}`}></div>
          </div>

          <div className={styles.priceDisplay}>
            <div className={styles.price}>
              <span className={styles.priceCurrency}>zł</span>
              <span className={styles.priceAmount}>
                {isAnnual ? '500' : '50'}
              </span>
            </div>
            <div className={styles.pricePeriod}>
              {isAnnual ? '/rok' : '/miesiąc'}
            </div>
            <div className={`${styles.savingsBadge} ${isAnnual ? styles.show : ''}`}>
              Oszczędzasz 100 zł rocznie!
            </div>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor"/>
                </svg>
              </div>
              <span>Dostęp do wszystkich kursów</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor"/>
                </svg>
              </div>
              <span>Nieograniczone pobieranie dokumentów</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor"/>
                </svg>
              </div>
              <span>Priorytetowe wsparcie email i telefoniczne</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor"/>
                </svg>
              </div>
              <span>Nieograniczone konsultacje prawne</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor"/>
                </svg>
              </div>
              <span>Personalizacja dokumentów</span>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor"/>
                </svg>
              </div>
              <span>Dostęp do zaawansowanych funkcji</span>
            </div>
          </div>

          <button className={styles.subscribeBtn}>Subskrybuj teraz</button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;