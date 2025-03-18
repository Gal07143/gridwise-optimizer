
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User, UserRole } from '@/types/energy';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, userData: { firstName?: string; lastName?: string }) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updateUserProfile: (updates: Partial<User>) => Promise<{ error: any | null; data: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize session and profile on mount
    const initializeAuth = async () => {
      setLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user);
      }
      
      setLoading(false);
      
      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          
          if (event === 'SIGNED_IN' && session) {
            await fetchUserProfile(session.user);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          } else if (event === 'USER_UPDATED' && session) {
            await fetchUserProfile(session.user);
          }
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);
  
  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (data) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          firstName: data.first_name || undefined,
          lastName: data.last_name || undefined,
          role: data.role as UserRole,
          createdAt: data.created_at,
          lastLogin: data.last_login,
          preferences: {
            theme: data.theme_preference,
            notifications: {
              email: data.email_notifications,
              push: data.push_notifications,
              sms: data.sms_notifications
            },
            dashboardLayout: data.dashboard_layout
          }
        });
      }
    } catch (error) {
      console.error('Error during profile fetch:', error);
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
      }
      return { error };
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error };
    }
  };
  
  const signUp = async (
    email: string, 
    password: string, 
    userData: { firstName?: string; lastName?: string }
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName
          }
        }
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Account created",
          description: "Please check your email to confirm your account.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error };
    }
  };
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (!error) {
        toast({
          title: "Password reset email sent",
          description: "Check your email for the password reset link.",
        });
      } else {
        toast({
          title: "Failed to send reset email",
          description: error.message,
          variant: "destructive"
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Error during password reset:', error);
      return { error };
    }
  };
  
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) {
      return {
        error: { message: "Not authenticated" },
        data: null
      };
    }
    
    try {
      // Update auth metadata if email is being changed
      if (updates.email && updates.email !== user.email) {
        const { error } = await supabase.auth.updateUser({
          email: updates.email,
        });
        
        if (error) {
          return { error, data: null };
        }
      }
      
      // Update profile in database
      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          email_notifications: updates.preferences?.notifications?.email,
          push_notifications: updates.preferences?.notifications?.push,
          sms_notifications: updates.preferences?.notifications?.sms,
          theme_preference: updates.preferences?.theme,
          dashboard_layout: updates.preferences?.dashboardLayout
        })
        .eq('id', user.id)
        .select();
      
      if (!error && data) {
        // Update local user state
        setUser({
          ...user,
          ...updates
        });
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully."
        });
      } else {
        toast({
          title: "Profile update failed",
          description: error?.message || "Failed to update profile",
          variant: "destructive"
        });
      }
      
      return { error, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        error,
        data: null
      };
    }
  };
  
  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
