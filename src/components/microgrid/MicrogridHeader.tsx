
import React from 'react';
import { Battery, Clock, Gauge } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMicrogrid } from './MicrogridProvider';

const MicrogridHeader: React.FC = () => {
  const { state, handleGridConnectionToggle, handleModeChange } = useMicrogrid();
  
  // Function to format the timestamp
  const formatTimestamp = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">System Status</h2>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Last updated: {formatTimestamp(new Date(state.lastUpdated))}
            </span>
            <Badge variant={state.gridConnection ? "default" : "outline"}>
              {state.gridConnection ? "Grid Connected" : "Island Mode"}
            </Badge>
            <Badge variant="outline" className="bg-primary/10">
              {state.systemMode.charAt(0).toUpperCase() + state.systemMode.slice(1)} Mode
            </Badge>
          </div>
        </div>
        
        <div className="flex space-x-4 md:space-x-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Battery className="w-5 h-5 mr-1 text-green-500" />
              <span className="text-sm font-medium">Battery</span>
            </div>
            <div className="text-2xl font-bold">{state.batteryLevel}%</div>
            <div className="text-xs text-muted-foreground">
              {state.batteryCharging ? "Charging" : "Discharging"}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Gauge className="w-5 h-5 mr-1 text-blue-500" />
              <span className="text-sm font-medium">Load</span>
            </div>
            <div className="text-2xl font-bold">{state.loadDemand} kW</div>
            <div className="text-xs text-muted-foreground">Current Demand</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MicrogridHeader;
