
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { SiteProvider } from '@/contexts/SiteContext';
import { ThemeProvider } from 'next-themes';
import { Toaster as SonnerToaster } from 'sonner';
import AppRoutes from './Routes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <SiteProvider>
            <AppRoutes />
            <Toaster />
            <SonnerToaster position="top-right" />
          </SiteProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
