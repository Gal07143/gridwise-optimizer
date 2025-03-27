
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, AlertCircle, Info, Bell } from 'lucide-react';
import { EventItem } from './EventItem';
import { SystemEvent } from '@/services/systemStatusService';
import { toast } from 'sonner';

interface EventsListProps {
  events: SystemEvent[];
  isLoading?: boolean;
  onAcknowledge?: (eventId: string) => Promise<boolean>;
}

export const EventsList: React.FC<EventsListProps> = ({ 
  events = [], 
  isLoading = false,
  onAcknowledge 
}) => {
  const unacknowledgedCount = events.filter(e => !e.acknowledged).length;
  
  const handleAcknowledge = async (eventId: string) => {
    if (onAcknowledge) {
      const success = await onAcknowledge(eventId);
      if (success) {
        toast.success('Event acknowledged');
      }
    } else {
      // If no handler provided, just show a toast
      toast.success('Event would be acknowledged in a real implementation');
    }
  };

  const getEventIcon = (severity: string) => {
    switch (severity) {
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            <span>System Events</span>
            {unacknowledgedCount > 0 && (
              <Badge className="ml-2 bg-red-500">{unacknowledgedCount} new</Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-4 p-3 border rounded-md">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-3">
            {events.map(event => (
              <div key={event.id} className="p-3 border rounded-md flex items-start gap-3 relative">
                <div className="mt-1">{getEventIcon(event.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 items-center mb-1">
                    <span className="font-medium">{event.source}</span>
                    {getSeverityBadge(event.severity)}
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
                {!event.acknowledged && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="self-start"
                    onClick={() => handleAcknowledge(event.id)}
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-md">
            <p className="text-muted-foreground">No events to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsList;
