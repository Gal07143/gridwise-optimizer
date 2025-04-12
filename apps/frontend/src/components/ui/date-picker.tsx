import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  placeholderText?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const DateRangePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  className = '',
  placeholderText = 'Select date',
  minDate,
  maxDate,
}) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outine-none focus:ring-1 focus:ring-blue-500 ${className}`}
      placeholderText={placeholderText}
      minDate={minDate}
      maxDate={maxDate}
      dateFormat="MM/dd/yyyy"
    />
  );
}; 