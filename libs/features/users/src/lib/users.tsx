import React, { useState, useEffect } from 'react';
import { useNotificationStore } from '../../../../platform/core/src/lib/store/notificationStore';
import { UserService, UserDTO } from '../../../../platform/core/src/lib/api/services/UserService';
import { RoleGuard } from '../../../../platform/core/src/lib/auth/RoleGuard';

export const Users = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const addNotification = useNotificationStore(state => state.addNotification);

  useEffect(() => {
    UserService.getUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const handleEdit = (user: UserDTO) => {
    addNotification({ type: 'info', message: `Editing user: ${user.name}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <RoleGuard allowedPermissions={['manage_users']}>
          <button 
            className="px-4 py-2 text-white rounded bg-primary hover:bg-opacity-90 transition-colors"
            style={{ backgroundColor: 'var(--primary-color)' }}
            onClick={() => addNotification({ type: 'success', message: 'User invited successfully!' })}
          >
            Invite User
          </button>
        </RoleGuard>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users from API...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.roles.map(role => (
                      <span key={role} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1">
                        {role}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <RoleGuard allowedPermissions={['manage_users']} fallback={<span className="text-gray-400 cursor-not-allowed">Edit</span>}>
                      <button onClick={() => handleEdit(user)} className="text-primary hover:text-opacity-80" style={{ color: 'var(--primary-color)' }}>Edit</button>
                    </RoleGuard>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
