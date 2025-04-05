// components/control/EVChargingControl.tsx
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { BatteryCharging, BatteryMedium, AlertOctagon, Gauge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ChargerStatus = 'charging' | 'idle' | 'error' | 'disconnected' | 'scheduled';

interface ChargerState {
  status: ChargerStatus;
  currentPower?: number;
  energyDelivered?: number;
  connectedVehicle?: string;
  timeRemaining?: number;
  voltage?: number;
  current?: number;
  maxCurrent?: number;
  lastUpdated?: string;
}

const fetchChargerStatus = async (): Promise<ChargerState> => {
  try {
    const res = await axios.get('/api/control/status');
    return res.data;
  } catch (err) {
    console.error('Failed to fetch charger status:', err);
    throw new Error('Failed to fetch charger status');
  }
};

const sendChargerCommand = async (command: 'start' | 'stop'): Promise<ChargerState> => {
  try {
    const res = await axios.post(`/api/control/charge`, { action: command });
    return res.data;
  } catch (err) {
    console.error('Failed to control charger:', err);
    throw new Error('Failed to control charger');
  }
};

const EVChargingControl = () => {
  const { toast } = useToast();

  const { 
    data: chargerState, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['charger-status'],
    queryFn: fetchChargerStatus,
    refetchInterval: 10000, // Refresh every 10 seconds
    retry: 3,
  });

  const mutation = useMutation({
    mutationFn: sendChargerCommand,
    onSuccess: (data) => {
      refetch(); // Refresh the status after command
      toast({
        title: `Charging ${data.status === 'charging' ? 'Started' : 'Stopped'}`,
        description: `Charger is now ${data.status}`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Command Failed",
        description: error instanceof Error ? error.message : "Failed to control charger",
        variant: "destructive",
      });
    },
  });

  // Status indicator styling based on state
  const getStatusBadge = () => {
    if (!chargerState) return null;
    
    switch (chargerState.status) {
      case 'charging':
        return <Badge variant="default" className="bg-green-500">Charging</Badge>;
      case 'idle':
        return <Badge variant="outline">Idle</Badge>;
      case 'scheduled':
        return <Badge variant="secondary" className="bg-blue-500 text-white">Scheduled</Badge>;
      case 'disconnected':
        return <Badge variant="outline" className="text-gray-500">Disconnected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderStateDetails = () => {
    if (!chargerState) return null;
    
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
        {chargerState.currentPower !== undefined && (
          <div className="text-sm">
            <span className="text-muted-foreground">Current Power:</span>{' '}
            <span className="font-medium">{chargerState.currentPower} kW</span>
          </div>
        )}
        
        {chargerState.energyDelivered !== undefined && (
          <div className="text-sm">
            <span className="text-muted-foreground">Energy Delivered:</span>{' '}
            <span className="font-medium">{chargerState.energyDelivered} kWh</span>
          </div>
        )}
        
        {chargerState.voltage !== undefined && (
          <div className="text-sm">
            <span className="text-muted-foreground">Voltage:</span>{' '}
            <span className="font-medium">{chargerState.voltage} V</span>
          </div>
        )}
        
        {chargerState.current !== undefined && (
          <div className="text-sm">
            <span className="text-muted-foreground">Current:</span>{' '}
            <span className="font-medium">{chargerState.current} A</span>
          </div>
        )}
        
        {chargerState.timeRemaining !== undefined && (
          <div className="text-sm col-span-2">
            <span className="text-muted-foreground">Time Remaining:</span>{' '}
            <span className="font-medium">
              {Math.floor(chargerState.timeRemaining / 60)}h {chargerState.timeRemaining % 60}m
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderError = () => (
    <div className="flex items-center justify-center p-4 text-red-500">
      <AlertOctagon className="h-5 w-5 mr-2" />
      <span>Failed to load charger status</span>
    </div>
  );

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <BatteryCharging className="h-5 w-5 mr-2 text-blue-500" />
          EV Charger Control
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <Gauge className="h-6 w-6 animate-pulse text-blue-500" />
          </div>
        ) : error ? (
          renderError()
        ) : (
          <div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center">
                <BatteryMedium 
                  className={`h-7 w-7 mr-2 ${
                    chargerState?.status === 'charging' ? 'text-green-500 animate-pulse' : 'text-gray-400'
                  }`} 
                />
                <div>
                  <div className="font-medium">Status</div>
                  <div>{getStatusBadge()}</div>
                </div>
              </div>
              
              {chargerState?.connectedVehicle && (
                <div className="text-sm text-right">
                  <div className="text-muted-foreground">Connected Vehicle</div>
                  <div className="font-medium">{chargerState.connectedVehicle}</div>
                </div>
              )}
            </div>
            
            {renderStateDetails()}
            
            {chargerState?.lastUpdated && (
              <div className="text-xs text-muted-foreground mt-4">
                Last updated: {new Date(chargerState.lastUpdated).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 justify-between">
<Button 
  variant="default"
  size="sm" 
  disabled={startCharging.isPending} // changed from isLoading to isPending
  onClick={handleStartCharge}
  className="w-full"
>
  {startCharging.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
  Start Charging
</Button>

// Around line 214
<Button 
  variant="secondary"
  size="sm" 
  disabled={stopCharging.isPending} // changed from isLoading to isPending
  onClick={handleStopCharge}
  className="w-full"
>
  {stopCharging.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <StopCircle className="mr-2 h-4 w-4" />}
  Stop Charging
</Button>
      </CardFooter>
    </Card>
  );
};

export default EVChargingControl;
