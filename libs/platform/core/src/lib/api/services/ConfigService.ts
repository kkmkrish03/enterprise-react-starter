import { apiClient } from '../apiClient';

export interface ConfigDTO {
  key: string;
  value: any;
  description: string;
  isPublic: boolean;
}

const SEED_CONFIGS: ConfigDTO[] = [
  {
    key: 'ENABLE_MFA',
    value: true,
    description: 'Enforces multi-factor authentication for all administrative accounts.',
    isPublic: true
  },
  {
    key: 'MAINTENANCE_MODE',
    value: false,
    description: 'Displays a maintenance screen to users and restricts platform access.',
    isPublic: true
  },
  {
    key: 'MAX_USERS_LIMIT',
    value: 100,
    description: 'The maximum allowed active users for the current organization plan.',
    isPublic: false
  }
];

const LOCAL_STORAGE_KEY = 'mock_db_configs';

const getMockConfigs = (): ConfigDTO[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_CONFIGS));
    return SEED_CONFIGS;
  }
  return JSON.parse(stored);
};

const saveMockConfigs = (configs: ConfigDTO[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(configs));
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ConfigService = {
  getConfigs: async (): Promise<ConfigDTO[]> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      return getMockConfigs();
    }
    const response = await apiClient.get<ConfigDTO[]>('/config');
    return response.data;
  },

  updateConfig: async (key: string, value: any): Promise<void> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const configs = getMockConfigs();
      const configIndex = configs.findIndex((c) => c.key === key);
      if (configIndex === -1) throw new Error('Config not found');

      configs[configIndex].value = value;
      saveMockConfigs(configs);
      return;
    }
    await apiClient.put(`/config/${key}`, { value });
  }
};
