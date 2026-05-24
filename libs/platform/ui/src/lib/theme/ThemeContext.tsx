import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children, initialMode = 'light' }: { children: React.ReactNode, initialMode?: 'light' | 'dark' }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(initialMode);
  const [primaryColor, setPrimaryColor] = useState('#1976d2');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
      },
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
