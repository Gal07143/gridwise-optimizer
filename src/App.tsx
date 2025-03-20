
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ReportsPage from './pages/Reports';
import EnergyFlow from './pages/EnergyFlow';
import Analytics from './pages/Analytics';
import MicrogridControl from './pages/MicrogridControl';
import SystemStatus from './pages/SystemStatus';
import EditDevice from './pages/EditDevice';
import AddDevice from './pages/AddDevice';
import Devices from './pages/Devices';
import IntegrationsHome from './pages/integrations/IntegrationsHome';
import IntegrationCategoryPage from './pages/integrations/IntegrationCategoryPage';
import DeviceModelDetailPage from './pages/integrations/DeviceModelDetailPage';
import AddDeviceModelPage from './pages/integrations/AddDeviceModelPage';
import NotFound from './pages/NotFound';
import { SiteProvider } from './contexts/SiteContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Auth from './pages/Auth';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SiteSettings from './pages/settings/SiteSettings';
import Security from './pages/Security';
import Alerts from './pages/Alerts';
import Encryption from './pages/settings/Encryption';
import Permissions from './pages/settings/Permissions';
import ExternalServices from './pages/settings/ExternalServices';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SiteProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/settings/sites" element={<ProtectedRoute><SiteSettings /></ProtectedRoute>} />
              <Route path="/settings/encryption" element={<ProtectedRoute><Encryption /></ProtectedRoute>} />
              <Route path="/settings/permissions" element={<ProtectedRoute><Permissions /></ProtectedRoute>} />
              <Route path="/settings/external-services" element={<ProtectedRoute><ExternalServices /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
              <Route path="/energy-flow" element={<ProtectedRoute><EnergyFlow /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/microgrid-control" element={<ProtectedRoute><MicrogridControl /></ProtectedRoute>} />
              <Route path="/system-status" element={<ProtectedRoute><SystemStatus /></ProtectedRoute>} />
              <Route path="/edit-device/:id" element={<ProtectedRoute><EditDevice /></ProtectedRoute>} />
              <Route path="/add-device" element={<ProtectedRoute><AddDevice /></ProtectedRoute>} />
              <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
              <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
              <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
              
              {/* Integration Routes */}
              <Route path="/integrations" element={<ProtectedRoute><IntegrationsHome /></ProtectedRoute>} />
              <Route path="/integrations/:categoryId" element={<ProtectedRoute><IntegrationCategoryPage /></ProtectedRoute>} />
              <Route path="/integrations/device/:deviceId" element={<ProtectedRoute><DeviceModelDetailPage /></ProtectedRoute>} />
              <Route path="/integrations/add-device-model" element={<ProtectedRoute><AddDeviceModelPage /></ProtectedRoute>} />
              
              {/* 404 Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-right" />
          </Router>
        </SiteProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
