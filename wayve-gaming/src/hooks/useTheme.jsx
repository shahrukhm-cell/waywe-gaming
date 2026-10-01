import { useCallback, useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'themePreference';

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredTheme = () => {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'dark' || stored === 'light' ? stored : null;
};

export default function useTheme() {
  const [theme, setTheme] = useState(() => getStoredTheme() ?? getSystemTheme());
  const [isSystemTheme, setIsSystemTheme] = useState(() => !getStoredTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (!isSystemTheme) return undefined;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => setTheme(event.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemTheme]);

  const toggleTheme = useCallback(() => {
    setIsSystemTheme(false);
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      window.localStorage.removeItem('theme');
      return nextTheme;
    });
  }, []);

  return { theme, toggleTheme };
}
