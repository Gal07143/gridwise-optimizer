import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

export interface DeviceFiltersProps {
  onFilterChange: (filters: DeviceFilters) => void;
  onSearch: (query: string) => void;
  onReset: () => void;
}

export interface DeviceFilters {
  type?: string;
  status?: string;
  location?: string;
  lastSeenRange?: string;
}

const DeviceFilters: React.FC<DeviceFiltersProps> = ({
  onFilterChange,
  onSearch,
  onReset,
}) => {
  const [filters, setFilters] = React.useState<DeviceFilters>({});
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleFilterChange = (key: keyof DeviceFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleReset = () => {
    setFilters({});
    setSearchQuery('');
    onReset();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Search & Filter Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <Button onClick={handleSearch} variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Device Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sensor">Sensor</SelectItem>
                <SelectItem value="actuator">Actuator</SelectItem>
                <SelectItem value="controller">Controller</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.lastSeenRange}
              onValueChange={(value) => handleFilterChange('lastSeenRange', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Last Seen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
            <Button
              variant="default"
              onClick={() => onFilterChange(filters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceFilters; 