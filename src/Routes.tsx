import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Public pages
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Protected pages
import Dashboard from '@/pages/Dashboard';
import Devices from '@/pages/Devices';
import AddDevice from '@/pages/AddDevice';
import DeviceView from '@/pages/DeviceView';
import EditDevice from '@/pages/EditDevice';
import Analytics from '@/pages/Analytics';
import Consumption from '@/pages/Consumption';
import Production from '@/pages/Production';
import Reports from '@/pages/Reports';
import Alerts from '@/pages/Alerts';
import EnergyFlow from '@/pages/EnergyFlow';
import MicrogridControl from '@/pages/MicrogridControl';
import SystemStatus from '@/pages/SystemStatus';
import Security from '@/pages/Security';
import MQTTIntegration from '@/pages/MQTTIntegration';
import BatteryManagement from '@/pages/BatteryManagement';
import EnergyOptimization from '@/pages/EnergyOptimization';
import WeatherForecast from '@/pages/WeatherForecast';
import AIOverview from '@/pages/AIOverview';

// Integration pages
import IntegrationsHome from '@/pages/integrations/IntegrationsHome';
import IntegrationCategoryPage from '@/pages/integrations/IntegrationCategoryPage';
import DeviceModelDetailPage from '@/pages/integrations/DeviceModelDetailPage';
import AddDeviceModelPage from '@/pages/integrations/AddDeviceModelPage';
import EditDeviceModelPage from '@/pages/integrations/EditDeviceModelPage';
import CommunicationDevices from '@/pages/integrations/CommunicationDevices';
import CommunicationDeviceDetail from '@/pages/integrations/CommunicationDeviceDetail';

// Settings pages
import Settings from '@/pages/Settings';
import UserSettings from '@/pages/settings/UserSettings';
import SiteSettings from '@/pages/settings/SiteSettings';
import AddSite from '@/pages/settings/AddSite';
import EditSite from '@/pages/settings/EditSite';
import TariffSettings from '@/pages/settings/TariffSettings';
import ApiSettings from '@/pages/settings/ApiSettings';
import NotificationServices from '@/pages/settings/NotificationServices';
import OperationalThresholds from "@/pages/settings/OperationalThresholds";
import OptimizationAlgorithms from "@/pages/settings/OptimizationAlgorithms";
import ExternalServices from "@/pages/settings/ExternalServices";
import SystemUpdates from "@/pages/settings/SystemUpdates";
import Authentication from "@/pages/settings/Authentication";

// Device Catalog Routes
import DeviceCatalog from '@/pages/devices/DeviceCatalog';
import DeviceCategoryDetail from '@/pages/devices/DeviceCategoryDetail';
import DeviceModelDetail from '@/pages/devices/DeviceModelDetail';

// AI Tools
import AIModelTrainer from '@/components/admin/AIModelTrainer';

// Authentication components
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleProtectedRoute from '@/components/auth/RoleProtectedRoute';
import LoadingScreen from '@/components/LoadingScreen';

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      {/* Public Routes - Make Index redirect to Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/auth" element={<Auth />} />

      {/* Protected Routes - No real protection for testing */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      <Route path="/devices" element={<Devices />} />
      <Route path="/devices/add" element={<AddDevice />} />
      <Route path="/devices/:deviceId" element={<DeviceView />} />
      <Route path="/devices/:deviceId/edit" element={<EditDevice />} />

      <Route path="/analytics" element={<Analytics />} />
      <Route path="/consumption" element={<Consumption />} />
      <Route path="/production" element={<Production />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/energy-flow" element={<EnergyFlow />} />
      <Route path="/microgrid-control" element={<MicrogridControl />} />

      <Route path="/battery-management" element={<BatteryManagement />} />
      <Route path="/energy-optimization" element={<EnergyOptimization />} />
      <Route path="/weather-forecast" element={<WeatherForecast />} />
      <Route path="/ai/overview" element={<AIOverview />} />

      {/* Integration Routes */}
      <Route path="/integrations" element={<IntegrationsHome />} />
      <Route path="/integrations/:categoryId" element={<IntegrationCategoryPage />} />
      <Route path="/integrations/model/:modelId" element={<DeviceModelDetailPage />} />
      <Route path="/integrations/device-model/:modelId" element={<DeviceModelDetailPage />} />
      <Route path="/integrations/model/add" element={<AddDeviceModelPage />} />
      <Route path="/integrations/model/:modelId/edit" element={<EditDeviceModelPage />} />
      <Route path="/integrations/mqtt" element={<MQTTIntegration />} />

      <Route path="/integrations/communication" element={<CommunicationDevices />} />
      <Route path="/integrations/communication/:deviceId" element={<CommunicationDeviceDetail />} />

      <Route path="/integrations/batteries" element={<IntegrationCategoryPage />} />
      <Route path="/integrations/inverters" element={<IntegrationCategoryPage />} />
      <Route path="/integrations/ev-chargers" element={<IntegrationCategoryPage />} />
      <Route path="/integrations/meters" element={<IntegrationCategoryPage />} />
      <Route path="/integrations/controllers" element={<IntegrationCategoryPage />} />

      {/* System Routes */}
      <Route path="/system-status" element={<SystemStatus />} />
      <Route path="/security" element={<Security />} />

      {/* Settings Routes - No role protection */}
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/user" element={<UserSettings />} />
      <Route path="/settings/sites" element={<SiteSettings />} />
      <Route path="/settings/sites/add" element={<AddSite />} />
      <Route path="/settings/sites/:siteId/edit" element={<EditSite />} />
      <Route path="/settings/tariffs" element={<TariffSettings />} />
      <Route path="/settings/api" element={<ApiSettings />} />
      <Route path="/settings/notifications" element={<NotificationServices />} />
      <Route path="/settings/thresholds" element={<OperationalThresholds />} />
      <Route path="/settings/algorithms" element={<OptimizationAlgorithms />} />
      <Route path="/settings/external" element={<ExternalServices />} />
      <Route path="/settings/system-updates" element={<SystemUpdates />} />
      <Route path="/settings/authentication" element={<Authentication />} />
      
      {/* AI Routes */}
      <Route path="/ai/trainer" element={<AIModelTrainer />} />
      
      {/* Device Catalog Routes */}
      <Route path="/device-view/:deviceId" element={<Navigate to={`/devices/${window.location.pathname.split('/').pop()}`} replace />} />
      <Route path="/devices/catalog" element={<DeviceCatalog />} />
      <Route path="/devices/category/:categoryId" element={<DeviceCategoryDetail />} />
      <Route path="/devices/model/:modelId" element={<DeviceModelDetail />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
