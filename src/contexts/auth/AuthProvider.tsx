
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from './AuthContext';
import { User } from './AuthTypes';
import { Session, AuthError } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ? mapUserData(currentSession.user) : null);
        
        if (!initialized) {
          setLoading(false);
          setInitialized(true);
        }

        // Fetch additional user data if needed (using setTimeout to prevent auth deadlocks)
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        const { session: currentSession } = data;
        setSession(currentSession);
        setUser(currentSession?.user ? mapUserData(currentSession.user) : null);
        
        if (currentSession?.user) {
          fetchUserProfile(currentSession.user.id);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser(prevUser => ({
          ...prevUser!,
          ...data
        }));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Helper function to map Supabase user to our User type
  const mapUserData = (supabaseUser: any): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role: supabaseUser.role || 'user',
    };
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // More specific error handling for common auth issues
        if (error.message.includes('Invalid login')) {
          throw new Error('Invalid email or password. Please try again.');
        } else if (error.message.includes('API key')) {
          throw new Error('Authentication system error. Please contact support.');
        } else {
          throw error;
        }
      }
      
      return data;
    } catch (error: unknown) {
      const authError = error as AuthError | Error;
      console.error('Sign in error:', authError);
      toast.error(authError.message || 'Failed to sign in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' '),
          },
        },
      });

      if (error) throw error;
      toast.success('Account created successfully! Please check your email');
      return data;
    } catch (error: unknown) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to create account');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error: unknown) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to sign out');
      throw error;
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      // Update auth user data if needed
      if (userData.email) {
        const { error: authUpdateError } = await supabase.auth.updateUser({
          email: userData.email,
        });
        
        if (authUpdateError) throw authUpdateError;
      }

      // Update profile data in profiles table
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          avatar: userData.avatar,
          preferences: userData.preferences,
        })
        .eq('id', user.id);

      if (profileUpdateError) throw profileUpdateError;

      // Update local state
      setUser({
        ...user,
        ...userData,
      });

      toast.success('Profile updated successfully');
    } catch (error: unknown) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
