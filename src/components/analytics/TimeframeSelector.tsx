
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface TimeframeOption {
  value: string;
  label: string;
}

export interface TimeframeSelectorProps {
  timeframe: string;
  onChange: (timeframe: string) => void;
  className?: string;
  options?: TimeframeOption[];
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  timeframe,
  onChange,
  className,
  options = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' }
  ]
}) => {
  return (
    <div className={cn('inline-flex rounded-md border bg-background', className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={timeframe === option.value ? 'default' : 'ghost'}
          size="sm"
          className={cn(
            'h-8 rounded-none border-0',
            timeframe === option.value ? '' : 'text-muted-foreground',
            option.value === options[0].value && 'rounded-l-md',
            option.value === options[options.length - 1].value && 'rounded-r-md'
          )}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeframeSelector;
