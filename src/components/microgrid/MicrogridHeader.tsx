
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMicrogrid } from './MicrogridProvider';
import { Wifi, WifiOff, Clock } from 'lucide-react';

interface MicrogridHeaderProps {
  title?: string;
}

const MicrogridHeader: React.FC<MicrogridHeaderProps> = ({ title = 'Microgrid Controller' }) => {
  const { state, handleModeChange, handleGridConnectionToggle } = useMicrogrid();
  
  // Format the last updated time
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-muted-foreground flex items-center gap-1">
          <Clock className="h-4 w-4" />
          Last updated: {formatLastUpdated(state.lastUpdated)}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <div>
          <span className="mr-2 text-sm text-muted-foreground">System Mode:</span>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {['auto', 'manual', 'eco', 'backup'].map((mode) => (
              <Button
                key={mode}
                variant={state.systemMode === mode ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleModeChange(mode as 'auto' | 'manual' | 'eco' | 'backup')}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Grid:</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGridConnectionToggle}
            className={state.gridConnection ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}
          >
            {state.gridConnection ? 
              <><Wifi className="h-4 w-4 mr-1" /> Connected</> : 
              <><WifiOff className="h-4 w-4 mr-1" /> Disconnected</>
            }
          </Button>
        </div>
        
        <div>
          <Badge variant="secondary">
            Frequency: {state.frequency.toFixed(1)} Hz
          </Badge>
        </div>
        
        <div>
          <Badge variant="secondary">
            Voltage: {state.voltage.toFixed(1)} V
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default MicrogridHeader;
