
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export interface TimeframeSelectorProps {
  timeframe: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  className?: string;
}

const defaultOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  timeframe,
  onChange,
  options = defaultOptions,
  className = '',
}) => {
  return (
    <ToggleGroup
      type="single"
      value={timeframe}
      onValueChange={(value) => {
        if (value) onChange(value);
      }}
      className={`inline-flex rounded-md border p-1 bg-background ${className}`}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className="px-3 py-1 text-sm rounded-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          aria-label={`Show ${option.label.toLowerCase()} data`}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default TimeframeSelector;
