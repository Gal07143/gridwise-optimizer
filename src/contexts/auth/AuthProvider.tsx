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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        setLoading(true); // Set loading to true when auth state changes

        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin', // We'll fetch the actual role from profiles later
            firstName: session.user.user_metadata?.first_name || session.user.user_metadata?.firstName || '',
            lastName: session.user.user_metadata?.last_name || session.user.user_metadata?.lastName || '',
          };
          setUser(userData);
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error checking session:', error);
          setLoading(false);
          return;
        }

        if (!data.session) {
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
          role: data.role,
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

      if (error) throw error;

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          role: 'admin', // We'll fetch the actual role from profiles later
          firstName: data.user.user_metadata?.first_name || data.user.user_metadata?.firstName || '',
          lastName: data.user.user_metadata?.last_name || data.user.user_metadata?.lastName || '',
        };
        setUser(userData);
        fetchUserProfile(data.user.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in signIn:', error);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, signIn, signUp: async () => {}, signOut: async () => {}, updateUserProfile: async () => {} }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
export type { User, AuthContextType };
