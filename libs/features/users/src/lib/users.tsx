import React, { useState, useEffect } from 'react';
import { useNotificationStore, UserService, UserDTO, RoleGuard } from '@bare-bodhika/core';
import { Button, Card, DataTable, Modal, InputField, ColumnConfig, SelectField } from '@bare-bodhika/ui';

export const Users = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState('user');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [submitLoading, setSubmitLoading] = useState(false);

  const addNotification = useNotificationStore(state => state.addNotification);

  const fetchUsers = () => {
    setLoading(true);
    UserService.getUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenInvite = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRoles('user');
    setStatus('ACTIVE');
    setModalOpen(true);
  };

  const handleOpenEdit = (user: UserDTO) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRoles(user.roles[0] || 'user');
    setStatus(user.status);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (editingUser) {
        await UserService.updateUser(editingUser.id, {
          name,
          email,
          roles: [roles],
          status
        });
        addNotification({ type: 'success', message: 'User updated successfully!' });
      } else {
        await UserService.createUser({
          name,
          email,
          roles: [roles],
          status,
          tenantId: 'default'
        });
        addNotification({ type: 'success', message: 'User invited successfully!' });
      }
      setModalOpen(false);
      fetchUsers();
    } catch {
      addNotification({ type: 'error', message: 'Operation failed.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns: ColumnConfig<UserDTO>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (row) => (
        <div className="flex gap-1">
          {row.roles.map(role => (
            <span key={role} className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded font-medium capitalize">
              {role}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
          ${row.status === 'ACTIVE'
            ? 'bg-green-150 text-green-800 dark:bg-green-900/20 dark:text-green-300'
            : 'bg-red-150 text-red-800 dark:bg-red-900/20 dark:text-red-300'
          }
        `}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <RoleGuard allowedPermissions={['manage_users']} fallback={<span className="text-gray-400 cursor-not-allowed text-xs">Read Only</span>}>
          <Button
            variant="text"
            size="sm"
            onClick={() => handleOpenEdit(row)}
            className="text-primary font-semibold hover:underline"
          >
            Edit
          </Button>
        </RoleGuard>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Users Directory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage corporate system access and permissions.</p>
        </div>
        <RoleGuard allowedPermissions={['manage_users']}>
          <Button
            onClick={handleOpenInvite}
            startIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Invite User
          </Button>
        </RoleGuard>
      </div>

      <Card elevation="sm" className="overflow-hidden">
        <DataTable
          columns={columns}
          data={users}
          isLoading={loading}
          emptyMessage="No users found."
        />
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Edit User Configuration' : 'Invite New Team Member'}
        footerActions={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={submitLoading}>
              {editingUser ? 'Save Changes' : 'Send Invitation'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            required
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            label="Email Address"
            type="email"
            required
            placeholder="john.doe@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Role"
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
              options={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Administrator' }
              ]}
            />
            <SelectField
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
              options={[
                { value: 'ACTIVE', label: 'ACTIVE' },
                { value: 'INACTIVE', label: 'INACTIVE' }
              ]}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Users;
