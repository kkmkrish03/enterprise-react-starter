import { apiClient } from '../apiClient';
import { getSqliteDb, query, run } from '../sqliteDb';

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
      const db = await getSqliteDb();
      const rows = query<any>(db, "SELECT * FROM tenants");
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        status: r.status as 'ACTIVE' | 'INACTIVE',
        domain: r.domain,
        plan: r.plan as 'ENTERPRISE' | 'PRO' | 'STARTER',
        branding: {
          primaryColor: r.primaryColor,
          logoUrl: r.logoUrl || undefined
        }
      }));
    }
    const response = await apiClient.get<TenantDTO[]>('/tenants');
    return response.data;
  },

  updateTenant: async (id: string, data: Partial<TenantDTO>): Promise<TenantDTO> => {
    if (import.meta.env.VITE_AUTH_MODE !== 'http') {
      await delay(400);
      const db = await getSqliteDb();
      const existing = query<any>(db, "SELECT * FROM tenants WHERE id = ?", [id]);
      if (existing.length === 0) throw new Error('Tenant not found');

      const t = existing[0];
      const name = data.name !== undefined ? data.name : t.name;
      const status = data.status !== undefined ? data.status : t.status;
      const domain = data.domain !== undefined ? data.domain : t.domain;
      const plan = data.plan !== undefined ? data.plan : t.plan;
      const primaryColor = data.branding?.primaryColor !== undefined ? data.branding.primaryColor : t.primaryColor;
      const logoUrl = data.branding?.logoUrl !== undefined ? data.branding.logoUrl : t.logoUrl;

      run(db, "UPDATE tenants SET name = ?, status = ?, domain = ?, plan = ?, primaryColor = ?, logoUrl = ? WHERE id = ?", [
        name, status, domain, plan, primaryColor, logoUrl, id
      ]);

      return {
        id,
        name,
        status: status as 'ACTIVE' | 'INACTIVE',
        domain,
        plan: plan as 'ENTERPRISE' | 'PRO' | 'STARTER',
        branding: {
          primaryColor,
          logoUrl: logoUrl || undefined
        }
      };
    }
    const response = await apiClient.put<TenantDTO>(`/tenants/${id}`, data);
    return response.data;
  }
};
