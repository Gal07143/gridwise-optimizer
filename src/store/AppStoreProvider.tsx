
import React, { createContext, useContext, ReactNode } from 'react';
import { useAppStore } from './appStore';

// Create a context to provide the store state throughout the app
export const AppStoreContext = createContext<ReturnType<typeof useAppStore> | null>(null);

interface AppStoreProviderProps {
  children: ReactNode;
}

export const AppStoreProvider: React.FC<AppStoreProviderProps> = ({ children }) => {
  // We can't directly pass a Zustand store to React context
  // Instead, we use the hook to access the store and pass the returned state/actions
  const store = useAppStore();
  
  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  );
};

// Custom hook to use the app store context
export const useAppStoreContext = () => {
  const context = useContext(AppStoreContext);
  if (context === null) {
    throw new Error('useAppStoreContext must be used within an AppStoreProvider');
  }
  return context;
};

export default AppStoreProvider;
