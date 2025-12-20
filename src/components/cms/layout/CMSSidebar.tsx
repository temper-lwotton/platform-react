'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Tags,
  Image,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Radio,
  BarChart3,
  Zap,
  TrendingUp,
  AlertCircle,
  Users,
  Target,
  CheckCircle,
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

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      {
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
      },
      {
        label: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        label: 'Pages',
        href: '/admin/pages',
        icon: FileText,
      },
      {
        label: 'Taxonomies',
        href: '/admin/taxonomies',
        icon: Tags,
      },
      {
        label: 'Media',
        href: '/admin/media',
        icon: Image,
      },
    ],
  },
  {
    title: 'Moderation & Safety',
    items: [
      {
        label: 'Moderation Queue',
        href: '/admin/moderation',
        icon: Shield,
      },
      {
        label: 'Auto-Mod Rules',
        href: '/admin/moderation/rules',
        icon: Zap,
      },
      {
        label: 'Mod Analytics',
        href: '/admin/moderation/analytics',
        icon: TrendingUp,
      },
      {
        label: 'Appeals',
        href: '/admin/moderation/appeals',
        icon: AlertCircle,
      },
    ],
  },
  {
    title: 'Members',
    items: [
      {
        label: 'Member Directory',
        href: '/admin/members',
        icon: Users,
      },
      {
        label: 'Segments',
        href: '/admin/members/segments',
        icon: Target,
      },
      {
        label: 'Onboarding',
        href: '/admin/members/onboarding',
        icon: CheckCircle,
      },
      {
        label: 'Analytics',
        href: '/admin/members/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Administration',
    items: [
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
    ],
  },
  {
    title: 'Communications',
    items: [
      {
        label: 'Broadcasts',
        href: '/admin/broadcasts',
        icon: Radio,
      },
    ],
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
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={styles.navSection}>
            {section.title && isOpen && (
              <h3 className={styles.sectionTitle}>{section.title}</h3>
            )}
            <ul className={styles.navList}>
              {section.items.map((item) => {
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
          </div>
        ))}
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
