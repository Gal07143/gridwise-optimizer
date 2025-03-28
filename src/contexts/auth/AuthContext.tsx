
import React, { createContext, useContext } from 'react';
import { AuthContextType, User } from './AuthTypes';
import { AuthProvider } from './AuthProvider';

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider };
export type { User, AuthContextType };
