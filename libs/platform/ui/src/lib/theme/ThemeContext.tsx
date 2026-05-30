import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { useTenant } from '@bare-bodhika/core';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children, initialMode = 'light' }: { children: React.ReactNode, initialMode?: 'light' | 'dark' }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(initialMode);
  const [primaryColor, setPrimaryColor] = useState('#1976d2');
  const { tenant } = useTenant();

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (tenant?.primaryColor) {
      setPrimaryColor(tenant.primaryColor);
    }
  }, [tenant?.primaryColor]);

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
      },
      ...(mode === 'dark' ? {
        background: {
          default: '#111827', // Tailwind bg-gray-900
          paper: '#1f2937',   // Tailwind bg-gray-800
        },
        text: {
          primary: '#ffffff',
          secondary: '#9ca3af', // Tailwind text-gray-400
        },
        divider: '#374151', // Tailwind border-gray-700
      } : {}),
    },
  });

  useEffect(() => {
    // Update CSS variables for Tailwind
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode, primaryColor]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setPrimaryColor }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
