import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth, HttpAuthAdapter, MockAuthAdapter, TenantProvider } from '@bare-bodhika/core';
import { ThemeProvider, DashboardLayout, AuthLayout, NotificationToast, NotFoundPage, LoadingSpinner, ErrorBoundary } from '@bare-bodhika/ui';

// Features
import { Login } from '@bare-bodhika/auth';
import { Dashboard } from '@bare-bodhika/dashboard';
import { Users } from '@bare-bodhika/users';
import { Settings } from '@bare-bodhika/settings';
import { TenantManagement } from '@bare-bodhika/tenant-management';
import { PreflightTest, ComponentsCatalog } from '@bare-bodhika/preflight-test';

// Use the dynamic auth adapter based on environment variable
const authAdapter = import.meta.env.VITE_AUTH_MODE === 'http'
  ? new HttpAuthAdapter()
  : new MockAuthAdapter();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  
  return children as React.JSX.Element;
};

const SuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  if (!user.roles.includes('super_admin')) return <Navigate to="/" />;
  
  return children as React.JSX.Element;
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
                <Route path="/" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                <Route path="/users" element={<ErrorBoundary><Users /></ErrorBoundary>} />
                <Route path="/settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
                <Route path="/tenants" element={<ErrorBoundary><TenantManagement /></ErrorBoundary>} />
                <Route path="/preflight" element={<SuperAdminRoute><ErrorBoundary><PreflightTest /></ErrorBoundary></SuperAdminRoute>} />
                <Route path="/components" element={<SuperAdminRoute><ErrorBoundary><ComponentsCatalog /></ErrorBoundary></SuperAdminRoute>} />
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
