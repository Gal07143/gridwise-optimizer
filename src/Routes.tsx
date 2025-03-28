
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
import OperationalThresholds from "./pages/settings/OperationalThresholds";
import OptimizationAlgorithms from "./pages/settings/OptimizationAlgorithms";
import ExternalServices from "@/pages/settings/ExternalServices";

// Authentication components
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleProtectedRoute from '@/components/auth/RoleProtectedRoute';

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={
        user ? <Navigate to="/" replace /> : <Auth />
      } />
      
      {/* Redirect root to dashboard if logged in */}
      <Route path="/" element={
        user ? <Navigate to="/dashboard" replace /> : <Index />
      } />

      {/* Protected routes - require authentication */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Device routes */}
      <Route path="/devices" element={
        <ProtectedRoute>
          <Devices />
        </ProtectedRoute>
      } />
      <Route path="/devices/add" element={
        <ProtectedRoute>
          <AddDevice />
        </ProtectedRoute>
      } />
      <Route path="/add-device" element={
        <ProtectedRoute>
          <Navigate to="/devices/add" replace />
        </ProtectedRoute>
      } />
      <Route path="/devices/:deviceId" element={
        <ProtectedRoute>
          <DeviceView />
        </ProtectedRoute>
      } />
      <Route path="/devices/:deviceId/edit" element={
        <ProtectedRoute>
          <EditDevice />
        </ProtectedRoute>
      } />
      
      {/* Energy management routes */}
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/consumption" element={
        <ProtectedRoute>
          <Consumption />
        </ProtectedRoute>
      } />
      <Route path="/production" element={
        <ProtectedRoute>
          <Production />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/alerts" element={
        <ProtectedRoute>
          <Alerts />
        </ProtectedRoute>
      } />
      <Route path="/energy-flow" element={
        <ProtectedRoute>
          <EnergyFlow />
        </ProtectedRoute>
      } />
      <Route path="/microgrid-control" element={
        <ProtectedRoute>
          <MicrogridControl />
        </ProtectedRoute>
      } />
      
      {/* New Energy Management Pages */}
      <Route path="/battery-management" element={
        <ProtectedRoute>
          <BatteryManagement />
        </ProtectedRoute>
      } />
      <Route path="/energy-optimization" element={
        <ProtectedRoute>
          <EnergyOptimization />
        </ProtectedRoute>
      } />
      <Route path="/weather-forecast" element={
        <ProtectedRoute>
          <WeatherForecast />
        </ProtectedRoute>
      } />
      
      {/* Integration routes */}
      <Route path="/integrations" element={
        <ProtectedRoute>
          <IntegrationsHome />
        </ProtectedRoute>
      } />
      <Route path="/integrations/:categoryId" element={
        <ProtectedRoute>
          <IntegrationCategoryPage />
        </ProtectedRoute>
      } />
      {/* Fixed route for device model - adding both paths */}
      <Route path="/integrations/model/:modelId" element={
        <ProtectedRoute>
          <DeviceModelDetailPage />
        </ProtectedRoute>
      } />
      {/* Add the route that users are actually trying to access */}
      <Route path="/integrations/device-model/:modelId" element={
        <ProtectedRoute>
          <DeviceModelDetailPage />
        </ProtectedRoute>
      } />
      <Route path="/integrations/model/add" element={
        <ProtectedRoute>
          <AddDeviceModelPage />
        </ProtectedRoute>
      } />
      <Route path="/integrations/model/:modelId/edit" element={
        <ProtectedRoute>
          <EditDeviceModelPage />
        </ProtectedRoute>
      } />
      <Route path="/integrations/mqtt" element={
        <ProtectedRoute>
          <MQTTIntegration />
        </ProtectedRoute>
      } />
      
      {/* Communication Devices routes */}
      <Route path="/integrations/communication" element={
        <ProtectedRoute>
          <CommunicationDevices />
        </ProtectedRoute>
      } />
      <Route path="/integrations/communication/:deviceId" element={
        <ProtectedRoute>
          <CommunicationDeviceDetail />
        </ProtectedRoute>
      } />

      {/* Integration category specific routes */}
      <Route path="/integrations/batteries" element={
        <ProtectedRoute>
          <IntegrationCategoryPage />
        </ProtectedRoute>
      } />
      <Route path="/integrations/inverters" element={
        <ProtectedRoute>
          <IntegrationCategoryPage />
        </ProtectedRoute>
      } />
      <Route path="/integrations/ev-chargers" element={
        <ProtectedRoute>
          <IntegrationCategoryPage />
        </ProtectedRoute>
      } />
      <Route path="/integrations/meters" element={
        <ProtectedRoute>
          <IntegrationCategoryPage />
        </ProtectedRoute>
      } />
      <Route path="/integrations/controllers" element={
        <ProtectedRoute>
          <IntegrationCategoryPage />
        </ProtectedRoute>
      } />
      
      {/* System routes */}
      <Route path="/system-status" element={
        <ProtectedRoute>
          <SystemStatus />
        </ProtectedRoute>
      } />
      <Route path="/security" element={
        <RoleProtectedRoute allowedRoles={['admin']}>
          <Security />
        </RoleProtectedRoute>
      } />
      
      {/* Settings routes */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/settings/user" element={
        <ProtectedRoute>
          <UserSettings />
        </ProtectedRoute>
      } />
      <Route path="/settings/sites" element={
        <ProtectedRoute>
          <SiteSettings />
        </ProtectedRoute>
      } />
      <Route path="/settings/sites/add" element={
        <RoleProtectedRoute allowedRoles={['admin', 'installer']}>
          <AddSite />
        </RoleProtectedRoute>
      } />
      <Route path="/settings/sites/:siteId/edit" element={
        <RoleProtectedRoute allowedRoles={['admin', 'installer']}>
          <EditSite />
        </RoleProtectedRoute>
      } />
      <Route path="/settings/tariffs" element={
        <ProtectedRoute>
          <TariffSettings />
        </ProtectedRoute>
      } />
      <Route path="/settings/api" element={
        <RoleProtectedRoute allowedRoles={['admin']}>
          <ApiSettings />
        </RoleProtectedRoute>
      } />
      <Route path="/settings/notifications" element={
        <ProtectedRoute>
          <NotificationServices />
        </ProtectedRoute>
      } />
      <Route path="/settings/thresholds" element={<OperationalThresholds />} />
      <Route path="/settings/algorithms" element={<OptimizationAlgorithms />} />
      
      {/* Support for legacy route that may be linked in other places */}
      <Route path="/device-view/:deviceId" element={
        <Navigate to={`/devices/${window.location.pathname.split('/').pop()}`} replace />
      } />
      
      {/* 404 route - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
