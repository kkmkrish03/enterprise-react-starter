import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from '../../../../libs/platform/core/src/lib/auth/AuthContext';
import { HttpAuthAdapter } from '../../../../libs/platform/core/src/lib/auth/HttpAuthAdapter';
import { TenantProvider } from '../../../../libs/platform/core/src/lib/tenant/TenantContext';
import { ThemeProvider } from '../../../../libs/platform/ui/src/lib/theme/ThemeContext';

// Layouts & Global Components
import { DashboardLayout } from '../../../../libs/platform/ui/src/lib/layouts/DashboardLayout';
import { AuthLayout } from '../../../../libs/platform/ui/src/lib/layouts/AuthLayout';
import { NotificationToast } from '../../../../libs/platform/ui/src/lib/components/NotificationToast';
import { NotFoundPage } from '../../../../libs/platform/ui/src/lib/pages/NotFoundPage';

// Features
import { Login } from '../../../../libs/features/auth/src/lib/Login';
import { Dashboard } from '../../../../libs/features/dashboard/src/lib/dashboard';
import { Users } from '../../../../libs/features/users/src/lib/users';
import { Settings } from '../../../../libs/features/settings/src/lib/settings';
import { TenantManagement } from '../../../../libs/features/tenant-management/src/lib/tenant-management';

// Use the real HTTP adapter connecting to the backend
const authAdapter = new HttpAuthAdapter();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

export function App() {
  return (
    <TenantProvider>
      <ThemeProvider>
        <AuthProvider adapter={authAdapter}>
          <NotificationToast />
          <BrowserRouter>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
              </Route>
              
              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/tenants" element={<TenantManagement />} />
              </Route>

              {/* 404 Catch All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TenantProvider>
  );
}

export default App;
