
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
import NotFound from './pages/NotFound';
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/devices/add" element={<AddDevice />} />
        <Route path="/devices/edit/:id" element={<EditDevice />} />
        <Route path="/energy-flow" element={<EnergyFlow />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/microgrid-control" element={<MicrogridControl />} />
        <Route path="/system-status" element={<SystemStatus />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Settings Pages */}
        <Route path="/settings/processing" element={<ProcessingSettings />} />
        <Route path="/settings/tariffs" element={<TariffSettings />} />
        <Route path="/settings/thresholds" element={<ThresholdsSettings />} />
        <Route path="/settings/algorithms" element={<AlgorithmsSettings />} />
        
        {/* Integration Pages */}
        <Route path="/integrations" element={<IntegrationsHome />} />
        <Route path="/integrations/category/:categoryId" element={<IntegrationCategoryPage />} />
        <Route path="/integrations/device-model/:id" element={<DeviceModelDetailPage />} />
        <Route path="/integrations/add-device-model" element={<AddDeviceModelPage />} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
