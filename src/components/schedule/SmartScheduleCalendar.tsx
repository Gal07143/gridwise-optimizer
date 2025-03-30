
// components/schedule/SmartScheduleCalendar.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar as CalendarIcon, Plus, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';

// Define the event types that match the Calendar component expectations
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  meta?: any;
}

// Define the raw event data from the API
interface ScheduleEvent {
  id: string;
  action: string;
  start_time: string;
  end_time: string;
  device_name?: string;
  device_id?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'error';
  priority?: number;
  created_by?: string;
  notes?: string;
}

// Fetch schedule events from the API
const fetchSchedule = async (): Promise<ScheduleEvent[]> => {
  try {
    const res = await axios.get('/api/schedule');
    return res.data || [];
  } catch (err) {
    console.error('Failed to fetch schedule:', err);
    throw new Error('Failed to fetch schedule');
  }
};

// Convert API data to calendar event format
const formatEvents = (events: ScheduleEvent[]): CalendarEvent[] => {
  return events.map(event => ({
    id: event.id,
    title: event.action,
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    meta: event
  }));
};

const SmartScheduleCalendar = () => {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Query for fetching schedule data
  const { 
    data: scheduleData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['schedule-events'],
    queryFn: fetchSchedule,
    refetchInterval: 60000, // Refresh every minute
  });

  // Format the schedule data for the calendar
  const events = scheduleData ? formatEvents(scheduleData) : [];

  // Mutations for adding or removing schedule events could be added here
  
  // Function to handle the refresh button
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing Schedule",
      description: "The schedule calendar is updating...",
    });
  };

  // Function to handle event click
  const handleEventClick = (event: CalendarEvent) => {
    toast({
      title: event.title,
      description: `${format(event.start, 'PPp')} - ${format(event.end, 'PPp')}`,
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Smart Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Smart Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-10">
            Failed to load schedule. Please try again later.
          </div>
          <Button onClick={handleRefresh} variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Smart Schedule
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={handleRefresh} className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Schedule Event</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {/* Add a form here for creating new events */}
                <p className="text-muted-foreground">
                  Schedule form would go here - this is a placeholder for demonstration.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Event Scheduled",
                    description: "Your event has been added to the schedule."
                  });
                  setShowAddDialog(false);
                }}>
                  Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar
          events={events}
          mode="month"
          onDateSelect={setSelectedDate}
          onEventClick={handleEventClick}
          eventRenderer={(event) => (
            <div className="p-1 text-xs bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 rounded">
              <div className="font-bold truncate">{event.title}</div>
              <div className="truncate">{event.meta?.device_name || 'System'}</div>
            </div>
          )}
          className="border rounded-md"
        />
      </CardContent>
      <CardFooter>
        <div className="w-full text-xs text-muted-foreground">
          {scheduleData && scheduleData.length > 0 ? (
            <span>Showing {scheduleData.length} scheduled events</span>
          ) : (
            <span>No scheduled events. Click "New Event" to create one.</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SmartScheduleCalendar;
