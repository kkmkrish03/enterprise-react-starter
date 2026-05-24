export interface User {
  id: string;
  email: string;
  name?: string;
  roles: string[];
  permissions: string[];
  tenantId: string;
}

export interface AuthAdapter {
  login: (credentials: any) => Promise<User>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  refreshToken: () => Promise<string | null>;
}
