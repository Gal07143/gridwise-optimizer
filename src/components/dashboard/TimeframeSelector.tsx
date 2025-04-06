
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface TimeframeSelectorProps {
  timeframe: string;
  onChange?: (timeframe: string) => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  timeframe = '24h',
  onChange,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleTimeframeChange = (newTimeframe: string) => {
    if (onChange) {
      onChange(newTimeframe);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    setDate(date);
    if (onChange && date) {
      onChange('custom');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center p-1 border rounded-lg bg-background">
        <Button
          variant={timeframe === '24h' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => handleTimeframeChange('24h')}
          className="text-xs px-2 py-1 h-auto"
        >
          24h
        </Button>
        <Button
          variant={timeframe === '7d' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleTimeframeChange('7d')}
          className="text-xs px-2 py-1 h-auto"
        >
          7d
        </Button>
        <Button
          variant={timeframe === '30d' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => handleTimeframeChange('30d')}
          className="text-xs px-2 py-1 h-auto"
        >
          30d
        </Button>
        <Button
          variant={timeframe === '1y' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => handleTimeframeChange('1y')}
          className="text-xs px-2 py-1 h-auto"
        >
          1y
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={timeframe === 'custom' ? 'default' : 'ghost'} 
              size="sm"
              className="text-xs px-2 py-1 h-auto"
            >
              <CalendarIcon className="mr-1 h-3 w-3" />
              {date ? format(date, 'dd MMM') : 'Custom'}
              <ChevronDownIcon className="ml-1 h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleCalendarSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TimeframeSelector;
