
import React from 'react';
import { DateRange as DayPickerDateRange } from 'react-day-picker';
import { DateRange as SiteDateRange } from '@/types/site';

interface DateRangePickerProps {
  value: SiteDateRange;
  onChange: (dateRange: SiteDateRange) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  const handleChange = (range: DayPickerDateRange | undefined) => {
    if (range?.from) {
      onChange({
        from: range.from,
        to: range.to || range.from // Ensure 'to' is always defined
      });
    }
  };

  // Convert from our SiteDateRange to DayPickerDateRange
  const dayPickerValue: DayPickerDateRange = {
    from: value.from,
    to: value.to
  };

  // You would typically use react-day-picker's component here
  // For this example, we're just simulating it
  return (
    <div>
      <button onClick={() => handleChange({ from: new Date(), to: new Date() })}>
        Select Range
      </button>
      <span>
        {value.from.toLocaleDateString()} - {value.to.toLocaleDateString()}
      </span>
    </div>
  );
};

export default DateRangePicker;
