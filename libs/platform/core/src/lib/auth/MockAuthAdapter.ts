import { AuthAdapter, User } from './AuthAdapter';
import { getSqliteDb, query } from '../api/sqliteDb';

export class MockAuthAdapter implements AuthAdapter {
  private currentUser: User | null = null;
  private STORAGE_KEY = 'mock_current_user';

  async login(credentials: any): Promise<User> {
    const db = await getSqliteDb();
    const existing = query<any>(db, "SELECT * FROM users WHERE email = ?", [credentials.email]);
    
    if (existing.length > 0 && credentials.password === 'password') {
      const u = existing[0];
      const parsedRoles = JSON.parse(u.roles);
      
      this.currentUser = {
        id: u.id,
        email: u.email,
        name: u.name,
        roles: parsedRoles,
        permissions: parsedRoles.includes('super_admin')
          ? ['manage_users', 'manage_tenants', 'manage_config', 'read:all', 'write:all', 'super_admin_access']
          : ['manage_users', 'manage_tenants', 'manage_config', 'read:all', 'write:all'],
        tenantId: u.tenantId
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
      return this.currentUser;
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null;
        localStorage.removeItem(this.STORAGE_KEY);
        resolve();
      }, 200);
    });
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.currentUser) {
          const stored = localStorage.getItem(this.STORAGE_KEY);
          if (stored) {
            try {
              this.currentUser = JSON.parse(stored);
            } catch {
              localStorage.removeItem(this.STORAGE_KEY);
            }
          }
        }
        resolve(this.currentUser);
      }, 200);
    });
  }

  async refreshToken(): Promise<string | null> {
    return "mock-token";
  }
}
