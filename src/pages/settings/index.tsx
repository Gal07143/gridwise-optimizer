import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Settings = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings; 