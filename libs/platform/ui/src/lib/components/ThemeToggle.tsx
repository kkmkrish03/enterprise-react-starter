import React from 'react';
import { IconButton } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      aria-label={`Toggle theme, current: ${mode}`}
      color="inherit"
    >
      {mode === 'light' ? (
        <DarkMode sx={{ color: 'text.secondary' }} />
      ) : (
        <LightMode sx={{ color: 'warning.main' }} />
      )}
    </IconButton>
  );
};
export default ThemeToggle;
