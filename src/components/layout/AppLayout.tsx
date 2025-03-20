
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, className }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar isExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} className="w-auto" />
      
      <div className={cn("flex-1 flex flex-col overflow-hidden", sidebarExpanded ? "ml-56" : "ml-16")}>
        <Header />
        <main className={cn("flex-1 overflow-y-auto", className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
