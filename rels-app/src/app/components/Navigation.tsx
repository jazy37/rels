'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent focus from going to the first link when menu opens
    if (!isMobileMenuOpen) {
      setTimeout(() => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      }, 100);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navLeft}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoBadge}>RELS</span>
            </Link>
          </div>
          
          <ul className={styles.navLinks}>
            <li><Link href="/kursy" onClick={closeMobileMenu}>Katalog Kursów</Link></li>
            <li><Link href="/konsultacje" onClick={closeMobileMenu}>Konsultacje Prawne</Link></li>
            <li><Link href="/dokumenty" onClick={closeMobileMenu}>Biblioteka Dokumentów</Link></li>
            <li><Link href="/subskrypcja" onClick={closeMobileMenu}>Subskrypcja</Link></li>
          </ul>
          
          <div className={styles.navRight}>
            {!isAuthenticated ? (
              <>
                <Link href="/login" className={styles.loginBtn}>Zaloguj</Link>
                <Link href="/register" className={styles.registerBtn}>Rejestracja</Link>
              </>
            ) : (
              <div className={styles.userMenu}>
                <Link href="/dashboard" className={styles.dashboardLink}>
                  <span className={styles.notificationIcon}>🔔</span>
                </Link>
                <div className={styles.userAvatar}>
                  <div className={styles.userAvatarImage}></div>
                  <div className={styles.userDropdown}>
                    <Link href="/dashboard" onClick={closeMobileMenu}>Panel użytkownika</Link>
                    <Link href="/kursy" onClick={closeMobileMenu}>Moje kursy</Link>
                    <button onClick={handleLogout}>Wyloguj</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            className={styles.mobileMenuToggle}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.active : ''}`}>
        <div className={styles.mobileMenuContent}>
          <ul className={styles.mobileNavLinks}>
            <li><Link href="/kursy" onClick={closeMobileMenu}>Katalog Kursów</Link></li>
            <li><Link href="/konsultacje" onClick={closeMobileMenu}>Konsultacje Prawne</Link></li>
            <li><Link href="/dokumenty" onClick={closeMobileMenu}>Biblioteka Dokumentów</Link></li>
            <li><Link href="/subskrypcja" onClick={closeMobileMenu}>Subskrypcja</Link></li>
          </ul>
          
          <div className={styles.mobileMenuActions}>
            {!isAuthenticated ? (
              <>
                <Link href="/login" className={styles.mobileLoginBtn} onClick={closeMobileMenu}>
                  Zaloguj
                </Link>
                <Link href="/register" className={styles.mobileRegisterBtn} onClick={closeMobileMenu}>
                  Rejestracja
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className={styles.mobileDashboardBtn} onClick={closeMobileMenu}>
                  Panel użytkownika
                </Link>
                <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
                  Wyloguj
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.active : ''}`}
        onClick={closeMobileMenu}
      ></div>
    </>
  );
}