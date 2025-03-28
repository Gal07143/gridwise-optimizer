
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

  const signIn = async (email: string, password: string): Promise<void> => {
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
    } catch (error) {
      console.error('Error signing in:', error);
      throw error; // Re-throw the error so it can be caught by the caller
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>): Promise<void> => {
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
    } catch (error) {
      console.error('Error signing up:', error);
      throw error; // Re-throw the error so it can be caught by the caller
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Mock sign out
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error; // Re-throw the error so it can be caught by the caller
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
