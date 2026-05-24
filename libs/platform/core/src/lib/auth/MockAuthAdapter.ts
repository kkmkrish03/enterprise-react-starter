import { AuthAdapter, User } from './AuthAdapter';

export class MockAuthAdapter implements AuthAdapter {
  private currentUser: User | null = null;

  async login(credentials: any): Promise<User> {
    // Mock login implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
          this.currentUser = {
            id: '1',
            email: 'admin@example.com',
            name: 'Admin User',
            roles: ['admin'],
            permissions: ['read:all', 'write:all'],
            tenantId: 'default'
          };
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
        resolve();
      }, 200);
    });
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.currentUser);
      }, 200);
    });
  }

  async refreshToken(): Promise<string | null> {
    return "mock-token";
  }
}
