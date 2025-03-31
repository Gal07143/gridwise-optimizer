
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';

// Import your pages
import Dashboard from '@/pages/Dashboard';
import EditDevice from '@/pages/EditDevice';
import ReviewDevices from '@/pages/devices/ReviewDevices';
import ManageDevices from '@/pages/devices/ManageDevices';
import SmartDevices from '@/pages/devices/SmartDevices';

// Create a client
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ems-theme">
        <Toaster position="top-right" />
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/devices/:deviceId/edit" element={<EditDevice />} />
            <Route path="/devices/review" element={<ReviewDevices />} />
            <Route path="/devices/manage" element={<ManageDevices />} />
            <Route path="/devices/smart-devices" element={<SmartDevices />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
