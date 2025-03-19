
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeframeSelectorProps {
  timeframe: string;
  setTimeframe: (value: string) => void;
}

const TimeframeSelector = ({ timeframe, setTimeframe }: TimeframeSelectorProps) => {
  return (
    <Select value={timeframe} onValueChange={setTimeframe}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select timeframe" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="day">Last 24 Hours</SelectItem>
        <SelectItem value="week">Last 7 Days</SelectItem>
        <SelectItem value="month">Last 30 Days</SelectItem>
        <SelectItem value="year">Last 12 Months</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TimeframeSelector;
