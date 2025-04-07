
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthContextType, User } from './AuthTypes';
import { toast } from 'sonner';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  signIn: async () => undefined,
  signUp: async () => undefined,
  signOut: async () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Initialize the auth state
  useEffect(() => {
    // Set up auth state listener FIRST to catch any auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin', // We'll fetch the actual role from profiles later
            firstName: session.user.user_metadata?.first_name || session.user.user_metadata?.firstName || '',
            lastName: session.user.user_metadata?.last_name || session.user.user_metadata?.lastName || '',
          };
          setUser(userData);
          
          // Fetch profile data using setTimeout to avoid auth deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
        
        // Always update loading state when auth changes
        setLoading(false);
      }
    );

    // THEN check for existing session
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setLoading(false);
          return;
        }
        
        // Loading state will be updated by the onAuthStateChange handler
      } catch (error) {
        console.error('Error in checkUser:', error);
        setLoading(false);
      }
    };
    
    checkUser();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, first_name, last_name')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setUser(prev => prev ? {
          ...prev,
          role: data.role,
          firstName: data.first_name || prev.firstName,
          lastName: data.last_name || prev.lastName,
        } : null);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;

      if (data.user) {
        toast.success('Successfully signed in');
      }
      
      return undefined;
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
      
      // Split name into first and last name
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const { data, error } = await supabase.auth.signUp({
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

      if (data.user) {
        toast.success('Account created successfully');
      } else {
        toast.success('Please check your email to verify your account');
      }
      
      return undefined;
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

  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      setLoading(true);
      
      if (!user) throw new Error('No user is currently logged in');
      
      // Update Supabase auth metadata
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName
        }
      });
      
      if (authUpdateError) throw authUpdateError;
      
      // Also update the profiles table
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          // Only update role if user is admin and role is provided
          ...(user.role === 'admin' && userData.role ? { role: userData.role } : {})
        })
        .eq('id', user.id);
      
      if (profileUpdateError) throw profileUpdateError;
      
      // Update local state
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
