import { apiClient } from '../apiClient';
import { getSqliteDb, query, run } from '../sqliteDb';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  roles: string[];
  tenantId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const UserService = {
  getUsers: async (): Promise<UserDTO[]> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getSqliteDb();
      const rows = query<any>(db, "SELECT * FROM users");
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        roles: JSON.parse(r.roles),
        tenantId: r.tenantId,
        status: r.status as 'ACTIVE' | 'INACTIVE'
      }));
    }
    const response = await apiClient.get<UserDTO[]>('/users');
    return response.data;
  },
  
  createUser: async (data: Partial<UserDTO>): Promise<UserDTO> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getSqliteDb();
      const newId = Math.random().toString(36).substring(7);
      const name = data.name || 'New User';
      const email = data.email || '';
      const roles = data.roles || ['user'];
      const tenantId = data.tenantId || 'default';
      const status = data.status || 'ACTIVE';

      run(db, "INSERT INTO users (id, name, email, roles, tenantId, status) VALUES (?, ?, ?, ?, ?, ?)", [
        newId, name, email, JSON.stringify(roles), tenantId, status
      ]);

      return {
        id: newId,
        name,
        email,
        roles,
        tenantId,
        status
      };
    }
    const response = await apiClient.post<UserDTO>('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<UserDTO>): Promise<UserDTO> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getSqliteDb();
      const existing = query<any>(db, "SELECT * FROM users WHERE id = ?", [id]);
      if (existing.length === 0) throw new Error('User not found');
      
      const u = existing[0];
      const name = data.name !== undefined ? data.name : u.name;
      const email = data.email !== undefined ? data.email : u.email;
      const roles = data.roles !== undefined ? data.roles : JSON.parse(u.roles);
      const tenantId = data.tenantId !== undefined ? data.tenantId : u.tenantId;
      const status = data.status !== undefined ? data.status : u.status;

      run(db, "UPDATE users SET name = ?, email = ?, roles = ?, tenantId = ?, status = ? WHERE id = ?", [
        name, email, JSON.stringify(roles), tenantId, status, id
      ]);

      return {
        id,
        name,
        email,
        roles,
        tenantId,
        status: status as 'ACTIVE' | 'INACTIVE'
      };
    }
    const response = await apiClient.put<UserDTO>(`/users/${id}`, data);
    return response.data;
  }
};
