import { apiClient } from '../apiClient';

export interface RoleDTO {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

export const RoleService = {
  getRoles: async (): Promise<RoleDTO[]> => {
    const response = await apiClient.get<RoleDTO[]>('/roles');
    return response.data;
  },

  getPermissions: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/permissions');
    return response.data;
  }
};
