import { apiClient } from '../apiClient';
import { getMockDb, saveMockDb } from '../mockDb';

export interface ConfigDTO {
  key: string;
  value: any;
  description: string;
  isPublic: boolean;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ConfigService = {
  getConfigs: async (): Promise<ConfigDTO[]> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getMockDb();
      return db.configs;
    }
    const response = await apiClient.get<ConfigDTO[]>('/config');
    return response.data;
  },

  updateConfig: async (key: string, value: any): Promise<void> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getMockDb();
      const configIndex = db.configs.findIndex(c => c.key === key);
      if (configIndex === -1) throw new Error('Config not found');

      db.configs[configIndex].value = value;
      saveMockDb(db);
      return;
    }
    await apiClient.put(`/config/${key}`, { value });
  }
};
