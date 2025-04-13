
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const Settings: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">System Settings</h1>
      <div className="grid grid-cols-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
