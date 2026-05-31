import { apiClient } from '../apiClient';
import { getSqliteDb, query } from '../sqliteDb';

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
      const db = await getSqliteDb();
      const rows = query<any>(db, "SELECT * FROM roles");
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        permissions: JSON.parse(r.permissions),
        description: r.description
      }));
    }
    const response = await apiClient.get<RoleDTO[]>('/roles');
    return response.data;
  },

  getPermissions: async (): Promise<string[]> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getSqliteDb();
      const rows = query<any>(db, "SELECT permissions FROM roles");
      const permsSet = new Set<string>();
      rows.forEach(r => {
        try {
          const list = JSON.parse(r.permissions);
          list.forEach((p: string) => permsSet.add(p));
        } catch {
          // ignore parsing error
        }
      });
      return Array.from(permsSet);
    }
    const response = await apiClient.get<string[]>('/permissions');
    return response.data;
  }
};
