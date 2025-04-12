import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import EnergyManagementLayout from './pages/energy-management/layout';
import EnergyManagementDashboard from './pages/energy-management';
import EnergyAssets from './pages/energy-management/assets';
import GridSignals from './pages/energy-management/signals';
import SecuritySettings from './pages/settings/SecuritySettings';
import UserSettings from './pages/settings/UserSettings';
import NotFound from './pages/NotFound';

// Pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Devices from './pages/devices/DevicesPage';
import DeviceView from './pages/DeviceView';
import ModbusDevices from './pages/modbus/ModbusDevices';
import Settings from './pages/settings/Settings';
import SiteSettings from './pages/settings/SiteSettings';
import SmartGrid from './pages/SmartGrid';
import SystemTopology from './pages/SystemTopology';
import EnergyOptimization from './pages/EnergyOptimization';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Main Layout */}
            <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="sites" element={<SiteSettings />} />
            </Route>

            {/* Energy Management */}
            <Route path="energy-management" element={<EnergyManagementLayout />}>
                <Route index element={<EnergyManagementDashboard />} />
                <Route path="dashboard" element={<EnergyManagementDashboard />} />
                <Route path="assets" element={<EnergyAssets />} />
                <Route path="signals" element={<GridSignals />} />
            </Route>

            {/* Settings */}
            <Route path="settings" element={<Settings />}>
                <Route path="security" element={<SecuritySettings />} />
                <Route path="user" element={<UserSettings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
