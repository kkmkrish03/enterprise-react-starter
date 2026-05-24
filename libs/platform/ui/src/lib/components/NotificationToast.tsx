import React, { useEffect } from 'react';
import { useNotificationStore } from '../../../../core/src/lib/store/notificationStore';

export const NotificationToast = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <Toast key={notification.id} notification={notification} onClose={() => removeNotification(notification.id)} />
      ))}
    </div>
  );
};

const Toast = ({ notification, onClose }: { notification: any, onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div className={`${bgColors[notification.type as keyof typeof bgColors]} text-white px-4 py-3 rounded shadow-lg flex items-center justify-between min-w-[250px]`}>
      <span>{notification.message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        &times;
      </button>
    </div>
  );
};
