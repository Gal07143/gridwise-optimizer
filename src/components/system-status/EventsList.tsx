
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventItem } from './EventItem';
import { SystemEvent } from '@/services/systemStatusService';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Filter } from 'lucide-react';

interface EventsListProps {
  events: SystemEvent[];
  isLoading?: boolean;
  onAcknowledge?: (id: string) => Promise<boolean>;
}

export const EventsList: React.FC<EventsListProps> = ({ 
  events = [], 
  isLoading = false,
  onAcknowledge
}) => {
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');
  
  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.severity === filter;
  });
  
  const handleAcknowledge = async (id: string) => {
    try {
      if (onAcknowledge) {
        const success = await onAcknowledge(id);
        if (success) {
          toast.success('Event acknowledged successfully');
        }
      }
    } catch (error) {
      toast.error('Failed to acknowledge event');
      console.error('Error acknowledging event:', error);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>System Events</CardTitle>
          <Button variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="warning">Warning</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            {renderEventList(filteredEvents, isLoading, handleAcknowledge)}
          </TabsContent>
          <TabsContent value="critical" className="mt-0">
            {renderEventList(filteredEvents, isLoading, handleAcknowledge)}
          </TabsContent>
          <TabsContent value="warning" className="mt-0">
            {renderEventList(filteredEvents, isLoading, handleAcknowledge)}
          </TabsContent>
          <TabsContent value="info" className="mt-0">
            {renderEventList(filteredEvents, isLoading, handleAcknowledge)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const renderEventList = (
  events: SystemEvent[], 
  isLoading: boolean, 
  onAcknowledge: (id: string) => void
) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }
  
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No events to display.
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {events.map(event => (
        <EventItem 
          key={event.id} 
          event={event} 
          onAcknowledge={onAcknowledge}
        />
      ))}
    </div>
  );
};

export default EventsList;
