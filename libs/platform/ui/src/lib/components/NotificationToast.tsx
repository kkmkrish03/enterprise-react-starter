import { useEffect } from 'react';
import { useNotificationStore } from '@bare-bodhika/core';
import { Snackbar, Alert, Box } from '@mui/material';

export const NotificationToast = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1400, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification as any}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </Box>
  );
};

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

const Toast = ({ notification, onClose }: { notification: Notification, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Snackbar
      open={true}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ position: 'static', transform: 'none' }}
    >
      <Alert
        onClose={onClose}
        severity={notification.type}
        variant="filled"
        sx={{ width: '100%', minWidth: 250 }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};
