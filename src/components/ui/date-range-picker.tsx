
import React from 'react';
import { DatePickerWithRange } from '@/components/ui/date-picker-range';
import { DateRange } from 'react-day-picker';

export interface DateRangePickerProps {
  dateRange: DateRange;
  onUpdate: (dateRange: DateRange) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  dateRange, 
  onUpdate,
  className 
}) => {
  return (
    <DatePickerWithRange
      date={dateRange}
      setDate={onUpdate}
      className={className}
    />
  );
};

export default DateRangePicker;
