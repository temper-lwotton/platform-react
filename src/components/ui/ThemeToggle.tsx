'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as Switch from '@radix-ui/react-switch';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="theme-toggle-placeholder" style={{ width: '60px', height: '32px' }} />
    );
  }

  const isDark = resolvedTheme === 'dark';

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="theme-toggle-wrapper">
      <Sun size={16} className="theme-toggle-icon theme-toggle-icon--sun" />
      <Switch.Root
        className="theme-toggle-switch"
        checked={isDark}
        onCheckedChange={handleToggle}
        aria-label="Toggle dark mode"
      >
        <Switch.Thumb className="theme-toggle-thumb" />
      </Switch.Root>
      <Moon size={16} className="theme-toggle-icon theme-toggle-icon--moon" />
    </div>
  );
}
