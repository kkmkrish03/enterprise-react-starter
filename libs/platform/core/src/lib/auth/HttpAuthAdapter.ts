import { AuthAdapter, User } from './AuthAdapter';
import { apiClient } from '../api/apiClient';

export class HttpAuthAdapter implements AuthAdapter {
  async login(credentials: any): Promise<User> {
    const response = await apiClient.post<{ user: User, token: string }>('/auth/login', credentials);
    
    // Store token in localStorage (or HttpOnly cookies if preferred)
    localStorage.setItem('access_token', response.data.token);
    
    return response.data.user;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('access_token');
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch {
      localStorage.removeItem('access_token');
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const response = await apiClient.post<{ token: string }>('/auth/refresh');
      localStorage.setItem('access_token', response.data.token);
      return response.data.token;
    } catch {
      localStorage.removeItem('access_token');
      return null;
    }
  }
}
