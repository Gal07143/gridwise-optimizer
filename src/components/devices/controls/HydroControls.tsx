// src/components/device/controls/HydroControls.tsx

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface HydroControlsProps {
  deviceId: string;
}

const HydroControls: React.FC<HydroControlsProps> = ({ deviceId }) => {
  const [flow, setFlow] = useState<number>(0);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSetFlow = async () => {
    setLoading('flow');
    try {
      console.log(`Set hydro turbine ${deviceId} flow to ${flow} L/s`);
      toast({ title: `Flow set to ${flow} L/s` });
    } catch (error) {
      toast({ title: 'Failed to set flow', variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  const handleEmergencyStop = async () => {
    setLoading('stop');
    try {
      console.log(`Emergency stop triggered on hydro ${deviceId}`);
      toast({ title: 'Emergency stop sent!' });
    } catch (error) {
      toast({ title: 'Failed to trigger stop', variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Hydro Turbine Control</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={flow}
            onChange={(e) => setFlow(parseFloat(e.target.value))}
            placeholder="Flow rate (L/s)"
          />
          <Button onClick={handleSetFlow} disabled={loading === 'flow'}>
            {loading === 'flow' && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Set Flow
          </Button>
        </div>

        <Button
          variant="destructive"
          onClick={handleEmergencyStop}
          disabled={loading === 'stop'}
        >
          {loading === 'stop' && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          Emergency Stop
        </Button>
      </CardContent>
    </Card>
  );
};

export default HydroControls;
