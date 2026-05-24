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

export const TenantService = {
  getTenants: async (): Promise<TenantDTO[]> => {
    const response = await apiClient.get<TenantDTO[]>('/tenants');
    return response.data;
  },

  updateTenant: async (id: string, data: Partial<TenantDTO>): Promise<TenantDTO> => {
    const response = await apiClient.put<TenantDTO>(`/tenants/${id}`, data);
    return response.data;
  }
};
