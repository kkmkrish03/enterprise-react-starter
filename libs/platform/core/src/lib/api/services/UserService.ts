import { apiClient } from '../apiClient';
import { getMockDb, saveMockDb } from '../mockDb';

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
      const db = await getMockDb();
      return db.users;
    }
    const response = await apiClient.get<UserDTO[]>('/users');
    return response.data;
  },
  
  createUser: async (data: Partial<UserDTO>): Promise<UserDTO> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getMockDb();
      const newId = Math.random().toString(36).substring(7);
      const name = data.name || 'New User';
      const email = data.email || '';
      const roles = data.roles || ['user'];
      const tenantId = data.tenantId || 'default';
      const status = data.status || 'ACTIVE';

      const newUser: UserDTO = {
        id: newId,
        name,
        email,
        roles,
        tenantId,
        status
      };

      db.users.push(newUser);
      saveMockDb(db);

      return newUser;
    }
    const response = await apiClient.post<UserDTO>('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<UserDTO>): Promise<UserDTO> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getMockDb();
      const userIndex = db.users.findIndex(u => u.id === id);
      if (userIndex === -1) throw new Error('User not found');
      
      const u = db.users[userIndex];
      const updatedUser: UserDTO = {
        id,
        name: data.name !== undefined ? data.name : u.name,
        email: data.email !== undefined ? data.email : u.email,
        roles: data.roles !== undefined ? data.roles : u.roles,
        tenantId: data.tenantId !== undefined ? data.tenantId : u.tenantId,
        status: data.status !== undefined ? data.status : u.status
      };

      db.users[userIndex] = updatedUser;
      saveMockDb(db);

      return updatedUser;
    }
    const response = await apiClient.put<UserDTO>(`/users/${id}`, data);
    return response.data;
  }
};

