
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle, Info } from 'lucide-react';
import { SystemEvent } from '@/services/systemStatusService';

interface EventItemProps {
  event: SystemEvent;
  onAcknowledge?: (id: string) => void;
}

export const EventItem: React.FC<EventItemProps> = ({ event, onAcknowledge }) => {
  const getEventIcon = () => {
    switch (event.severity) {
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = () => {
    switch (event.severity) {
      case 'info': 
        return <Badge className="bg-blue-500">Info</Badge>;
      case 'warning': 
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'critical': 
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="p-3 border rounded-md flex items-start gap-3 relative">
      <div className="mt-1">{getEventIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2 items-center mb-1">
          <span className="font-medium">{event.source}</span>
          {getSeverityBadge()}
        </div>
        <p className="text-sm mb-1">{event.message}</p>
        <div className="text-xs text-muted-foreground flex items-center gap-4">
          <span>{new Date(event.timestamp).toLocaleString()}</span>
          {event.acknowledged && (
            <span className="flex items-center text-green-500">
              <Check className="h-3 w-3 mr-1" /> Acknowledged
            </span>
          )}
        </div>
      </div>
      {!event.acknowledged && onAcknowledge && (
        <Button 
          size="sm" 
          variant="outline" 
          className="self-start"
          onClick={() => onAcknowledge(event.id)}
        >
          Acknowledge
        </Button>
      )}
    </div>
  );
};

export default EventItem;
