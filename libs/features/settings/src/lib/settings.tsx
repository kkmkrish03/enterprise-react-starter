import { useState, useEffect } from 'react';
import { useTheme, Card, ThemeToggle, InputField } from '@bare-bodhika/ui';
import { useNotificationStore, ConfigService, ConfigDTO, RoleGuard } from '@bare-bodhika/core';

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
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure user interface styles, brand colors, and feature parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <Card title="Branding & Preferences" subtitle="Customize UI colors and light/dark theme modes.">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Primary Brand Color
              </label>
              <div className="flex space-x-3">
                {colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => handleColorChange(color.hex)}
                    className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-200 dark:border-gray-600 transition-transform active:scale-90"
                    style={{ backgroundColor: color.hex, outlineColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-450 dark:text-gray-400">
                Select a color to preview dynamic white-labeling across the platform.
              </p>
            </div>

            <div className="border-t border-gray-150 dark:border-gray-700 pt-4 flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Active Mode
                </label>
                <p className="text-xs text-gray-450 dark:text-gray-400 mt-1">Switch between light and dark display modes.</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </Card>

        {/* System Configuration */}
        <Card title="System Parameters" subtitle="Adjust operational flags for the platform environment.">
          {loading ? (
             <div className="text-gray-500 text-sm">Loading configurations...</div>
          ) : (
            <div className="space-y-6">
              {configs.map(config => (
                <div key={config.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {config.key}
                      {!config.isPublic && <span className="inline-block bg-red-100/60 dark:bg-red-950/20 text-red-700 dark:text-red-300 text-[10px] px-1.5 py-0.5 rounded font-bold">Private</span>}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal pr-4">{config.description}</p>
                  </div>
                  
                  <RoleGuard allowedPermissions={['manage_config']} fallback={<span className="text-gray-400 text-xs italic">Read-only</span>}>
                    {typeof config.value === 'boolean' ? (
                      <button 
                        onClick={() => handleToggle(config.key, config.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${config.value ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                        style={{ backgroundColor: config.value ? 'var(--primary-color)' : undefined }}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.value ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    ) : (
                      <InputField 
                        type="text" 
                        readOnly 
                        value={config.value as string} 
                        className="w-24" 
                      />
                    )}
                  </RoleGuard>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
export default Settings;
