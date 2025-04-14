
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { EquipmentProvider } from '@/contexts/EquipmentContext';
import CollapsibleSidebar from './sidebar/CollapsibleSidebar';

const Layout: React.FC = () => {
  return (
    <EquipmentProvider>
      <CollapsibleSidebar>
        <div className="min-h-screen bg-background bg-grid">
          <div className="absolute inset-0 bg-gradient-to-tr from-background/10 via-background to-background z-0 pointer-events-none"></div>
          <main className="relative z-10 p-6">
            <Outlet />
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'glass-card !bg-background/80 !text-foreground border border-border/30 shadow-lg',
              duration: 3000,
            }} 
          />
        </div>
      </CollapsibleSidebar>
    </EquipmentProvider>
  );
};

export default Layout;
