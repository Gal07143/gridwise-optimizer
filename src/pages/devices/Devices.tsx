import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevices } from '@/contexts/DeviceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Devices = () => {
  const navigate = useNavigate();
  const { devices, loading, error, fetchDevices } = useDevices();

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Loading devices...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Devices</h1>
        <Button onClick={() => navigate('/devices/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </div>

      {devices.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No devices found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <Card
              key={device.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate(`/devices/${device.id}`)}
            >
              <CardHeader>
                <CardTitle>{device.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{device.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protocol:</span>
                    <span>{device.protocol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={device.status === 'online' ? 'text-green-500' : 'text-red-500'}>
                      {device.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Devices; 