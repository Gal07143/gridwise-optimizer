
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { AppStoreProvider } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import MicrogridProvider from '@/components/microgrid/MicrogridProvider';
import { EnergyFlowProvider } from '@/components/dashboard/energy-flow/EnergyFlowContext';
import Auth from '@/pages/Auth';
import Solar from '@/pages/Solar';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import PrivateRoute from '@/components/auth/PrivateRoute';
import Sites from '@/pages/Sites';
// Import Routes from the proper case file
import AppRoutes from '@/Routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <AppStoreProvider>
            <MicrogridProvider>
              <EnergyFlowProvider>
                <AppRoutes />
                <Toaster position="top-right" richColors />
              </EnergyFlowProvider>
            </MicrogridProvider>
          </AppStoreProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
