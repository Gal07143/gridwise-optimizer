import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainNav from './navigation/MainNav';
import { EquipmentProvider } from '@/contexts/EquipmentContext';

const Layout: React.FC = () => {
  return (
    <EquipmentProvider>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <MainNav />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Toaster position="top-right" />
      </div>
    </EquipmentProvider>
  );
};

export default Layout; 