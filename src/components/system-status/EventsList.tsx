
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventItem } from './EventItem';
import { SystemEvent } from '@/types/system';

interface EventsListProps {
  events: SystemEvent[];
}

export const EventsList: React.FC<EventsListProps> = ({ events }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent System Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}

          {events.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No system events recorded
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
