'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Theme {
  name: string;
  label: string;
  description: string;
  bgGradient: string;
  accentColor: string;
  statCards: {
    books: string;
    total: string;
    reading: string;
    rating: string;
  };
}

export const THEMES: Record<string, Theme> = {
  'light': {
    name: 'light',
    label: 'Light',
    description: 'Clean and bright with minimal grays',
    bgGradient: 'from-gray-50 via-gray-50 to-slate-50',
    accentColor: 'from-gray-700 to-slate-700',
    statCards: {
      books: 'from-gray-500 to-gray-700',
      total: 'from-slate-500 to-slate-700',
      reading: 'from-zinc-500 to-zinc-700',
      rating: 'from-stone-500 to-stone-700',
    },
  },
  'dark': {
    name: 'dark',
    label: 'Dark',
    description: 'Elegant deep charcoal and navy tones',
    bgGradient: 'from-slate-900 via-gray-900 to-slate-900',
    accentColor: 'from-gray-300 to-slate-300',
    statCards: {
      books: 'from-gray-600 to-gray-800',
      total: 'from-slate-600 to-slate-800',
      reading: 'from-zinc-600 to-zinc-800',
      rating: 'from-stone-600 to-stone-800',
    },
  },
  'sepia': {
    name: 'sepia',
    label: 'Sepia',
    description: 'Warm vintage paper tones for comfortable reading',
    bgGradient: 'from-stone-50 via-amber-50 to-orange-50',
    accentColor: 'from-stone-700 to-amber-800',
    statCards: {
      books: 'from-stone-500 to-stone-700',
      total: 'from-amber-600 to-amber-800',
      reading: 'from-orange-600 to-orange-800',
      rating: 'from-yellow-700 to-yellow-900',
    },
  },
  'slate': {
    name: 'slate',
    label: 'Slate',
    description: 'Professional cool gray with blue undertones',
    bgGradient: 'from-slate-50 via-blue-50 to-gray-50',
    accentColor: 'from-slate-600 to-blue-600',
    statCards: {
      books: 'from-slate-500 to-slate-700',
      total: 'from-blue-500 to-blue-700',
      reading: 'from-gray-500 to-gray-700',
      rating: 'from-zinc-500 to-zinc-700',
    },
  },
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES.light);

  useEffect(() => {
    const savedTheme = localStorage.getItem('bookTrackerTheme') || 'light';
    setCurrentTheme(THEMES[savedTheme] || THEMES.light);
  }, []);

  const setTheme = (themeName: string) => {
    const theme = THEMES[themeName];
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('bookTrackerTheme', themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
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
