import React from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { AppStoreProvider } from '@/store';
import MicrogridProvider from '@/components/microgrid/MicrogridProvider';
import { EnergyFlowProvider } from '@/components/dashboard/energy-flow/EnergyFlowContext';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppRoutes from '@/Routes';

// Create a browser router using the route configuration
const router = createBrowserRouter([
  {
    path: '*',
    element: <AppRoutes />,
  },
]);

/**
 * Main application component that sets up providers and routing
 * 
 * Provider order is important for proper functionality:
 * 1. ThemeProvider - For theme management and styling
 * 2. AuthProvider - For authentication state and user context
 * 3. AppStoreProvider - For global state management
 * 4. MicrogridProvider - For microgrid data and operations
 * 5. EnergyFlowProvider - For energy flow visualization and calculations
 * 
 * The RouterProvider is placed last to ensure all context providers
 * are available to the routed components.
 */
const App: React.FC = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AppStoreProvider>
          <MicrogridProvider>
            <EnergyFlowProvider>
              <RouterProvider router={router} />
            </EnergyFlowProvider>
          </MicrogridProvider>
        </AppStoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
