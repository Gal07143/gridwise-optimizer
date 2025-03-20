import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Sites from './pages/settings/Sites';
import Users from './pages/settings/Users';
import ReportsPage from './pages/Reports';
import EnergyFlow from './pages/EnergyFlow';
import Analytics from './pages/Analytics';
import MicrogridControl from './pages/MicrogridControl';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/sites" element={<Sites />} />
        <Route path="/settings/users" element={<Users />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/energy-flow" element={<EnergyFlow />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/microgrid-control" element={<MicrogridControl />} />
      </Routes>
    </Router>
  );
}

export default App;
