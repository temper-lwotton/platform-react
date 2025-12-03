'use client';

import { Menu, Bell, User, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import styles from './CMSHeader.module.scss';

interface CMSHeaderProps {
  onMenuClick: () => void;
}

export function CMSHeader({ onMenuClick }: CMSHeaderProps) {
  const { userId } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new CustomEvent('auth:logout'));
    router.push('/login');
  };

  return (
    <header className={styles.header}>
      {/* Left side */}
      <div className={styles.leftSide}>
        <button
          onClick={onMenuClick}
          className={styles.menuButton}
          aria-label="Toggle menu"
        >
          <Menu className={styles.backIcon} />
        </button>

        <Link href="/" className={styles.backLink}>
          <Home className={styles.backIcon} />
          <span className={styles.backText}>Back to Site</span>
        </Link>
      </div>

      {/* Right side */}
      <div className={styles.rightSide}>
        {/* Notifications */}
        <button
          className={styles.notificationButton}
          aria-label="Notifications"
        >
          <Bell className={styles.backIcon} />
          <span className={styles.notificationBadge}></span>
        </button>

        {/* User Menu */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Admin User</span>
            <span className={styles.userRole}>Administrator</span>
          </div>

          <div className={styles.userMenuWrapper}>
            <button
              className={styles.userButton}
              aria-label="User menu"
            >
              <User className={styles.backIcon} />
            </button>

            {/* Dropdown Menu */}
            <div className={styles.userMenu}>
              <div className={styles.menuContent}>
                <Link href="/preferences" className={styles.menuItem}>
                  <User className={styles.menuIcon} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${styles.menuItem} ${styles.danger}`}
                >
                  <LogOut className={styles.menuIcon} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
