
import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import { DeviceOverview } from './components/dashboard/DeviceOverview';
import EnergyDashboard from './pages/energy-management/EnergyDashboard';

const AppRoutes: React.FC = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="devices/:deviceId" element={<DeviceOverview deviceId="demo-device" deviceName="Smart Meter" />} />
        <Route path="energy-management" element={<EnergyDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </RouterRoutes>
  );
};

export default AppRoutes;
