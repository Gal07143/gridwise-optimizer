
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
// We're redirecting to the main Routes.tsx for all routing
// This file will be deprecated soon

const AppRoutes: React.FC = () => {
  console.warn('Using deprecated AppRoutes.tsx file. Please update imports to use Routes.tsx instead.');
  
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/devices" element={<Devices />} />
      <Route path="/settings/*" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
