'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Theme } from '../../lib/types';
import { matrixTheme } from './themes/matrix';
import { amberTheme } from './themes/amber';
import { spaceTheme } from './themes/space';
import { synthwaveTheme } from './themes/synthwave';
import { forestTheme } from './themes/forest';
import { neonTheme } from './themes/neon';

interface ThemeContextType {
  currentTheme: Theme;
  availableThemes: Theme[];
  switchTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const AVAILABLE_THEMES = [
  matrixTheme,
  amberTheme,
  spaceTheme,
  forestTheme,
  neonTheme
];

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(matrixTheme);

  const switchTheme = (themeId: string) => {
    const theme = AVAILABLE_THEMES.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  const value = {
    currentTheme,
    availableThemes: AVAILABLE_THEMES,
    switchTheme
  };

  return (
    <ThemeContext.Provider value={value}>
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