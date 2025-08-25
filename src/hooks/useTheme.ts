import { useEffect } from 'react';
import { useProgressStore } from '../stores/useProgressStore';

export const useTheme = () => {
  const { settings } = useProgressStore();

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (theme: 'light' | 'dark') => {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (settings.theme === 'system') {
      // Use system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');

      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Use explicit theme setting
      applyTheme(settings.theme);
    }
  }, [settings.theme]);
};