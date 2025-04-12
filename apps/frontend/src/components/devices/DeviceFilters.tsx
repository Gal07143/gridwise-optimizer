import React from 'react';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DeviceFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const DeviceFilters: React.FC<DeviceFiltersProps> = ({ onFilterChange }) => {
  const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>([null, null]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    onFilterChange({ dateRange: dates });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <DatePicker
              selected={dateRange[0]}
              onChange={(dates) => handleDateChange(dates as [Date | null, Date | null])}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              selectsRange
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-1 flex items-end">
            <Button variant="primary" onClick={() => onFilterChange({})}>
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 