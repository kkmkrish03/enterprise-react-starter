import { Outlet, Link } from 'react-router';
import { useTheme } from '../theme/ThemeContext';
import { useTenant, useAuth } from '@bare-bodhika/core';
import { ThemeToggle } from '../components/ThemeToggle';
import { Button } from '../components/Button';

export const DashboardLayout = () => {
  const { mode } = useTheme();
  const { tenant } = useTenant();
  const { user, logout } = useAuth();

  return (
    <div className={`min-h-screen flex ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-center items-center">
          <h1 className="text-xl font-bold text-primary" style={{ color: 'var(--primary-color)' }}>{tenant?.name || 'Platform'}</h1>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</Link>
          <Link to="/users" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Users</Link>
          <Link to="/tenants" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Tenants</Link>
          <Link to="/settings" className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Settings</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-sm">Welcome, {user?.name || 'User'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              variant="text" 
              size="sm" 
              onClick={logout} 
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
