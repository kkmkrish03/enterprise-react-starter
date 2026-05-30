import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'error' | 'color'> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  isPassword = false,
  type = 'text',
  className = '',
  id,
  value,
  onChange,
  disabled,
  required,
  placeholder,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const InputProps: any = {};

  if (startIcon) {
    InputProps.startAdornment = (
      <InputAdornment position="start">
        {startIcon}
      </InputAdornment>
    );
  }

  if (isPassword) {
    InputProps.endAdornment = (
      <InputAdornment position="end">
        <IconButton
          onClick={togglePasswordVisibility}
          edge="end"
          aria-label="toggle password visibility"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    );
  } else if (endIcon) {
    InputProps.endAdornment = (
      <InputAdornment position="end">
        {endIcon}
      </InputAdornment>
    );
  }

  return (
    <TextField
      id={id}
      label={label}
      type={resolvedType}
      value={value}
      onChange={onChange as any}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      error={Boolean(error)}
      helperText={error || helperText}
      fullWidth
      variant="outlined"
      className={className}
      slotProps={{
        input: InputProps
      }}
      {...(props as any)}
    />
  );
};
export default InputField;
