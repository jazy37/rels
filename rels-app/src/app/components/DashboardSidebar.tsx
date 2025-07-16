'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import styles from './DashboardSidebar.module.css';

const DashboardSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['resources']);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleExpand = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/courses', label: 'Moje Kursy', icon: '📚', badge: '3' },
    { href: '/dashboard/certificates', label: 'Certyfikaty', icon: '🏆' },
    { href: '/dashboard/profile', label: 'Profil', icon: '👤' },
  ];

  const resourceItems = [
    { href: '/dashboard/documents', label: 'Dokumenty', icon: '📄' },
    { href: '/dashboard/templates', label: 'Szablony', icon: '📋' },
    { href: '/dashboard/library', label: 'Biblioteka', icon: '📚' },
  ];

  const toolItems = [
    { href: '/dashboard/analytics', label: 'Analityka', icon: '📊' },
    { href: '/dashboard/settings', label: 'Ustawienia', icon: '⚙️' },
    { href: '/dashboard/support', label: 'Pomoc', icon: '💬' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.active : ''}`}
        onClick={toggleMobileMenu}
      >
        <span className={styles.hamburgerIcon}></span>
        <span className={styles.hamburgerIcon}></span>
        <span className={styles.hamburgerIcon}></span>
      </button>

      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${isMobileMenuOpen ? styles.active : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>R</div>
          <span className={styles.logoText}>RELS</span>
          <button className={styles.mobileClose} onClick={closeMobileMenu}>
            ✕
          </button>
        </div>

        <nav className={styles.navSection}>
          {menuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
              onClick={closeMobileMenu}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className={styles.navBadge}>{item.badge}</span>
              )}
            </Link>
          ))}

          <div className={styles.navDivider}></div>

          {/* Resources Section */}
          <div 
            className={`${styles.navItem} ${styles.expandableItem} ${expandedSections.includes('resources') ? styles.expanded : ''}`}
            onClick={() => toggleExpand('resources')}
          >
            <span className={styles.navIcon}>📚</span>
            Zasoby
            <span className={styles.expandIcon}>▼</span>
          </div>
          {expandedSections.includes('resources') && (
            <div className={styles.subMenu}>
              {resourceItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <div className={styles.navDivider}></div>

          {/* Tools Section */}
          <div 
            className={`${styles.navItem} ${styles.expandableItem} ${expandedSections.includes('tools') ? styles.expanded : ''}`}
            onClick={() => toggleExpand('tools')}
          >
            <span className={styles.navIcon}>🔧</span>
            Narzędzia
            <span className={styles.expandIcon}>▼</span>
          </div>
          {expandedSections.includes('tools') && (
            <div className={styles.subMenu}>
              {toolItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className={styles.proSection}>
          <div className={styles.proTitle}>Zostań członkiem Premium</div>
          <div className={styles.proDescription}>
            Odblokuj funkcje Premium i przenieś swoją podróż na wyższy poziom
          </div>
          <button className={styles.proButton}>
            <span>⭐</span>
            Przejdź na Premium
          </button>
        </div>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.username}</div>
              {/* <div className={styles.userEmail}>{user?.email}</div> */}
            </div>
          </div>
          <button className={styles.logoutButton} onClick={logout}>
            Wyloguj
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;