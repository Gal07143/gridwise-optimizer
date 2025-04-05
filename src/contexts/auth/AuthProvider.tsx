
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, User } from './AuthTypes';
import { toast } from 'sonner';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for active session on initial load
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }

      if (data.user) {
        // In a real scenario we would fetch user profile from a profiles table
        // with the matching user ID from auth.users
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          role: 'admin', // Mock role for demo purposes
          firstName: 'Demo',
          lastName: 'User',
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email, password });
      
      if (error) throw error;

      // Simulate successful sign-in for demo
      const userData: User = {
        id: 'mock-user-id',
        email: email,
        role: 'admin',
        firstName: email.split('@')[0],
        lastName: 'User',
      };
      
      setUser(userData);
      toast.success('Successfully signed in');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(`Error signing in: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Simulate the name split into first and last name
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName,
            lastName
          }
        }
      });
      
      if (error) throw error;
      
      // In a real implementation, we'd wait for email verification
      toast.success('Please check your email to verify your account');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(`Error signing up: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      toast.success('Successfully signed out');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(`Error signing out: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      
      if (!user) throw new Error('No user is currently logged in');
      
      // Update the user data
      // In a real app, we would save this to the profiles table
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Error updating profile: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
