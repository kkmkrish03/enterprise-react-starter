import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerActions,
  size = 'md',
  closeOnBackdropClick = true,
}) => {
  const handleClose = (event: any, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick' && !closeOnBackdropClick) {
      return;
    }
    onClose();
  };

  const muiMaxWidth = size === 'xl' ? 'xl' : size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md';

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth={muiMaxWidth}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', pr: 6 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          {title || 'Modal Dialog'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        {children}
      </DialogContent>
      {footerActions && (
        <DialogActions sx={{ p: 2, px: 3 }}>
          {footerActions}
        </DialogActions>
      )}
    </Dialog>
  );
};
export default Modal;
