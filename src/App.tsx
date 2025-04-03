
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import GlobalErrorBoundary from '@/components/ui/GlobalErrorBoundary';

// Import your pages
import Dashboard from '@/pages/Dashboard';
import EditDevice from '@/pages/EditDevice';
import ReviewDevices from '@/pages/devices/ReviewDevices';
import ManageDevices from '@/pages/devices/ManageDevices';
import SmartDevices from '@/pages/devices/SmartDevices';
import DeviceDetails from '@/pages/devices/DeviceDetails';
import EnergyFlow from '@/pages/EnergyFlow';
import EnergyFlowAdvanced from '@/pages/EnergyFlowAdvanced';
import AIOverview from '@/pages/AIOverview';
import OptimizationAlgorithms from '@/pages/settings/OptimizationAlgorithms';
import BatteryManagement from '@/pages/BatteryManagement';
import Analytics from '@/pages/Analytics';

// Create a client with error handling and retry logic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {
        console.error('Query error:', error);
      }
    },
  },
});

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="ems-theme">
          <Toaster position="top-right" closeButton richColors />
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/devices/:deviceId/edit" element={<EditDevice />} />
              <Route path="/devices/:deviceId" element={<DeviceDetails />} />
              <Route path="/devices/review" element={<ReviewDevices />} />
              <Route path="/devices/manage" element={<ManageDevices />} />
              <Route path="/devices/smart-devices" element={<SmartDevices />} />
              <Route path="/energy-flow" element={<EnergyFlow />} />
              <Route path="/energy-flow-advanced" element={<EnergyFlowAdvanced />} />
              <Route path="/ai-overview" element={<AIOverview />} />
              <Route path="/optimization" element={<OptimizationAlgorithms />} />
              <Route path="/battery-management" element={<BatteryManagement />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
