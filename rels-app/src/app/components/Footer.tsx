import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.title}>RELS</h3>
            <p className={styles.description}>
              Real Estate Legal Solutions - Profesjonalne szkolenia z zakresu prawa nieruchomości
            </p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                📘
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                💼
              </a>
              <a href="#" className={styles.socialLink} aria-label="Email">
                ✉️
              </a>
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Kursy</h4>
            <ul className={styles.linksList}>
              <li><Link href="/kursy" className={styles.link}>Wszystkie kursy</Link></li>
              <li><Link href="/kursy" className={styles.link}>Prawo nieruchomości</Link></li>
              <li><Link href="/kursy" className={styles.link}>Certyfikaty</Link></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Firma</h4>
            <ul className={styles.linksList}>
              <li><Link href="#" className={styles.link}>O nas</Link></li>
              <li><Link href="#" className={styles.link}>Kontakt</Link></li>
              <li><Link href="#" className={styles.link}>Regulamin</Link></li>
              <li><Link href="#" className={styles.link}>Polityka prywatności</Link></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Kontakt</h4>
            <div className={styles.contactInfo}>
              <p className={styles.contactItem}>
                📍 ul. Przykładowa 123<br />
                00-001 Warszawa
              </p>
              <p className={styles.contactItem}>
                📞 +48 123 456 789
              </p>
              <p className={styles.contactItem}>
                ✉️ kontakt@rels.pl
              </p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} RELS - Real Estate Legal Solutions. Wszystkie prawa zastrzeżone.
            </p>
            <div className={styles.bottomLinks}>
              <Link href="#" className={styles.bottomLink}>Regulamin</Link>
              <Link href="#" className={styles.bottomLink}>Prywatność</Link>
              <Link href="#" className={styles.bottomLink}>Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;