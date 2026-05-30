import React, { useState, useEffect } from 'react';
import { useNotificationStore, TenantService, TenantDTO, RoleGuard, useTenant } from '@bare-bodhika/core';
import { Button, Card, Modal, InputField, SelectField } from '@bare-bodhika/ui';

export const TenantManagement = () => {
  const { refreshTenant } = useTenant();
  const [tenants, setTenants] = useState<TenantDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantDTO | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [plan, setPlan] = useState<'ENTERPRISE' | 'PRO' | 'STARTER'>('STARTER');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [primaryColor, setPrimaryColor] = useState('#1976d2');
  const [submitLoading, setSubmitLoading] = useState(false);

  const addNotification = useNotificationStore(state => state.addNotification);

  const fetchTenants = () => {
    setLoading(true);
    TenantService.getTenants().then(data => {
      setTenants(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleOpenEdit = (tenant: TenantDTO) => {
    setEditingTenant(tenant);
    setName(tenant.name);
    setDomain(tenant.domain);
    setPlan(tenant.plan);
    setStatus(tenant.status);
    setPrimaryColor(tenant.branding.primaryColor);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;
    setSubmitLoading(true);
    try {
      await TenantService.updateTenant(editingTenant.id, {
        name,
        domain,
        plan,
        status,
        branding: {
          primaryColor
        }
      });
      await refreshTenant();
      addNotification({ type: 'success', message: 'Tenant configuration updated successfully!' });
      setModalOpen(false);
      fetchTenants();
    } catch {
      addNotification({ type: 'error', message: 'Failed to update tenant.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Tenant Multi-Tenancy</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure white-labeling, brand colors, domains, and service plans.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card isLoading={true} />
          <Card isLoading={true} />
          <Card isLoading={true} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map(tenant => (
            <Card
              key={tenant.id}
              title={tenant.name}
              headerActions={
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                  ${tenant.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }
                `}>
                  {tenant.status}
                </span>
              }
              elevation="sm"
              className="flex flex-col h-full justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b dark:border-gray-700 pb-2">
                  <span className="text-xs text-gray-400 font-medium uppercase">Domain</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{tenant.domain}</span>
                </div>
                <div className="flex items-center justify-between border-b dark:border-gray-700 pb-2">
                  <span className="text-xs text-gray-400 font-medium uppercase">Service Plan</span>
                  <span className="text-sm font-bold text-primary capitalize">{tenant.plan}</span>
                </div>
                <div className="flex items-center justify-between border-b dark:border-gray-700 pb-2">
                  <span className="text-xs text-gray-400 font-medium uppercase">Primary Branding</span>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600" style={{ backgroundColor: tenant.branding.primaryColor }} />
                    <span className="text-xs font-mono">{tenant.branding.primaryColor}</span>
                  </div>
                </div>

                <RoleGuard allowedPermissions={['manage_tenants']} fallback={<p className="text-xs text-gray-400 italic text-center mt-4">Read-only view</p>}>
                  <Button
                    onClick={() => handleOpenEdit(tenant)}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    Manage Configuration
                  </Button>
                </RoleGuard>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Edit Tenant: ${editingTenant?.name}`}
        footerActions={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={submitLoading}>
              Save Config
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Tenant Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            label="Domain Binding"
            required
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Service Plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value as 'ENTERPRISE' | 'PRO' | 'STARTER')}
              options={[
                { value: 'STARTER', label: 'Starter' },
                { value: 'PRO', label: 'Pro' },
                { value: 'ENTERPRISE', label: 'Enterprise' }
              ]}
            />
            <SelectField
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' }
              ]}
            />
          </div>
          <InputField
            label="Brand Color (HEX)"
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="h-14"
          />
        </form>
      </Modal>
    </div>
  );
};
export default TenantManagement;
