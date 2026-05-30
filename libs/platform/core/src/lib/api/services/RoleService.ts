import { apiClient } from '../apiClient';

export interface RoleDTO {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

const SEED_ROLES: RoleDTO[] = [
  {
    id: 'admin',
    name: 'Administrator',
    permissions: ['manage_users', 'manage_tenants', 'manage_config', 'read:all', 'write:all'],
    description: 'Full access to all platform resources and administrative configurations.'
  },
  {
    id: 'user',
    name: 'Standard User',
    permissions: ['read:all'],
    description: 'General read-only access to users and dashboards.'
  }
];

const SEED_PERMISSIONS = ['manage_users', 'manage_tenants', 'manage_config', 'read:all', 'write:all'];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const RoleService = {
  getRoles: async (): Promise<RoleDTO[]> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      return SEED_ROLES;
    }
    const response = await apiClient.get<RoleDTO[]>('/roles');
    return response.data;
  },

  getPermissions: async (): Promise<string[]> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      return SEED_PERMISSIONS;
    }
    const response = await apiClient.get<string[]>('/permissions');
    return response.data;
  }
};
