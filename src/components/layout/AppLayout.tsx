
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, className }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarExpanded, setSidebarExpanded] = useState(!isMobile);
  
  // Adjust sidebar state when screen size changes
  useEffect(() => {
    setSidebarExpanded(!isMobile);
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };
  
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        isExpanded={sidebarExpanded} 
        toggleSidebar={toggleSidebar} 
        className={cn(
          "fixed h-full z-30 transition-all duration-300 ease-in-out",
          sidebarExpanded ? "w-56" : "w-16"
        )} 
      />
      
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
        sidebarExpanded ? "md:ml-56" : "md:ml-16",
        "ml-0" // Mobile view doesn't shift content
      )}>
        <Header />
        <main className={cn("flex-1 overflow-y-auto", className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
