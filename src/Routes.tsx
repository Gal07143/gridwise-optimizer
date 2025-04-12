import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Devices from './pages/Devices';
import DeviceDetails from './pages/devices/DeviceDetails';
import ModbusDevices from './pages/modbus/ModbusDevices';
import Settings from './pages/settings/Settings';
import SecuritySettings from './pages/settings/SecuritySettings';
import UserSettings from './pages/settings/UserSettings';
import SiteSettings from './pages/settings/SiteSettings';
import SmartGrid from './pages/SmartGrid';
import SystemTopology from './pages/SystemTopology';
import EnergyOptimization from './pages/EnergyOptimization';
import NotFound from './pages/errors/NotFound';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      {/* Primary Routes */}
      <Route index element={<Dashboard />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="consumption" element={<Analytics />} />
      <Route path="telemetry" element={<Analytics />} />
      <Route path="reports" element={<Analytics />} />

      {/* Devices */}
      <Route path="devices" element={<Devices />} />
      <Route path="devices/:deviceId" element={<DeviceDetails />} />
      <Route path="modbus/devices" element={<ModbusDevices />} />

      {/* Smart Grid */}
      <Route path="smart-grid" element={<SmartGrid />} />
      <Route path="system-topology" element={<SystemTopology />} />
      <Route path="energy-optimization" element={<EnergyOptimization />} />

      {/* Settings */}
      <Route path="settings" element={<Settings />}>
        <Route path="security" element={<SecuritySettings />} />
        <Route path="users" element={<UserSettings />} />
        <Route path="sites" element={<SiteSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
