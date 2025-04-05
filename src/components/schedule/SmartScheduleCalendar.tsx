import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CalendarIcon, AlertCircle } from 'lucide-react';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'maintenance' | 'alert' | 'reminder' | 'scheduled-operation';
  description?: string;
  color?: string;
}

interface SmartScheduleCalendarProps {
  events: CalendarEvent[];
  onDateSelect: Dispatch<SetStateAction<Date>>;
  onEventClick: (event: CalendarEvent) => void;
  eventRenderer?: (event: CalendarEvent) => React.ReactNode;
  className?: string;
}

const SmartScheduleCalendar: React.FC<SmartScheduleCalendarProps> = ({
  events,
  onDateSelect,
  onEventClick,
  eventRenderer,
  className
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [visibleEvents, setVisibleEvents] = useState<CalendarEvent[]>([]);
  const [viewMode, setViewMode] = useState<'day' | 'month'>('month');
  
  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect(date);
      
      // Switch to day view when selecting a date
      setViewMode('day');
    }
  };
  
  // Filter events for the selected date in day view
  useEffect(() => {
    if (viewMode === 'day' && selectedDate) {
      const dateEvents = events.filter(event => 
        event.date.getFullYear() === selectedDate.getFullYear() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getDate() === selectedDate.getDate()
      );
      setVisibleEvents(dateEvents);
    }
  }, [events, selectedDate, viewMode]);
  
  // Get events for a specific day (used by the calendar component)
  const getDayEvents = (day: Date): CalendarEvent[] => {
    return events.filter(event => 
      event.date.getFullYear() === day.getFullYear() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getDate() === day.getDate()
    );
  };
  
  // Custom day rendering to show event indicators
  const renderDay = (day: Date) => {
    const dayEvents = getDayEvents(day);
    const hasEvents = dayEvents.length > 0;
    
    if (!hasEvents) return undefined;
    
    // Group events by type for the indicators
    const hasMaintenance = dayEvents.some(e => e.type === 'maintenance');
    const hasAlert = dayEvents.some(e => e.type === 'alert');
    const hasOperation = dayEvents.some(e => e.type === 'scheduled-operation');
    const hasReminder = dayEvents.some(e => e.type === 'reminder');
    
    return (
      <div className="relative h-full w-full p-1">
        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
          {hasMaintenance && <div className="h-1 w-1 rounded-full bg-blue-500" />}
          {hasAlert && <div className="h-1 w-1 rounded-full bg-red-500" />}
          {hasOperation && <div className="h-1 w-1 rounded-full bg-green-500" />}
          {hasReminder && <div className="h-1 w-1 rounded-full bg-yellow-500" />}
        </div>
      </div>
    );
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    const date = new Date(selectedMonth);
    date.setMonth(date.getMonth() - 1);
    setSelectedMonth(date);
  };
  
  // Navigate to next month
  const nextMonth = () => {
    const date = new Date(selectedMonth);
    date.setMonth(date.getMonth() + 1);
    setSelectedMonth(date);
  };
  
  // Navigate to today
  const goToToday = () => {
    const today = new Date();
    setSelectedMonth(today);
    setSelectedDate(today);
    onDateSelect(today);
  };
  
  // Custom renderer for event items
  const defaultEventRenderer = (event: CalendarEvent) => {
    const getEventColor = () => {
      if (event.color) return event.color;
      
      switch(event.type) {
        case 'maintenance': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'alert': return 'bg-red-100 text-red-700 border-red-200';
        case 'scheduled-operation': return 'bg-green-100 text-green-700 border-green-200';
        case 'reminder': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    };
    
    const getEventIcon = () => {
      switch(event.type) {
        case 'alert': return <AlertCircle className="h-4 w-4 mr-1 text-red-600" />;
        default: return <CalendarIcon className="h-4 w-4 mr-1" />;
      }
    };
    
    return (
      <div 
        key={event.id} 
        className={`px-3 py-2 mb-2 rounded-md border ${getEventColor()} cursor-pointer hover:opacity-80 transition-opacity`}
        onClick={() => onEventClick(event)}
      >
        <div className="flex items-center">
          {getEventIcon()}
          <span className="font-medium">{event.title}</span>
        </div>
        {event.description && (
          <p className="mt-1 text-sm truncate">{event.description}</p>
        )}
        <div className="mt-1 text-xs opacity-70">
          {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Schedule</CardTitle>
          <div className="flex space-x-2">
            <Select 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as 'day' | 'month')}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="month">Month View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium">
            {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        {viewMode === 'day' && (
          <Badge className="self-start">
            {selectedDate.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {viewMode === 'month' ? (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={selectedMonth}
            onMonthChange={setSelectedMonth}
            className="border rounded-md p-2"
            components={{
              Day: ({ date, ...props }) => (
                <div {...props}>
                  <div>{date.getDate()}</div>
                  {renderDay(date)}
                </div>
              )
            }}
          />
        ) : (
          <div className="space-y-1 mt-4 max-h-96 overflow-y-auto">
            {visibleEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No events scheduled for this day
              </div>
            ) : (
              visibleEvents.map(event => (
                eventRenderer ? eventRenderer(event) : defaultEventRenderer(event)
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartScheduleCalendar;
