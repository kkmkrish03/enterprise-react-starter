import { apiClient } from '../apiClient';

export interface ConfigDTO {
  key: string;
  value: any;
  description: string;
  isPublic: boolean;
}

export const ConfigService = {
  getConfigs: async (): Promise<ConfigDTO[]> => {
    const response = await apiClient.get<ConfigDTO[]>('/config');
    return response.data;
  },

  updateConfig: async (key: string, value: any): Promise<void> => {
    await apiClient.put(`/config/${key}`, { value });
  }
};
