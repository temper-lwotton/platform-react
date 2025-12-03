'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  Blocks,
  Image,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import styles from './CMSSidebar.module.scss';

interface CMSSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Posts',
    href: '/admin/posts',
    icon: FileText,
  },
  {
    label: 'Post Types',
    href: '/admin/post-types',
    icon: FolderOpen,
  },
  {
    label: 'Taxonomies',
    href: '/admin/taxonomies',
    icon: Tags,
  },
  {
    label: 'Block Templates',
    href: '/admin/block-templates',
    icon: Blocks,
  },
  {
    label: 'Media',
    href: '/admin/media',
    icon: Image,
  },
  {
    label: 'User Roles',
    href: '/admin/users/roles',
    icon: Shield,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function CMSSidebar({ isOpen, onToggle }: CMSSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      {/* Logo/Brand */}
      <div className={styles.header}>
        {isOpen && (
          <h1 className={styles.logo}>CMS Admin</h1>
        )}
        <button
          onClick={onToggle}
          className={styles.toggleButton}
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <ChevronLeft className={styles.navIcon} />
          ) : (
            <ChevronRight className={styles.navIcon} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    ${styles.navItem}
                    ${isActive ? styles.active : ''}
                    ${!isOpen ? styles.centered : ''}
                  `}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className={styles.navIcon} />
                  {isOpen && (
                    <span className={styles.navLabel}>{item.label}</span>
                  )}
                  {isOpen && item.badge && (
                    <span className={styles.badge}>{item.badge}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className={styles.footer}>
          <div className={styles.version}>
            CMS v1.0.0
          </div>
        </div>
      )}
    </aside>
  );
}
