
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainNav from './navigation/MainNav';
import { EquipmentProvider } from '@/contexts/EquipmentContext';

const Layout: React.FC = () => {
  return (
    <EquipmentProvider>
      <div className="min-h-screen bg-background bg-grid">
        <div className="absolute inset-0 bg-gradient-to-tr from-background/10 via-background to-background z-0 pointer-events-none"></div>
        <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <MainNav />
          </div>
        </header>
        <main className="container relative z-10 mx-auto px-4 py-8">
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
    </EquipmentProvider>
  );
};

export default Layout;
