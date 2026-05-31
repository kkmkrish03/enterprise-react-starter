import type { UserDTO } from './services/UserService';
import type { TenantDTO } from './services/TenantService';
import type { RoleDTO } from './services/RoleService';
import type { ConfigDTO } from './services/ConfigService';

export interface MockDbState {
  users: UserDTO[];
  tenants: TenantDTO[];
  roles: RoleDTO[];
  configs: ConfigDTO[];
}

const LOCAL_STORAGE_KEY = 'mock_platform_db';

const initialDbState: MockDbState = {
  users: [
    { id: '1', name: 'Admin User', email: 'admin@example.com', roles: ['admin'], tenantId: 'default', status: 'ACTIVE' },
    { id: '2', name: 'John Doe', email: 'john@example.com', roles: ['user'], tenantId: 'default', status: 'ACTIVE' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', roles: ['user'], tenantId: 'default', status: 'INACTIVE' },
    { id: '4', name: 'Super Admin', email: 'superadmin@example.com', roles: ['super_admin'], tenantId: 'default', status: 'ACTIVE' }
  ],
  tenants: [
    { id: 'default', name: 'Default Tenant', status: 'ACTIVE', domain: 'localhost', plan: 'ENTERPRISE', branding: { primaryColor: '#1976d2', logoUrl: '' } },
    { id: 'acme', name: 'Acme Corporation', status: 'ACTIVE', domain: 'acme.localhost', plan: 'PRO', branding: { primaryColor: '#7b1fa2', logoUrl: '' } },
    { id: 'globex', name: 'Globex Corp', status: 'INACTIVE', domain: 'globex.localhost', plan: 'STARTER', branding: { primaryColor: '#388e3c', logoUrl: '' } }
  ],
  configs: [
    { key: 'ENABLE_MFA', value: true, description: 'Enforces multi-factor authentication for all administrative accounts.', isPublic: true },
    { key: 'MAINTENANCE_MODE', value: false, description: 'Displays a maintenance screen to users and restricts platform access.', isPublic: true },
    { key: 'MAX_USERS_LIMIT', value: 100, description: 'The maximum allowed active users for the current organization plan.', isPublic: false }
  ],
  roles: [
    { id: 'admin', name: 'Administrator', permissions: ['manage_users', 'manage_tenants', 'manage_config', 'read:all', 'write:all'], description: 'Full access to all platform resources and administrative configurations.' },
    { id: 'user', name: 'Standard User', permissions: ['read:all'], description: 'General read-only access to users and dashboards.' }
  ]
};

let memoryDb: MockDbState | null = null;

export async function getMockDb(): Promise<MockDbState> {
  if (memoryDb) return memoryDb;

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      memoryDb = JSON.parse(stored);
      return memoryDb!;
    } catch (e) {
      console.error('Failed to parse stored mock database, recreating...', e);
    }
  }

  // Fallback to seeding
  memoryDb = { ...initialDbState };
  saveMockDb(memoryDb);
  return memoryDb;
}

export function saveMockDb(db: MockDbState): void {
  memoryDb = db;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
}
