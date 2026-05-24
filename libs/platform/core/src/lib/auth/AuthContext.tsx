import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthAdapter } from './AuthAdapter';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ 
  children, 
  adapter 
}: { 
  children: React.ReactNode; 
  adapter: AuthAdapter;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adapter.getCurrentUser()
      .then(user => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, [adapter]);

  const login = async (credentials: any) => {
    const user = await adapter.login(credentials);
    setUser(user);
  };

  const logout = async () => {
    await adapter.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
