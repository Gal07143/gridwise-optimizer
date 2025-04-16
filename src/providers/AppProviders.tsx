
import React, { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { EnergyFlowProvider } from '@/components/dashboard/energy-flow/EnergyFlowContext';
import { DeviceProvider } from '@/contexts/DeviceContext';
import MicrogridProvider from '@/components/microgrid/MicrogridProvider';
import { Toaster } from 'sonner';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="theme-preference">
          <DeviceProvider>
            <MicrogridProvider>
              <EnergyFlowProvider>
                {children}
                <Toaster 
                  position="top-right"
                  closeButton
                  richColors
                />
              </EnergyFlowProvider>
            </MicrogridProvider>
          </DeviceProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default AppProviders;
