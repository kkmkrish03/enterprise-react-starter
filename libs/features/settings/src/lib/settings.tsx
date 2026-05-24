import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../platform/ui/src/lib/theme/ThemeContext';
import { useNotificationStore } from '../../../../platform/core/src/lib/store/notificationStore';
import { ConfigService, ConfigDTO } from '../../../../platform/core/src/lib/api/services/ConfigService';
import { RoleGuard } from '../../../../platform/core/src/lib/auth/RoleGuard';

export const Settings = () => {
  const { setPrimaryColor } = useTheme();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [configs, setConfigs] = useState<ConfigDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ConfigService.getConfigs().then(data => {
      setConfigs(data);
      setLoading(false);
    });
  }, []);

  const handleToggle = (key: string, currentValue: boolean) => {
    // Optimistic UI update
    setConfigs(prev => prev.map(c => c.key === key ? { ...c, value: !currentValue } : c));
    ConfigService.updateConfig(key, !currentValue).then(() => {
      addNotification({ type: 'success', message: `Configuration ${key} updated.` });
    });
  };

  const colors = [
    { name: 'Blue (Default)', hex: '#1976d2' },
    { name: 'Purple', hex: '#7b1fa2' },
    { name: 'Green', hex: '#388e3c' },
    { name: 'Orange', hex: '#f57c00' },
  ];

  const handleColorChange = (hex: string) => {
    setPrimaryColor(hex);
    addNotification({ type: 'success', message: 'Theme color updated globally!' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">System Configuration & Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Branding Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Brand Color
              </label>
              <div className="flex space-x-4">
                {colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => handleColorChange(color.hex)}
                    className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-200 dark:border-gray-600"
                    style={{ backgroundColor: color.hex, outlineColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Select a color to preview dynamic white-labeling across the platform.
              </p>
            </div>
          </div>
        </div>

        {/* System Configuration */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">System Parameters</h2>
          
          {loading ? (
             <div className="text-gray-500 text-sm">Loading configurations...</div>
          ) : (
            <div className="space-y-6">
              {configs.map(config => (
                <div key={config.key} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{config.key}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{config.description}</p>
                    {!config.isPublic && <span className="inline-block mt-1 bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded">Private</span>}
                  </div>
                  
                  <RoleGuard allowedPermissions={['manage_config']} fallback={<span className="text-gray-400 text-sm">Read-only</span>}>
                    {typeof config.value === 'boolean' ? (
                      <button 
                        onClick={() => handleToggle(config.key, config.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${config.value ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                        style={{ backgroundColor: config.value ? 'var(--primary-color)' : undefined }}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.value ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    ) : (
                      <input 
                        type="text" 
                        readOnly 
                        value={config.value} 
                        className="block w-24 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm sm:text-sm p-2 border" 
                      />
                    )}
                  </RoleGuard>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
