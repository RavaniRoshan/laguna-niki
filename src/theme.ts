export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'cmmnts-theme';

export function getStoredTheme(): ThemeMode {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === 'light' || val === 'dark') return val;
    return 'system';
  } catch {
    return 'system';
  }
}

export function applyTheme(theme: ThemeMode) {
  try {
    if (theme === 'system') {
      localStorage.removeItem(STORAGE_KEY);
      document.documentElement.removeAttribute('data-theme');
    } else {
      localStorage.setItem(STORAGE_KEY, theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
}

export function getResolvedTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'light' || theme === 'dark') return theme;
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}
