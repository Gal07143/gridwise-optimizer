// components/control/EVChargingControl.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';

const EVChargingControl = () => {
  const [status, setStatus] = useState<'charging' | 'idle' | 'error'>('idle');
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    const res = await axios.get('/api/control/status');
    setStatus(res.data.status);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCommand = async (command: 'start' | 'stop') => {
    setLoading(true);
    try {
      await axios.post(`/api/control/charge`, { action: command });
      setStatus(command === 'start' ? 'charging' : 'idle');
    } catch (err) {
      console.error('Failed to control charger');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>EV Charger Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm">
            <strong>Status:</strong> {status}
          </div>
          <div className="space-x-2">
            <Button onClick={() => handleCommand('start')} disabled={loading || status === 'charging'}>
              Start Charging
            </Button>
            <Button onClick={() => handleCommand('stop')} variant="destructive" disabled={loading || status === 'idle'}>
              Stop Charging
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EVChargingControl;
