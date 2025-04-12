import React from 'react';
import { Outlet } from 'react-router-dom';

const Settings: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Outlet />
    </div>
  );
};

export default Settings; 