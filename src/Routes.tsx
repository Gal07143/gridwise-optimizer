
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';

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

// Device Catalog Routes
import DeviceCatalog from '@/pages/devices/DeviceCatalog';
import DeviceCategoryDetail from '@/pages/devices/DeviceCategoryDetail';
import DeviceModelDetail from '@/pages/devices/DeviceModelDetail';

// AI Tools
import AIModelTrainer from '@/components/admin/AIModelTrainer';

// Authentication components
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleProtectedRoute from '@/components/auth/RoleProtectedRoute';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Index />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
      <Route path="/devices/add" element={<ProtectedRoute><AddDevice /></ProtectedRoute>} />
      <Route path="/devices/:deviceId" element={<ProtectedRoute><DeviceView /></ProtectedRoute>} />
      <Route path="/devices/:deviceId/edit" element={<ProtectedRoute><EditDevice /></ProtectedRoute>} />

      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/consumption" element={<ProtectedRoute><Consumption /></ProtectedRoute>} />
      <Route path="/production" element={<ProtectedRoute><Production /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
      <Route path="/energy-flow" element={<ProtectedRoute><EnergyFlow /></ProtectedRoute>} />
      <Route path="/microgrid-control" element={<ProtectedRoute><MicrogridControl /></ProtectedRoute>} />

      <Route path="/battery-management" element={<ProtectedRoute><BatteryManagement /></ProtectedRoute>} />
      <Route path="/energy-optimization" element={<ProtectedRoute><EnergyOptimization /></ProtectedRoute>} />
      <Route path="/weather-forecast" element={<ProtectedRoute><WeatherForecast /></ProtectedRoute>} />
      <Route path="/ai/overview" element={<ProtectedRoute><AIOverview /></ProtectedRoute>} />

      <Route path="/integrations" element={<ProtectedRoute><IntegrationsHome /></ProtectedRoute>} />
      <Route path="/integrations/:categoryId" element={<ProtectedRoute><IntegrationCategoryPage /></ProtectedRoute>} />
      <Route path="/integrations/model/:modelId" element={<ProtectedRoute><DeviceModelDetailPage /></ProtectedRoute>} />
      <Route path="/integrations/device-model/:modelId" element={<ProtectedRoute><DeviceModelDetailPage /></ProtectedRoute>} />
      <Route path="/integrations/model/add" element={<ProtectedRoute><AddDeviceModelPage /></ProtectedRoute>} />
      <Route path="/integrations/model/:modelId/edit" element={<ProtectedRoute><EditDeviceModelPage /></ProtectedRoute>} />
      <Route path="/integrations/mqtt" element={<ProtectedRoute><MQTTIntegration /></ProtectedRoute>} />

      <Route path="/integrations/communication" element={<ProtectedRoute><CommunicationDevices /></ProtectedRoute>} />
      <Route path="/integrations/communication/:deviceId" element={<ProtectedRoute><CommunicationDeviceDetail /></ProtectedRoute>} />

      <Route path="/integrations/batteries" element={<ProtectedRoute><IntegrationCategoryPage /></ProtectedRoute>} />
      <Route path="/integrations/inverters" element={<ProtectedRoute><IntegrationCategoryPage /></ProtectedRoute>} />
      <Route path="/integrations/ev-chargers" element={<ProtectedRoute><IntegrationCategoryPage /></ProtectedRoute>} />
      <Route path="/integrations/meters" element={<ProtectedRoute><IntegrationCategoryPage /></ProtectedRoute>} />
      <Route path="/integrations/controllers" element={<ProtectedRoute><IntegrationCategoryPage /></ProtectedRoute>} />

      <Route path="/system-status" element={<ProtectedRoute><SystemStatus /></ProtectedRoute>} />
      <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />

      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/user" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
      <Route path="/settings/sites" element={<ProtectedRoute><SiteSettings /></ProtectedRoute>} />
      <Route path="/settings/sites/add" element={<RoleProtectedRoute allowedRoles={['admin', 'installer']}><AddSite /></RoleProtectedRoute>} />
      <Route path="/settings/sites/:siteId/edit" element={<RoleProtectedRoute allowedRoles={['admin', 'installer']}><EditSite /></RoleProtectedRoute>} />
      <Route path="/settings/tariffs" element={<ProtectedRoute><TariffSettings /></ProtectedRoute>} />
      <Route path="/settings/api" element={<RoleProtectedRoute allowedRoles={['admin']}><ApiSettings /></RoleProtectedRoute>} />
      <Route path="/settings/notifications" element={<ProtectedRoute><NotificationServices /></ProtectedRoute>} />
      <Route path="/settings/thresholds" element={<ProtectedRoute><OperationalThresholds /></ProtectedRoute>} />
      <Route path="/settings/algorithms" element={<ProtectedRoute><OptimizationAlgorithms /></ProtectedRoute>} />
      <Route path="/settings/external" element={<ProtectedRoute><ExternalServices /></ProtectedRoute>} />
      <Route path="/settings/system-updates" element={<ProtectedRoute><SystemUpdates /></ProtectedRoute>} />
      
      <Route path="/ai/trainer" element={<ProtectedRoute><AIModelTrainer /></ProtectedRoute>} />
      <Route path="/device-view/:deviceId" element={<Navigate to={`/devices/${window.location.pathname.split('/').pop()}`} replace />} />
      <Route path="/devices/catalog" element={<ProtectedRoute><DeviceCatalog /></ProtectedRoute>} />
      <Route path="/devices/category/:categoryId" element={<ProtectedRoute><DeviceCategoryDetail /></ProtectedRoute>} />
      <Route path="/devices/model/:modelId" element={<ProtectedRoute><DeviceModelDetail /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
