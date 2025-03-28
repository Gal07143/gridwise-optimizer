
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
