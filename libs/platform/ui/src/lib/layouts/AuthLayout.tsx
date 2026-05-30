import { Outlet } from 'react-router';
import { useTheme } from '../theme/ThemeContext';
import { useTenant } from '@bare-bodhika/core';

export const AuthLayout = () => {
  const { mode } = useTheme();
  const { tenant } = useTenant();

  return (
    <div className={`min-h-screen flex items-center justify-center ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-primary">
            {tenant?.name || 'Welcome'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
