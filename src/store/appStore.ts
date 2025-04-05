import { create } from 'zustand';

interface AppState {
  // Sidebar state
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  
  // Dashboard active tab
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Theme setting
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Mobile menu state
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Sidebar state - default collapsed on mobile, expanded on desktop
  sidebarExpanded: window.innerWidth > 768,
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  
  // Dashboard
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // Theme
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  
  // Mobile menu
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}));
