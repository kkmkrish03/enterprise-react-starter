import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  startIcon,
  endIcon,
  className = '',
  disabled,
  ...props
}) => {
  let muiVariant: 'contained' | 'outlined' | 'text' = 'contained';
  let muiColor: 'primary' | 'secondary' | 'error' | 'success' | 'inherit' = 'primary';

  switch (variant) {
    case 'primary':
      muiVariant = 'contained';
      muiColor = 'primary';
      break;
    case 'secondary':
      muiVariant = 'contained';
      muiColor = 'secondary';
      break;
    case 'danger':
      muiVariant = 'contained';
      muiColor = 'error';
      break;
    case 'success':
      muiVariant = 'contained';
      muiColor = 'success';
      break;
    case 'outline':
      muiVariant = 'outlined';
      muiColor = 'primary';
      break;
    case 'text':
      muiVariant = 'text';
      muiColor = 'primary';
      break;
  }

  const muiSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium';

  return (
    <MuiButton
      variant={muiVariant}
      color={muiColor}
      size={muiSize}
      disabled={disabled || isLoading}
      className={className}
      startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      endIcon={!isLoading ? endIcon : undefined}
      {...(props as any)}
    >
      {children}
    </MuiButton>
  );
};
export default Button;
