import React, { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-mobile';
import { useAppStore } from '@/store/appStore';
import { motion } from 'framer-motion';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, className }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { sidebarExpanded, setSidebarExpanded } = useAppStore();
  
  // Adjust sidebar state when screen size changes
  useEffect(() => {
    if (isMobile) {
      setSidebarExpanded(false);
    }
  }, [isMobile, setSidebarExpanded]);
  
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar className="border-r border-border/50" />
      
      <motion.div 
        className={cn(
          "flex-1 flex flex-col overflow-hidden",
          "ml-16"
        )}
        initial={{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }}
        animate={{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Header />
        <main className={cn("flex-1 overflow-y-auto p-6", className)}>
          {children}
        </main>
      </motion.div>
    </div>
  );
};

export default AppLayout;
