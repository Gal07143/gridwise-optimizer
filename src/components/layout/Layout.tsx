
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import Header from './Header';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Layout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useLocalStorage('sidebar-expanded', true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
      <Sidebar expanded={sidebarExpanded} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header sidebarExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} />
        
        <div className="flex flex-1 overflow-auto">
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
