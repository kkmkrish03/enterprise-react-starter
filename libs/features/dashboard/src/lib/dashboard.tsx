import React from 'react';
import { useTenant } from '../../../../platform/core/src/lib/tenant/TenantContext';

export const Dashboard = () => {
  const { tenant } = useTenant();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">1,234</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Sessions</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">423</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tenant Features</h3>
          <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
            {tenant?.features?.length || 0} Enabled
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between border-b dark:border-gray-700 pb-4 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">User action {i}</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Success</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
