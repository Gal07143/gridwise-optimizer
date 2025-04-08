
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Consumption from '@/pages/Consumption';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import EnergyFlow from '@/pages/EnergyFlow';
import Devices from '@/pages/Devices';
import Solar from '@/pages/Solar';
import Preferences from '@/pages/Preferences';
import Sites from '@/pages/Sites';
import SiteDetail from '@/pages/SiteDetail';
import DeviceDetail from '@/pages/DeviceDetail';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Integrations from '@/pages/Integrations';
import IntegrationCategoryPage from '@/pages/integrations/IntegrationCategoryPage';
import IntegrationDetailPage from '@/pages/integrations/IntegrationDetailPage';
import ModbusDevices from '@/pages/modbus/ModbusDevices';
import ModbusDeviceDetails from '@/pages/modbus/ModbusDeviceDetails';
import Savings from '@/pages/Savings';
import Optimization from '@/pages/Optimization';
import { AppStoreProvider } from '@/store/appStore';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ems-theme">
      <QueryClientProvider client={queryClient}>
        <AppStoreProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="consumption" element={<Consumption />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="energy-flow" element={<EnergyFlow />} />
                <Route path="optimization" element={<Optimization />} />
                <Route path="savings" element={<Savings />} />
                <Route path="devices" element={<Devices />} />
                <Route path="devices/:id" element={<DeviceDetail />} />
                <Route path="solar" element={<Solar />} />
                <Route path="settings" element={<Settings />} />
                <Route path="preferences" element={<Preferences />} />
                <Route path="sites" element={<Sites />} />
                <Route path="sites/:id" element={<SiteDetail />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="integrations/:category" element={<IntegrationCategoryPage />} />
                <Route path="integrations/:category/:id" element={<IntegrationDetailPage />} />
                <Route path="modbus" element={<ModbusDevices />} />
                <Route path="modbus/:id" element={<ModbusDeviceDetails />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AppStoreProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App;
