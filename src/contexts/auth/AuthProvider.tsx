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

  useEffect(() => {
    // Set up auth state change listener FIRST to prevent missing events during initialization
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            role: 'user', // Default role, will be updated from profile
            firstName: session.user.user_metadata?.first_name || session.user.user_metadata?.firstName || '',
            lastName: session.user.user_metadata?.last_name || session.user.user_metadata?.lastName || '',
          };
          setUser(userData);
          
          // Use setTimeout to prevent potential deadlocks with Supabase auth
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
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

        if (data.session?.user) {
          const userData: User = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            role: 'user', // Default role, will be updated from profile
            firstName: data.session.user.user_metadata?.first_name || data.session.user.user_metadata?.firstName || '',
            lastName: data.session.user.user_metadata?.last_name || data.session.user.user_metadata?.lastName || '',
          };
          setUser(userData);
          fetchUserProfile(data.session.user.id);
        } else {
          setLoading(false);
        }
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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, first_name, last_name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setUser(prev => prev ? {
          ...prev,
          role: data.role || 'user',
          firstName: data.first_name || prev.firstName,
          lastName: data.last_name || prev.lastName,
        } : null);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(`Login failed: ${error.message}`);
        throw error;
      }

      toast.success('Signed in successfully!');
      return data;
    } catch (error: any) {
      console.error('Error in signIn:', error);
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Split the name into first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        toast.error(`Registration failed: ${error.message}`);
        setLoading(false);
        throw error;
      }
      
      toast.success('Account created successfully!');
      
      // Note: Profile creation is handled by the Supabase trigger
      return data;
    } catch (error: any) {
      console.error('Error in signUp:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(`Sign out failed: ${error.message}`);
        throw error;
      }
      
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Error in signOut:', error);
      toast.error(`Sign out failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      if (!user) {
        toast.error('You must be logged in to update your profile');
        return;
      }
      
      setLoading(true);
      
      // Update user metadata
      const updateData: Record<string, any> = {};
      if (userData.firstName) updateData.first_name = userData.firstName;
      if (userData.lastName) updateData.last_name = userData.lastName;
      
      if (Object.keys(updateData).length > 0) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: updateData
        });
        
        if (metadataError) {
          toast.error(`Failed to update profile metadata: ${metadataError.message}`);
          throw metadataError;
        }
      }
      
      // Update profile table
      const profileUpdate: Record<string, any> = {};
      if (userData.firstName) profileUpdate.first_name = userData.firstName;
      if (userData.lastName) profileUpdate.last_name = userData.lastName;
      
      if (Object.keys(profileUpdate).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdate)
          .eq('id', user.id);
          
        if (profileError) {
          toast.error(`Failed to update profile: ${profileError.message}`);
          throw profileError;
        }
      }
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...userData } : null);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating user profile:', error);
    } finally {
      setLoading(false);
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
        updateUserProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
