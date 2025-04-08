
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthContextType, User } from './AuthTypes';
import { toast } from 'sonner';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false, // Changed from true to false
  isAuthenticated: true, // Changed from false to true
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Create a default user for testing
  const defaultUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'admin',
    firstName: 'Test',
    lastName: 'User',
  };

  const [user, setUser] = useState<User | null>(defaultUser);
  const [loading, setLoading] = useState<boolean>(false); // Set to false to prevent loading state

  // Skip the authentication checks for now
  useEffect(() => {
    console.log('Auth provider initialized with test user');
    // No authentication checks, just use the default user
  }, []);

  // Mock authentication methods
  const signIn = async (email: string, password: string) => {
    console.log('Mock sign in with:', email);
    toast.success('Signed in with test account');
    return { user: defaultUser };
  };

  const signUp = async (email: string, password: string, name: string) => {
    console.log('Mock sign up with:', email, name);
    toast.success('Account created successfully');
    return { user: defaultUser };
  };

  const signOut = async () => {
    console.log('Mock sign out');
    toast.success('Signed out successfully');
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    console.log('Mock update user profile:', userData);
    setUser(prev => prev ? { ...prev, ...userData } : null);
    toast.success('Profile updated successfully');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading: false, // Always set to false 
        isAuthenticated: true, // Always set to true
        signIn, 
        signUp, 
        signOut, 
        updateUserProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
