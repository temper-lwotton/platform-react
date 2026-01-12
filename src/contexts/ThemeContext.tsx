'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { settingsAPI } from '@/services/cms/api';
import type { ThemeSettings } from '@/services/cms/types/settings';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  platformTheme: ThemeSettings | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [platformTheme, setPlatformTheme] = useState<ThemeSettings | null>(null);
  const [mounted, setMounted] = useState(false);

  // Get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Resolve theme (system -> light/dark)
  const resolveTheme = (selectedTheme: Theme): 'light' | 'dark' => {
    if (selectedTheme === 'system') {
      return getSystemTheme();
    }
    return selectedTheme;
  };

  // Apply platform theme colors to CSS variables
  const applyPlatformColors = (themeSettings: ThemeSettings) => {
    const root = document.documentElement;

    // Determine which colors to use
    let primaryColor = themeSettings.primaryColor;
    let infoColor = themeSettings.infoColor;
    let ctaColor = themeSettings.ctaColor;
    let accentColor = themeSettings.accentColor;

    // If custom theme, use custom colors
    if (themeSettings.platformTheme === 'custom') {
      primaryColor = themeSettings.customPrimaryColor || primaryColor;
      infoColor = themeSettings.customInfoColor || infoColor;
      ctaColor = themeSettings.customCtaColor || ctaColor;
      accentColor = themeSettings.customAccentColor || accentColor;
    }
    // Apply preset theme colors
    else if (themeSettings.platformTheme === 'deep-focus') {
      primaryColor = '#1e3a8a'; // Dark blue
      infoColor = '#0ea5e9'; // Cyan
      ctaColor = '#06b6d4'; // Teal
      accentColor = '#38bdf8'; // Light blue
    }
    else if (themeSettings.platformTheme === 'bright-studio') {
      primaryColor = '#ec4899'; // Pink
      infoColor = '#f97316'; // Orange
      ctaColor = '#fb923c'; // Light orange
      accentColor = '#fdba74'; // Peach
    }
    else if (themeSettings.platformTheme === 'coastal-fusion') {
      primaryColor = '#00997d'; // Bright teal
      infoColor = '#008bcc'; // Ocean blue
      ctaColor = '#e74c85'; // Magenta pink
      accentColor = '#997ac7'; // Lavender purple
    }

    // Apply colors to CSS variables
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-info', infoColor);
    root.style.setProperty('--color-cta', ctaColor);
    root.style.setProperty('--color-accent', accentColor);
    root.style.setProperty('--color-success', accentColor);

    // Set gradient colors for background mesh (used in body)
    // Extract RGB values for rgba() usage in gradients
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };

    const primaryRgb = hexToRgb(primaryColor);
    const infoRgb = hexToRgb(infoColor);
    const ctaRgb = hexToRgb(ctaColor);
    const accentRgb = hexToRgb(accentColor);

    root.style.setProperty('--gradient-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    root.style.setProperty('--gradient-info-rgb', `${infoRgb.r}, ${infoRgb.g}, ${infoRgb.b}`);
    root.style.setProperty('--gradient-cta-rgb', `${ctaRgb.r}, ${ctaRgb.g}, ${ctaRgb.b}`);
    root.style.setProperty('--gradient-accent-rgb', `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`);

    // You could also generate hover variants here by darkening/lightening
    // For now, we'll keep the existing hover colors in CSS
  };

  // Apply theme to DOM
  const applyTheme = (newTheme: 'light' | 'dark', themeSettings?: ThemeSettings | null) => {
    const root = document.documentElement;

    // Add transitioning class to prevent flash
    root.classList.add('theme-transitioning');

    // Set data-theme attribute
    root.setAttribute('data-theme', newTheme);

    // Update color-scheme for native form controls
    root.style.colorScheme = newTheme;

    // Apply platform colors if available
    if (themeSettings) {
      applyPlatformColors(themeSettings);
    }

    // Remove transitioning class after a brief moment
    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 50);
  };

  // Load platform theme settings
  useEffect(() => {
    const loadPlatformTheme = async () => {
      try {
        const response = await settingsAPI.getSettingsCategory('theme');
        if (response.success && response.data) {
          setPlatformTheme(response.data);

          // Apply platform colors immediately
          applyPlatformColors(response.data);

          // Use platform's default color mode if user hasn't set preference and override is disabled
          const storedTheme = localStorage.getItem('theme') as Theme | null;
          if (!storedTheme && !response.data.allowUserOverride) {
            const platformColorMode = response.data.defaultColorMode as Theme;
            setThemeState(platformColorMode);
            const resolved = resolveTheme(platformColorMode);
            setResolvedTheme(resolved);
            applyTheme(resolved, response.data);
          }
        }
      } catch (error) {
        console.error('Failed to load platform theme:', error);
      }
    };

    loadPlatformTheme();
  }, []);

  // Listen for platform theme changes from admin settings
  useEffect(() => {
    const handlePlatformThemeChange = (event: CustomEvent<ThemeSettings>) => {
      const newPlatformTheme = event.detail;
      setPlatformTheme(newPlatformTheme);
      applyPlatformColors(newPlatformTheme);

      // If user override is disabled, force platform default
      if (!newPlatformTheme.allowUserOverride) {
        const platformColorMode = newPlatformTheme.defaultColorMode as Theme;
        setThemeState(platformColorMode);
        localStorage.setItem('theme', platformColorMode);
        const resolved = resolveTheme(platformColorMode);
        setResolvedTheme(resolved);
        applyTheme(resolved, newPlatformTheme);
      }
    };

    window.addEventListener('platform-theme-change', handlePlatformThemeChange as EventListener);
    return () => {
      window.removeEventListener('platform-theme-change', handlePlatformThemeChange as EventListener);
    };
  }, []);

  // Initialize theme from localStorage or platform default
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;

    // Use stored theme if available and user override is allowed
    const initialTheme = storedTheme || (platformTheme?.defaultColorMode as Theme) || 'system';

    setThemeState(initialTheme);
    const resolved = resolveTheme(initialTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved, platformTheme);
    setMounted(true);
  }, [platformTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const newResolvedTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newResolvedTheme);
      applyTheme(newResolvedTheme, platformTheme);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme, platformTheme]);

  // Set theme function
  const setTheme = (newTheme: Theme) => {
    // Check if user override is allowed
    if (platformTheme && !platformTheme.allowUserOverride) {
      console.warn('User theme override is disabled by platform settings');
      return;
    }

    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved, platformTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, platformTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
