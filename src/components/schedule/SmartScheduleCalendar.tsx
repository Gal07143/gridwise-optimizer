// components/schedule/SmartScheduleCalendar.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, CalendarEvent } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';

const SmartScheduleCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get('/api/schedule');
        const data = res.data || [];
        const formatted = data.map((e: any) => ({
          title: e.action,
          start: new Date(e.start_time),
          end: new Date(e.end_time),
          meta: e,
        }));
        setEvents(formatted);
      } catch (err) {
        console.error('Failed to fetch schedule', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Smart Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading schedule...</p>
        ) : (
          <Calendar
            events={events}
            eventRenderer={(event) => (
              <div className="p-1 text-xs">
                <strong>{event.title}</strong><br />
                {event.meta.device_name || 'EMS logic'}
              </div>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SmartScheduleCalendar;
