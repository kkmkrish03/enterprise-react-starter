import React, { useState, useEffect } from 'react';
import { useNotificationStore } from '../../../../platform/core/src/lib/store/notificationStore';
import { TenantService, TenantDTO } from '../../../../platform/core/src/lib/api/services/TenantService';
import { RoleGuard } from '../../../../platform/core/src/lib/auth/RoleGuard';

export const TenantManagement = () => {
  const [tenants, setTenants] = useState<TenantDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const addNotification = useNotificationStore(state => state.addNotification);

  useEffect(() => {
    TenantService.getTenants().then(data => {
      setTenants(data);
      setLoading(false);
    });
  }, []);

  const handleManage = (tenant: TenantDTO) => {
    addNotification({ type: 'info', message: `Managing tenant: ${tenant.name}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tenant Management</h1>
        <RoleGuard allowedPermissions={['manage_tenants']}>
          <button 
            className="px-4 py-2 text-white rounded bg-primary hover:bg-opacity-90 transition-colors"
            style={{ backgroundColor: 'var(--primary-color)' }}
            onClick={() => addNotification({ type: 'success', message: 'New tenant creation started.' })}
          >
            Create Tenant
          </button>
        </RoleGuard>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading tenants from API...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map(tenant => (
            <div key={tenant.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tenant.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {tenant.status}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-2">Domain: {tenant.domain}</p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Plan: {tenant.plan}</p>
              
              <RoleGuard allowedPermissions={['manage_tenants']} fallback={<p className="text-sm text-gray-400 italic mt-4">Read-only view</p>}>
                <button 
                  onClick={() => handleManage(tenant)}
                  className="w-full py-2 border border-primary text-primary rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                >
                  Manage Configuration
                </button>
              </RoleGuard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
