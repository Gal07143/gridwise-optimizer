
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer' | 'installer';
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock authentication check
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Mock authentication
      const mockUser: User = {
        id: '123',
        email,
        role: 'admin',
        firstName: 'Demo',
        lastName: 'User',
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { user: null, error };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      // Mock user creation
      const mockUser: User = {
        id: '123',
        email,
        role: userData.role || 'viewer',
        firstName: userData.firstName,
        lastName: userData.lastName,
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { user: mockUser, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { user: null, error };
    }
  };

  const signOut = async () => {
    try {
      // Mock sign out
      setUser(null);
      localStorage.removeItem('user');
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
