import { apiClient } from '../apiClient';

export interface TenantDTO {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  domain: string;
  plan: 'ENTERPRISE' | 'PRO' | 'STARTER';
  branding: {
    primaryColor: string;
    logoUrl?: string;
  };
}

const SEED_TENANTS: TenantDTO[] = [
  {
    id: 'default',
    name: 'Default Tenant',
    status: 'ACTIVE',
    domain: 'localhost',
    plan: 'ENTERPRISE',
    branding: { primaryColor: '#1976d2' }
  },
  {
    id: 'acme',
    name: 'Acme Corporation',
    status: 'ACTIVE',
    domain: 'acme.localhost',
    plan: 'PRO',
    branding: { primaryColor: '#7b1fa2' }
  },
  {
    id: 'globex',
    name: 'Globex Corp',
    status: 'INACTIVE',
    domain: 'globex.localhost',
    plan: 'STARTER',
    branding: { primaryColor: '#388e3c' }
  }
];

const LOCAL_STORAGE_KEY = 'mock_db_tenants';

const getMockTenants = (): TenantDTO[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_TENANTS));
    return SEED_TENANTS;
  }
  return JSON.parse(stored);
};

const saveMockTenants = (tenants: TenantDTO[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tenants));
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const TenantService = {
  getTenants: async (): Promise<TenantDTO[]> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      return getMockTenants();
    }
    const response = await apiClient.get<TenantDTO[]>('/tenants');
    return response.data;
  },

  updateTenant: async (id: string, data: Partial<TenantDTO>): Promise<TenantDTO> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const tenants = getMockTenants();
      const tenantIndex = tenants.findIndex((t) => t.id === id);
      if (tenantIndex === -1) throw new Error('Tenant not found');

      const updatedTenant = {
        ...tenants[tenantIndex],
        ...data,
        branding: {
          ...tenants[tenantIndex].branding,
          ...data.branding
        }
      };
      tenants[tenantIndex] = updatedTenant;
      saveMockTenants(tenants);
      return updatedTenant;
    }
    const response = await apiClient.put<TenantDTO>(`/tenants/${id}`, data);
    return response.data;
  }
};
