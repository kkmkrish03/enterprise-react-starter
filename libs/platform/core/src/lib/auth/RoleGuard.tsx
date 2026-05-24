import React from 'react';
import { useAuth } from './AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  allowedPermissions?: string[];
  fallback?: React.ReactNode;
}

/**
 * RoleGuard prevents rendering of its children if the current user
 * does not possess the required roles or permissions.
 */
export const RoleGuard = ({ 
  children, 
  allowedRoles = [], 
  allowedPermissions = [], 
  fallback = null 
}: RoleGuardProps) => {
  const { user } = useAuth();

  if (!user) return <>{fallback}</>;

  // Check if user has at least one of the allowed roles (if roles are specified)
  const hasRole = allowedRoles.length === 0 || 
    allowedRoles.some(role => user.roles.includes(role));

  // Check if user has at least one of the allowed permissions (if permissions are specified)
  const hasPermission = allowedPermissions.length === 0 || 
    allowedPermissions.some(permission => user.permissions.includes(permission));

  if (hasRole && hasPermission) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
