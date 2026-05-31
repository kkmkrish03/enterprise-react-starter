import { apiClient } from '../apiClient';
import { getMockDb, saveMockDb } from '../mockDb';

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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const TenantService = {
  getTenants: async (): Promise<TenantDTO[]> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getMockDb();
      return db.tenants;
    }
    const response = await apiClient.get<TenantDTO[]>('/tenants');
    return response.data;
  },

  updateTenant: async (id: string, data: Partial<TenantDTO>): Promise<TenantDTO> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getMockDb();
      const tenantIndex = db.tenants.findIndex(t => t.id === id);
      if (tenantIndex === -1) throw new Error('Tenant not found');

      const t = db.tenants[tenantIndex];
      const updatedTenant: TenantDTO = {
        id,
        name: data.name !== undefined ? data.name : t.name,
        status: data.status !== undefined ? data.status : t.status,
        domain: data.domain !== undefined ? data.domain : t.domain,
        plan: data.plan !== undefined ? data.plan : t.plan,
        branding: {
          primaryColor: data.branding?.primaryColor !== undefined ? data.branding.primaryColor : t.branding.primaryColor,
          logoUrl: data.branding?.logoUrl !== undefined ? data.branding.logoUrl : t.branding.logoUrl
        }
      };

      db.tenants[tenantIndex] = updatedTenant;
      saveMockDb(db);

      return updatedTenant;
    }
    const response = await apiClient.put<TenantDTO>(`/tenants/${id}`, data);
    return response.data;
  }
};
