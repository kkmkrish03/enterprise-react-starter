import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [tenant, setTenantState] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this might come from the domain name or initial load
    // Mocking an initial load
    setTimeout(() => {
      setTenantState({
        id: 'default',
        name: 'Default Tenant',
        features: ['dashboard', 'users']
      });
      setIsLoading(false);
    }, 500);
  }, []);

  const setTenant = async (tenantId: string) => {
    setIsLoading(true);
    // Mock fetch tenant config
    const config: TenantConfig = {
      id: tenantId,
      name: `Tenant ${tenantId}`,
      features: ['dashboard', 'settings']
    };
    setTenantState(config);
    setIsLoading(false);
  };

  return (
    <TenantContext.Provider value={{ tenant, isLoading, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
