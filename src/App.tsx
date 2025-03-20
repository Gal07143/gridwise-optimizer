
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext'; 
import { SiteProvider } from '@/contexts/SiteContext';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import Index from './pages/Index';
import ProcessingSettings from './pages/settings/ProcessingSettings';
import TariffSettings from './pages/settings/TariffSettings';
import ThresholdsSettings from './pages/settings/ThresholdsSettings';
import AlgorithmsSettings from './pages/settings/AlgorithmsSettings';
import IntegrationsHome from './pages/integrations/IntegrationsHome';
import IntegrationCategoryPage from './pages/integrations/IntegrationCategoryPage';
import DeviceModelDetailPage from './pages/integrations/DeviceModelDetailPage';
import AddDeviceModelPage from './pages/integrations/AddDeviceModelPage';
import EditDeviceModelPage from './pages/integrations/EditDeviceModelPage';
import ApiSettings from './pages/settings/ApiSettings';
import UserSettings from './pages/settings/UserSettings';
import RoleManagement from './pages/settings/RoleManagement';
import Authentication from './pages/settings/Authentication';
import Encryption from './pages/settings/Encryption';
import Permissions from './pages/settings/Permissions';
import ApiKeyManagement from './pages/settings/ApiKeyManagement';
import UserAccounts from './pages/settings/UserAccounts';
import Alerts from './pages/Alerts';
import ExternalServices from './pages/settings/ExternalServices';
import DeviceView from './pages/DeviceView';
import GeneralSettings from './pages/settings/GeneralSettings';
import SiteSettings from './pages/settings/SiteSettings';
import AddSite from './pages/settings/AddSite';
import EditSite from './pages/settings/EditSite';
import Documentation from './pages/Documentation';
import NotificationServices from './pages/settings/NotificationServices';
import BackupSettings from './pages/settings/BackupSettings';
import DataExport from './pages/settings/DataExport';
import AuditLogging from './pages/settings/AuditLogging';
import OptimizationAlgorithms from './pages/settings/OptimizationAlgorithms';
import OperationalThresholds from './pages/settings/OperationalThresholds';
import SystemUpdates from './pages/settings/SystemUpdates';
import StorageConfiguration from './pages/settings/StorageConfiguration';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SiteProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Index />} />

              <Route path="/" element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="energy-flow" element={<EnergyFlow />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="devices" element={<Devices />} />
                <Route path="device-view/:deviceId" element={<DeviceView />} />
                <Route path="edit-device/:deviceId" element={<EditDevice />} />
                <Route path="add-device" element={<AddDevice />} />
                <Route path="microgrid-control" element={<MicrogridControl />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="system-status" element={<SystemStatus />} />
                <Route path="security" element={<Security />} />
                <Route path="integrations" element={<IntegrationsHome />} />
                <Route path="integrations/:categoryId" element={<IntegrationCategoryPage />} />
                <Route path="integrations/device-models/:id" element={<DeviceModelDetailPage />} />
                <Route path="integrations/add-device-model" element={<AddDeviceModelPage />} />
                <Route path="integrations/edit-device-model/:id" element={<EditDeviceModelPage />} />
                <Route path="documentation" element={<Documentation />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/general" element={<GeneralSettings />} />
                <Route path="settings/user" element={<UserSettings />} />
                <Route path="settings/sites" element={<SiteSettings />} />
                <Route path="settings/add-site" element={<AddSite />} />
                <Route path="settings/edit-site/:siteId" element={<EditSite />} />
                <Route path="settings/api" element={<ApiSettings />} />
                <Route path="settings/api-keys" element={<ApiKeyManagement />} />
                <Route path="settings/external-services" element={<ExternalServices />} />
                <Route path="settings/notifications" element={<NotificationServices />} />
                <Route path="settings/backup" element={<BackupSettings />} />
                <Route path="settings/export" element={<DataExport />} />
                <Route path="settings/users" element={<UserAccounts />} />
                <Route path="settings/roles" element={<RoleManagement />} />
                <Route path="settings/permissions" element={<Permissions />} />
                <Route path="settings/authentication" element={<Authentication />} />
                <Route path="settings/audit-logging" element={<AuditLogging />} />
                <Route path="settings/encryption" element={<Encryption />} />
                <Route path="settings/system-updates" element={<SystemUpdates />} />
                <Route path="settings/storage" element={<StorageConfiguration />} />
                <Route path="settings/processing" element={<ProcessingSettings />} />
                <Route path="settings/algorithms" element={<AlgorithmsSettings />} />
                <Route path="settings/optimization" element={<OptimizationAlgorithms />} />
                <Route path="settings/tariffs" element={<TariffSettings />} />
                <Route path="settings/thresholds" element={<ThresholdsSettings />} />
                <Route path="settings/operational-thresholds" element={<OperationalThresholds />} />
              </Route>

              <Route path="auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </SiteProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
