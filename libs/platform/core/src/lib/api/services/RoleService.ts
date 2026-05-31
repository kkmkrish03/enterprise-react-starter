import { apiClient } from '../apiClient';
import { getMockDb } from '../mockDb';

export interface RoleDTO {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const RoleService = {
  getRoles: async (): Promise<RoleDTO[]> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getMockDb();
      return db.roles;
    }
    const response = await apiClient.get<RoleDTO[]>('/roles');
    return response.data;
  },

  getPermissions: async (): Promise<string[]> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getMockDb();
      const permsSet = new Set<string>();
      db.roles.forEach(r => {
        r.permissions.forEach(p => permsSet.add(p));
      });
      return Array.from(permsSet);
    }
    const response = await apiClient.get<string[]>('/permissions');
    return response.data;
  }
};
