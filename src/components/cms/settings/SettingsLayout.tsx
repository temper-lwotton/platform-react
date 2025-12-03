'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Globe,
  Image,
  BookOpen,
  PenTool,
  MessageSquare,
  Link as LinkIcon,
  Settings,
} from 'lucide-react';
import styles from './SettingsLayout.module.scss';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

interface SettingsTab {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const settingsTabs: SettingsTab[] = [
  {
    label: 'General',
    href: '/admin/settings/general',
    icon: Globe,
    description: 'Site name, description, timezone, and language',
  },
  {
    label: 'Media',
    href: '/admin/settings/media',
    icon: Image,
    description: 'Upload limits, image sizes, and AI settings',
  },
  {
    label: 'Reading',
    href: '/admin/settings/reading',
    icon: BookOpen,
    description: 'Posts per page, feed settings, and visibility',
  },
  {
    label: 'Writing',
    href: '/admin/settings/writing',
    icon: PenTool,
    description: 'Default status, autosave, and revisions',
  },
  {
    label: 'Discussion',
    href: '/admin/settings/discussion',
    icon: MessageSquare,
    description: 'Comments and moderation settings',
  },
  {
    label: 'Permalinks',
    href: '/admin/settings/permalinks',
    icon: LinkIcon,
    description: 'URL structure and slugs',
  },
];

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Settings className={styles.titleIcon} />
          <div>
            <h1 className={styles.title}>Settings</h1>
            <p className={styles.subtitle}>Configure your CMS preferences</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Sidebar Navigation */}
        <nav className={styles.sidebar}>
          <ul className={styles.navList}>
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;

              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  >
                    <div className={styles.navItemHeader}>
                      <Icon className={styles.navIcon} />
                      <span className={styles.navLabel}>{tab.label}</span>
                    </div>
                    <p className={styles.navDescription}>{tab.description}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main Content */}
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
