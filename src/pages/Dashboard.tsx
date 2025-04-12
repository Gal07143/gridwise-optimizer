import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDevices } from '@/contexts/DeviceContext';

const Dashboard = () => {
  const { devices, loading } = useDevices();

  const onlineDevices = devices.filter(device => device.status === 'online').length;
  const totalDevices = devices.length;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalDevices}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Online Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{onlineDevices}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Energy Production</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0 kWh</p>
            <p className="text-sm text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0 kWh</p>
            <p className="text-sm text-muted-foreground">Today</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 