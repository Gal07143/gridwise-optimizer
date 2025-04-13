
import React from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { AppStoreProvider } from '@/store';
import { DeviceProvider } from '@/contexts/DeviceContext';
import MicrogridProvider from '@/components/microgrid/MicrogridProvider';
import { EnergyFlowProvider } from '@/components/dashboard/energy-flow/EnergyFlowContext';
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import AppRoutes from '@/Routes';

/**
 * Main application component that sets up providers and routing
 * 
 * Provider order is important for proper functionality:
 * 1. ThemeProvider - For theme management and styling
 * 2. AuthProvider - For authentication state and user context
 * 3. AppStoreProvider - For global state management
 * 4. DeviceProvider - For device management and operations
 * 5. MicrogridProvider - For microgrid data and operations
 * 6. EnergyFlowProvider - For energy flow visualization and calculations
 * 
 * BrowserRouter is placed last to establish routing context
 */
const App: React.FC = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AppStoreProvider>
          <DeviceProvider>
            <MicrogridProvider>
              <EnergyFlowProvider>
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </EnergyFlowProvider>
            </MicrogridProvider>
          </DeviceProvider>
        </AppStoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
