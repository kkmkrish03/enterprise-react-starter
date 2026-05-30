import { AuthAdapter, User } from './AuthAdapter';

export class MockAuthAdapter implements AuthAdapter {
  private currentUser: User | null = null;
  private STORAGE_KEY = 'mock_current_user';

  async login(credentials: any): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
          this.currentUser = {
            id: '1',
            email: 'admin@example.com',
            name: 'Admin User',
            roles: ['admin'],
            permissions: ['manage_users', 'manage_tenants', 'manage_config', 'read:all', 'write:all'],
            tenantId: 'default'
          };
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
          resolve(this.currentUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
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
