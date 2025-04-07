
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  avatar?: string;
  preferences?: Record<string, any>;
  firstName?: string;
  lastName?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void | undefined>;
  signUp: (email: string, password: string, name: string) => Promise<void | undefined>;
  signOut: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}
