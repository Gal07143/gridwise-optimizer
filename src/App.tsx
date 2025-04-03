import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/theme/ThemeConfig';
import GlobalErrorBoundary from '@/components/ui/GlobalErrorBoundary';
import LoadingScreen from '@/components/LoadingScreen';

// Lazy loaded pages for better performance
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const EditDevice = lazy(() => import('@/pages/EditDevice'));
const ReviewDevices = lazy(() => import('@/pages/devices/ReviewDevices'));
const ManageDevices = lazy(() => import('@/pages/devices/ManageDevices'));
const SmartDevices = lazy(() => import('@/pages/devices/SmartDevices'));
const DeviceDetails = lazy(() => import('@/pages/devices/DeviceDetails'));
const EnergyFlow = lazy(() => import('@/pages/EnergyFlow'));
const EnergyFlowAdvanced = lazy(() => import('@/pages/EnergyFlowAdvanced'));
const AIOverview = lazy(() => import('@/pages/AIOverview'));
const OptimizationAlgorithms = lazy(() => import('@/pages/settings/OptimizationAlgorithms'));
const BatteryManagement = lazy(() => import('@/pages/BatteryManagement'));
const Analytics = lazy(() => import('@/pages/Analytics'));

// Create a client with error handling and retry logic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Toaster position="top-right" closeButton richColors />
          <Router>
            <Suspense fallback={<LoadingScreen />}>
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
            </Suspense>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
