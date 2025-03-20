
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
import IntegrationsHome from './pages/integrations/IntegrationsHome';
import IntegrationCategoryPage from './pages/integrations/IntegrationCategoryPage';
import DeviceModelDetailPage from './pages/integrations/DeviceModelDetailPage';
import AddDeviceModelPage from './pages/integrations/AddDeviceModelPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/energy-flow" element={<EnergyFlow />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/microgrid-control" element={<MicrogridControl />} />
        <Route path="/system-status" element={<SystemStatus />} />
        <Route path="/edit-device/:id" element={<EditDevice />} />
        
        {/* Integration Routes */}
        <Route path="/integrations" element={<IntegrationsHome />} />
        <Route path="/integrations/:categoryId" element={<IntegrationCategoryPage />} />
        <Route path="/integrations/device/:deviceId" element={<DeviceModelDetailPage />} />
        <Route path="/integrations/add-device-model" element={<AddDeviceModelPage />} />
      </Routes>
    </Router>
  );
}

export default App;
