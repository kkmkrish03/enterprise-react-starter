import { apiClient } from '../apiClient';
import { getSqliteDb, query, run } from '../sqliteDb';

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
      const db = await getSqliteDb();
      const rows = query<any>(db, "SELECT * FROM configs");
      return rows.map(r => {
        let val: any = r.value;
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (val !== null && !isNaN(Number(val))) val = Number(val);

        return {
          key: r.key,
          value: val,
          description: r.description,
          isPublic: r.isPublic === 1
        };
      });
    }
    const response = await apiClient.get<ConfigDTO[]>('/config');
    return response.data;
  },

  updateConfig: async (key: string, value: any): Promise<void> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getSqliteDb();
      const existing = query<any>(db, "SELECT * FROM configs WHERE key = ?", [key]);
      if (existing.length === 0) throw new Error('Config not found');

      run(db, "UPDATE configs SET value = ? WHERE key = ?", [String(value), key]);
      return;
    }
    await apiClient.put(`/config/${key}`, { value });
  }
};
