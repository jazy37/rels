'use client';

import { ReactNode } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardSidebar from '../components/DashboardSidebar';
import styles from './layout.module.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className={styles.dashboardWrapper}>
        <div className={styles.dashboardLayout}>
          <DashboardSidebar />
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}