import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User, UserRole, ThemePreference } from '@/types/energy';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authError: string | null;
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
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize session and profile on mount
    const initializeAuth = async () => {
      setLoading(true);
      setAuthError(null);
      
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          setAuthError(sessionError.message);
          setLoading(false);
          return;
        }
        
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
        setAuthError("Failed to initialize authentication");
      } finally {
        setLoading(false);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session);
          setSession(session);
          
          if (event === 'SIGNED_IN' && session) {
            await fetchUserProfile(session.user);
            
            // Update last_login time on sign in
            if (session.user) {
              try {
                const now = new Date().toISOString();
                await supabase
                  .from('profiles')
                  .update({ last_login: now })
                  .eq('id', session.user.id);
              } catch (error) {
                console.error('Error updating last login:', error);
              }
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setSession(null);
          } else if (event === 'USER_UPDATED' && session) {
            await fetchUserProfile(session.user);
          } else if (event === 'TOKEN_REFRESHED' && session) {
            console.log('Token refreshed successfully');
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
      console.log('Fetching profile for user:', authUser.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        
        // Handle the error case but still allow user to be authenticated
        // Create a basic user object from auth data
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          firstName: authUser.user_metadata?.first_name,
          lastName: authUser.user_metadata?.last_name,
          role: 'viewer' as UserRole,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            theme: 'system' as ThemePreference,
            notifications: {
              email: true,
              push: false,
              sms: false
            },
            dashboardLayout: null
          }
        });
        
        // Try to create the profile
        await createUserProfile(authUser);
        return;
      }
      
      if (data) {
        console.log('Profile data received:', data);
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          firstName: data.first_name || undefined,
          lastName: data.last_name || undefined,
          role: data.role as UserRole,
          createdAt: data.created_at,
          lastLogin: data.last_login || new Date().toISOString(),
          preferences: {
            theme: (data.theme_preference || 'system') as ThemePreference,
            notifications: {
              email: data.email_notifications,
              push: data.push_notifications,
              sms: data.sms_notifications
            },
            dashboardLayout: data.dashboard_layout
          }
        });
      } else {
        console.log('No profile found, creating one...');
        await createUserProfile(authUser);
      }
    } catch (error) {
      console.error('Error during profile fetch:', error);
      // Even if there's an error, allow user to be authenticated with basic data
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        firstName: authUser.user_metadata?.first_name,
        lastName: authUser.user_metadata?.last_name,
        role: 'viewer' as UserRole,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'system' as ThemePreference,
          notifications: {
            email: true,
            push: false,
            sms: false
          },
          dashboardLayout: null
        }
      });
    }
  };
  
  const createUserProfile = async (authUser: SupabaseUser) => {
    try {
      console.log('Creating new profile for user:', authUser.id);
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          email: authUser.email,
          first_name: authUser.user_metadata?.first_name,
          last_name: authUser.user_metadata?.last_name,
          role: 'viewer',
          theme_preference: 'system',
          email_notifications: true,
          push_notifications: false,
          sms_notifications: false
        });
        
      if (createError) {
        console.error('Error creating profile:', createError);
      } else {
        console.log('Profile created successfully');
        // Set the user with default values
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          firstName: authUser.user_metadata?.first_name,
          lastName: authUser.user_metadata?.last_name,
          role: 'viewer' as UserRole,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            theme: 'system' as ThemePreference,
            notifications: {
              email: true,
              push: false,
              sms: false
            },
            dashboardLayout: null
          }
        });
      }
    } catch (createError) {
      console.error('Exception creating profile:', createError);
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        toast.error("Sign in failed", {
          description: error.message,
        });
      } else {
        console.log('Sign in successful');
        toast.success("Signed in successfully", {
          description: "Welcome back!",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Exception during sign in:', error);
      return { error };
    }
  };
  
  const signUp = async (
    email: string, 
    password: string, 
    userData: { firstName?: string; lastName?: string }
  ) => {
    try {
      console.log('Signing up with email:', email);
      const { data, error } = await supabase.auth.signUp({
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
        console.error('Sign up error:', error);
        toast.error("Sign up failed", {
          description: error.message,
        });
      } else {
        console.log('Sign up successful');
        toast.success("Account created", {
          description: "Please check your email to confirm your account.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Exception during sign up:', error);
      return { error };
    }
  };
  
  const signOut = async () => {
    try {
      console.log('Signing out');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error during sign out:', error);
        toast.error("Sign out failed", {
          description: error.message,
        });
        return;
      }
      
      setUser(null);
      setSession(null);
      toast.success("Signed out", {
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Error during sign out:', error);
      toast.error("Sign out failed", {
        description: "There was an error signing you out.",
      });
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      console.log('Resetting password for email:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (!error) {
        toast.success("Password reset email sent", {
          description: "Check your email for the password reset link.",
        });
      } else {
        console.error('Reset password error:', error);
        toast.error("Failed to send reset email", {
          description: error.message,
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Exception during password reset:', error);
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
      console.log('Updating user profile:', updates);
      // Update auth metadata if email is being changed
      if (updates.email && updates.email !== user.email) {
        const { error } = await supabase.auth.updateUser({
          email: updates.email,
        });
        
        if (error) {
          console.error('Update user email error:', error);
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
          theme_preference: updates.preferences?.theme as ThemePreference,
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
        
        toast.success("Profile updated", {
          description: "Your profile has been updated successfully."
        });
      } else {
        console.error('Profile update error:', error);
        toast.error("Profile update failed", {
          description: error?.message || "Failed to update profile",
        });
      }
      
      return { error, data };
    } catch (error) {
      console.error('Exception updating profile:', error);
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
    authError,
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
