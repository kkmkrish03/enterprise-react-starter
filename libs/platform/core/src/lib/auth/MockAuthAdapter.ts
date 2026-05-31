import { AuthAdapter, User } from './AuthAdapter';
import { getMockDb } from '../api/mockDb';

export class MockAuthAdapter implements AuthAdapter {
  private currentUser: User | null = null;
  private STORAGE_KEY = 'mock_current_user';

  async login(credentials: any): Promise<User> {
    const db = await getMockDb();
    const matched = db.users.find(u => u.email === credentials.email);
    
    if (matched && credentials.password === 'password') {
      const parsedRoles = matched.roles;
      
      this.currentUser = {
        id: matched.id,
        email: matched.email,
        name: matched.name,
        roles: parsedRoles,
        permissions: parsedRoles.includes('super_admin')
          ? ['manage_users', 'manage_tenants', 'manage_config', 'read:all', 'write:all', 'super_admin_access']
          : ['manage_users', 'manage_tenants', 'manage_config', 'read:all', 'write:all'],
        tenantId: matched.tenantId
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
