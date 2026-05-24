import { apiClient } from '../apiClient';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  roles: string[];
  tenantId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const UserService = {
  getUsers: async (): Promise<UserDTO[]> => {
    const response = await apiClient.get<UserDTO[]>('/users');
    return response.data;
  },
  
  createUser: async (data: Partial<UserDTO>): Promise<UserDTO> => {
    const response = await apiClient.post<UserDTO>('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<UserDTO>): Promise<UserDTO> => {
    const response = await apiClient.put<UserDTO>(`/users/${id}`, data);
    return response.data;
  }
};
