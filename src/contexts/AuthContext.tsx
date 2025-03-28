
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

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
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      // Validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Mock authentication with simulated network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, we'll accept any email/password but validate format
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Create mock user with the provided email
      const mockUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        role: 'admin', // Default role for demo
        firstName: email.split('@')[0], // Use part of email as name for demo
        lastName: 'User',
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      console.log('User signed in:', mockUser);
      
    } catch (error) {
      console.error('Error signing in:', error);
      throw error; // Re-throw for UI handling
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>): Promise<void> => {
    try {
      // Validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Mock registration with simulated network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, check if email is already "taken"
      const existingUsers = localStorage.getItem('registeredEmails');
      const emails = existingUsers ? JSON.parse(existingUsers) : [];
      
      if (emails.includes(email)) {
        throw new Error('Email already exists. Please use a different email or sign in.');
      }
      
      // Register the email
      emails.push(email);
      localStorage.setItem('registeredEmails', JSON.stringify(emails));
      
      // Create new user
      const newUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        role: userData.role || 'viewer',
        firstName: userData.firstName,
        lastName: userData.lastName,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log('User registered and signed in:', newUser);
      
    } catch (error) {
      console.error('Error signing up:', error);
      throw error; // Re-throw for UI handling
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear user data
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Signed out successfully');
      console.log('User signed out');
      
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  
  const updateUserProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update user with new data
      const updatedUser = {
        ...user,
        ...updates
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
      console.log('User profile updated:', updatedUser);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
