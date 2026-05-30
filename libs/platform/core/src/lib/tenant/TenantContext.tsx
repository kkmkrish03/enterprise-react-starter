import React, { createContext, useContext, useState, useEffect } from 'react';
import { TenantService } from '../api/services/TenantService';

export interface TenantConfig {
  id: string;
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  features: string[];
}

interface TenantContextType {
  tenant: TenantConfig | null;
  isLoading: boolean;
  setTenant: (tenantId: string) => Promise<void>;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const mapPlanToFeatures = (plan: 'ENTERPRISE' | 'PRO' | 'STARTER'): string[] => {
  switch (plan) {
    case 'ENTERPRISE':
      return ['dashboard', 'users', 'tenants', 'settings'];
    case 'PRO':
      return ['dashboard', 'users', 'settings'];
    case 'STARTER':
    default:
      return ['dashboard', 'settings'];
  }
};

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [tenant, setTenantState] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadTenant = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      let tenantId = params.get('tenant');

      if (!tenantId) {
        const host = window.location.hostname;
        if (host !== 'localhost' && host.endsWith('.localhost')) {
          tenantId = host.split('.')[0];
        }
      }

      tenantId = tenantId || 'default';

      const tenants = await TenantService.getTenants();
      const matched = tenants.find(
        (t) =>
          t.id === tenantId ||
          t.domain === tenantId ||
          (tenantId === 'default' && t.id === 'default')
      );

      if (matched) {
        setTenantState({
          id: matched.id,
          name: matched.name,
          logoUrl: matched.branding.logoUrl,
          primaryColor: matched.branding.primaryColor,
          features: mapPlanToFeatures(matched.plan),
        });
      } else {
        setTenantState({
          id: 'default',
          name: 'Default Tenant',
          features: ['dashboard', 'users', 'tenants', 'settings'],
        });
      }
    } catch {
      setTenantState({
        id: 'default',
        name: 'Default Tenant',
        features: ['dashboard', 'users', 'tenants', 'settings'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTenant();
  }, []);

  const setTenant = async (tenantId: string) => {
    setIsLoading(true);
    try {
      const tenants = await TenantService.getTenants();
      const matched = tenants.find((t) => t.id === tenantId);
      if (matched) {
        setTenantState({
          id: matched.id,
          name: matched.name,
          logoUrl: matched.branding.logoUrl,
          primaryColor: matched.branding.primaryColor,
          features: mapPlanToFeatures(matched.plan),
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTenant = async () => {
    if (tenant) {
      const tenants = await TenantService.getTenants();
      const matched = tenants.find((t) => t.id === tenant.id);
      if (matched) {
        setTenantState({
          id: matched.id,
          name: matched.name,
          logoUrl: matched.branding.logoUrl,
          primaryColor: matched.branding.primaryColor,
          features: mapPlanToFeatures(matched.plan),
        });
      }
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, isLoading, setTenant, refreshTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const contextVal = useContext(TenantContext);
  if (!contextVal) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return contextVal;
};
