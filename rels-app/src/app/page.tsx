import WhyChooseFeatureCard from "./components/whyChooseFeatureCard";
import CoursesSection from "./components/CoursesSection";
import PricingSection from "./components/PricingSection";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Eksperckie rozwiązania prawne dla profesjonalistów nieruchomości
              </h1>
              <p className={styles.heroDescription}>
                Uzyskaj dostęp do eksperckich kursów prawnych, konsultacji oraz szablonów dokumentów 
                zaprojektowanych specjalnie dla profesjonalistów rynku nieruchomości.
              </p>
              <div className={styles.heroButtons}>
                <a href="/kursy" className={styles.primaryButton}>
                  Przeglądaj kursy
                </a>
                <a href="/konsultacje" className={styles.secondaryButton}>
                  Zarezerwuj konsultację
                </a>
              </div>
            </div>
            <div className={styles.heroImage}>
              <div className={styles.heroImagePlaceholder}>
                Nowoczesne biuro prawnicze
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.whyChooseSection}>
        <div className={styles.whyChooseContainer}>
          <div className={styles.whyChooseSectionHeader}>
            <h2 className={styles.whyChooseSectionTitle}>Dlaczego RELS</h2>
            <p className={styles.whyChooseSectionDescription}>
              Nasza platforma oferuje kompleksowe zasoby prawne dostosowane specjalnie dla profesjonalistów rynku nieruchomości.
            </p>
          </div>


          <div className={styles.whyChooseFeaturesGrid}>
            <WhyChooseFeatureCard icon="fa-graduation-cap" title="Kursy eksperckie" description="Dostęp do kompleksowych kursów prawnych opracowanych przez doświadczonych prawników nieruchomości." index={0}/>
            <WhyChooseFeatureCard icon="fa-comments" title="Konsultacje prawne" description="Zarezerwuj indywidualne konsultacje ze specjalistycznymi prawnikami nieruchomości." index={1}/>
            <WhyChooseFeatureCard icon="fa-file-contract" title="Biblioteka dokumentów" description="Dostęp do kompleksowej biblioteki szablonów prawnych i dokumentów dla Twoich potrzeb nieruchomościowych." index={2}/>
          </div>

          <div className={styles.ctaContainer}>
            <a href="/kursy" className={styles.ctaButton}>Rozpocznij już dziś</a>
          </div>
        </div>
      </section>

      <CoursesSection />

      <PricingSection />
    </div>
  );
}
