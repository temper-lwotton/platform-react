'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '../Icon';
import styles from './SpaceSidebar.module.scss';

interface SpaceSidebarProps {
  spaceId: string;
  spaceTitle: string;
}

const navItems = [
  { href: '', label: 'Overview', icon: 'home' as const },
  { href: '/chat', label: 'Chat', icon: 'chat' as const },
  { href: '/discussions', label: 'Discussions', icon: 'chat' as const },
  { href: '/events', label: 'Events', icon: 'calendar' as const },
];

export function SpaceSidebar({ spaceId, spaceTitle }: SpaceSidebarProps) {
  const pathname = usePathname();
  const basePath = `/spaces/${spaceId}`;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <Link href="/feed" className={styles.back}>
          <Icon icon="arrowLeft" size={18} />
          Back to Home
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          {navItems.map((item) => {
            const fullPath = `${basePath}${item.href}`;
            const isActive = item.href === ''
              ? pathname === basePath
              : pathname.startsWith(fullPath);

            return (
              <li key={item.href}>
                <Link
                  href={fullPath}
                  className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                >
                  <Icon icon={item.icon} size={18} className={styles.icon} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
