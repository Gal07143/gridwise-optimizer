
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData: Record<string, any>) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateUser: (userData: Record<string, any>) => Promise<{ error: Error | null }>;
}

// Create context with default value
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and sets the user
    setLoading(true);
    
    // Get session from local storage
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error fetching session:', error);
        setError(error);
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      setLoading(false);
    };
    
    checkSession();

    // Listen for changes to auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error("Sign in failed", {
          description: error.message
        });
        return { error };
      }

      toast.success("Signed in successfully");
      navigate('/dashboard');
      return { error: null };
    } catch (error) {
      const err = error as Error;
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: Record<string, any>) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        toast.error("Sign up failed", {
          description: error.message
        });
        return { error };
      }

      toast.success("Signed up successfully", {
        description: "Please check your email for confirmation"
      });
      return { error: null };
    } catch (error) {
      const err = error as Error;
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Sign out failed", {
          description: error.message
        });
      } else {
        setUser(null);
        setSession(null);
        navigate('/auth');
        toast.success("Signed out successfully");
      }
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        toast.error("Password reset failed", {
          description: error.message
        });
        return { error };
      }

      toast.success("Password reset email sent", {
        description: "Please check your email"
      });
      return { error: null };
    } catch (error) {
      const err = error as Error;
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update user data
  const updateUser = async (userData: Record<string, any>) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        data: userData
      });

      if (error) {
        toast.error("Update failed", {
          description: error.message
        });
        return { error };
      }

      toast.success("Profile updated successfully");
      return { error: null };
    } catch (error) {
      const err = error as Error;
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      error,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
