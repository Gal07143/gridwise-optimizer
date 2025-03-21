
import React from 'react';
import { useMicrogrid } from './MicrogridProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge-extended';
import { RefreshCcw, Clock } from 'lucide-react';

interface MicrogridHeaderProps {
  title?: string;
}

const MicrogridHeader: React.FC<MicrogridHeaderProps> = ({ title = "Microgrid Control Center" }) => {
  const { 
    state,
    systemMode,
    refreshData,
    lastUpdated
  } = useMicrogrid();

  const getStatusBadgeColor = (connected: boolean) => {
    return connected ? "success" : "destructive";
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never";
    
    const date = new Date(lastUpdated);
    return date.toLocaleTimeString();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center mt-2 gap-2 text-sm text-muted-foreground">
          <Badge 
            variant={getStatusBadgeColor(state.gridConnection)}
          >
            {state.gridConnection ? "Grid Connected" : "Island Mode"}
          </Badge>
          <Badge variant="outline">
            {systemMode.charAt(0).toUpperCase() + systemMode.slice(1)} Mode
          </Badge>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated: {formatLastUpdated()}</span>
          </div>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={refreshData}>
        <RefreshCcw className="mr-2 h-4 w-4" />
        Refresh Data
      </Button>
    </div>
  );
};

export default MicrogridHeader;
