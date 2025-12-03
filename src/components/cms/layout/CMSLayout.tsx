'use client';

import { useState } from 'react';
import { CMSSidebar } from './CMSSidebar';
import { CMSHeader } from './CMSHeader';
import styles from './CMSLayout.module.scss';

interface CMSLayoutProps {
  children: React.ReactNode;
}

export function CMSLayout({ children }: CMSLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <CMSSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Header */}
        <CMSHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className={styles.pageContent}>
          <div className={styles.container}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
