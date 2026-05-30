import { apiClient } from '../apiClient';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  roles: string[];
  tenantId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const SEED_USERS: UserDTO[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', roles: ['admin'], tenantId: 'default', status: 'ACTIVE' },
  { id: '2', name: 'John Doe', email: 'john@example.com', roles: ['user'], tenantId: 'default', status: 'ACTIVE' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', roles: ['user'], tenantId: 'default', status: 'INACTIVE' },
];

const LOCAL_STORAGE_KEY = 'mock_db_users';

const getMockUsers = (): UserDTO[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_USERS));
    return SEED_USERS;
  }
  return JSON.parse(stored);
};

const saveMockUsers = (users: UserDTO[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const UserService = {
  getUsers: async (): Promise<UserDTO[]> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      return getMockUsers();
    }
    const response = await apiClient.get<UserDTO[]>('/users');
    return response.data;
  },
  
  createUser: async (data: Partial<UserDTO>): Promise<UserDTO> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const users = getMockUsers();
      const newUser: UserDTO = {
        id: Math.random().toString(36).substring(7),
        name: data.name || 'New User',
        email: data.email || '',
        roles: data.roles || ['user'],
        tenantId: data.tenantId || 'default',
        status: data.status || 'ACTIVE',
      };
      users.push(newUser);
      saveMockUsers(users);
      return newUser;
    }
    const response = await apiClient.post<UserDTO>('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<UserDTO>): Promise<UserDTO> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const users = getMockUsers();
      const userIndex = users.findIndex((u) => u.id === id);
      if (userIndex === -1) throw new Error('User not found');
      
      const updatedUser = {
        ...users[userIndex],
        ...data,
      };
      users[userIndex] = updatedUser;
      saveMockUsers(users);
      return updatedUser;
    }
    const response = await apiClient.put<UserDTO>(`/users/${id}`, data);
    return response.data;
  }
};
