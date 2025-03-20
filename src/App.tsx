
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext'; 
import { SiteProvider } from '@/contexts/SiteContext';
import { Toaster } from 'sonner';
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
import NotFound from './pages/NotFound';
import Security from './pages/Security';
import Auth from './pages/Auth';
import ProtectedRoute from './components/auth/ProtectedRoute';
// Import the settings pages
import ProcessingSettings from './pages/settings/ProcessingSettings';
import TariffSettings from './pages/settings/TariffSettings';
import ThresholdsSettings from './pages/settings/ThresholdsSettings';
import AlgorithmsSettings from './pages/settings/AlgorithmsSettings';
// Import integration pages
import IntegrationsHome from './pages/integrations/IntegrationsHome';
import IntegrationCategoryPage from './pages/integrations/IntegrationCategoryPage';
import DeviceModelDetailPage from './pages/integrations/DeviceModelDetailPage';
import AddDeviceModelPage from './pages/integrations/AddDeviceModelPage';
// Import user and auth-related settings
import ApiSettings from './pages/settings/ApiSettings';
import UserSettings from './pages/settings/UserSettings';
import RoleManagement from './pages/settings/RoleManagement';
import Authentication from './pages/settings/Authentication';
import Encryption from './pages/settings/Encryption';
import Permissions from './pages/settings/Permissions';
import ApiKeyManagement from './pages/settings/ApiKeyManagement';
import UserAccounts from './pages/settings/UserAccounts';
import Alerts from './pages/Alerts';

function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            {/* Auth Route */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
            <Route path="/devices/add" element={<ProtectedRoute><AddDevice /></ProtectedRoute>} />
            <Route path="/devices/edit/:id" element={<ProtectedRoute><EditDevice /></ProtectedRoute>} />
            <Route path="/energy-flow" element={<ProtectedRoute><EnergyFlow /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
            <Route path="/microgrid-control" element={<ProtectedRoute><MicrogridControl /></ProtectedRoute>} />
            <Route path="/system-status" element={<ProtectedRoute><SystemStatus /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
            
            {/* Settings Pages */}
            <Route path="/settings/processing" element={<ProtectedRoute><ProcessingSettings /></ProtectedRoute>} />
            <Route path="/settings/tariffs" element={<ProtectedRoute><TariffSettings /></ProtectedRoute>} />
            <Route path="/settings/thresholds" element={<ProtectedRoute><ThresholdsSettings /></ProtectedRoute>} />
            <Route path="/settings/algorithms" element={<ProtectedRoute><AlgorithmsSettings /></ProtectedRoute>} />
            <Route path="/settings/api" element={<ProtectedRoute><ApiSettings /></ProtectedRoute>} />
            <Route path="/settings/users" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
            <Route path="/settings/roles" element={<ProtectedRoute><RoleManagement /></ProtectedRoute>} />
            <Route path="/settings/authentication" element={<ProtectedRoute><Authentication /></ProtectedRoute>} />
            <Route path="/settings/encryption" element={<ProtectedRoute><Encryption /></ProtectedRoute>} />
            <Route path="/settings/permissions" element={<ProtectedRoute><Permissions /></ProtectedRoute>} />
            <Route path="/settings/api-keys" element={<ProtectedRoute><ApiKeyManagement /></ProtectedRoute>} />
            <Route path="/settings/user-accounts" element={<ProtectedRoute><UserAccounts /></ProtectedRoute>} />
            
            {/* Integration Pages */}
            <Route path="/integrations" element={<ProtectedRoute><IntegrationsHome /></ProtectedRoute>} />
            <Route path="/integrations/category/:categoryId" element={<ProtectedRoute><IntegrationCategoryPage /></ProtectedRoute>} />
            <Route path="/integrations/device-model/:id" element={<ProtectedRoute><DeviceModelDetailPage /></ProtectedRoute>} />
            <Route path="/integrations/add-device-model" element={<ProtectedRoute><AddDeviceModelPage /></ProtectedRoute>} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </SiteProvider>
    </AuthProvider>
  );
}

export default App;
