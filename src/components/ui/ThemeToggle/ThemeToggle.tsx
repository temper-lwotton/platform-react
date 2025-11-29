'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
import styles from './ThemeToggle.module.scss';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={styles.placeholder} />;
  }

  const isDark = resolvedTheme === 'dark';

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className={styles.wrapper}>
      <Sun size={16} className={`${styles.icon} ${styles.iconSun}`} />
      <Switch.Root
        className={styles.switch}
        checked={isDark}
        onCheckedChange={handleToggle}
        aria-label="Toggle dark mode"
      >
        <Switch.Thumb className={styles.thumb} />
      </Switch.Root>
      <Moon size={16} className={`${styles.icon} ${styles.iconMoon}`} />
    </div>
  );
}
