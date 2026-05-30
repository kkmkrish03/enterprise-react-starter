import React from 'react';
import { TextField, MenuItem } from '@mui/material';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'error' | 'color'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  value,
  onChange,
  disabled,
  required,
  ...props
}) => {
  return (
    <TextField
      select
      id={id}
      label={label}
      value={value}
      onChange={onChange as any}
      disabled={disabled}
      required={required}
      error={Boolean(error)}
      helperText={error || helperText}
      fullWidth
      variant="outlined"
      className={className}
      {...(props as any)}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
export default SelectField;
