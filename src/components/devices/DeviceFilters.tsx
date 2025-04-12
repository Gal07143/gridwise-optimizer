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
import { Search, Filter, X, Calendar } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';

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
  manufacturer?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  connectivity?: string;
  firmwareVersion?: string;
}

const DeviceFilters: React.FC<DeviceFiltersProps> = ({
  onFilterChange,
  onSearch,
  onReset,
}) => {
  const [filters, setFilters] = React.useState<DeviceFilters>({});
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleFilterChange = (key: keyof DeviceFilters, value: any) => {
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
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-8"
                />
              </div>
            </div>
            <Button onClick={handleSearch} variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                <SelectItem value="battery">Battery</SelectItem>
                <SelectItem value="inverter">Inverter</SelectItem>
                <SelectItem value="meter">Smart Meter</SelectItem>
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
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.connectivity}
              onValueChange={(value) => handleFilterChange('connectivity', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Connectivity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modbus_tcp">Modbus TCP</SelectItem>
                <SelectItem value="modbus_rtu">Modbus RTU</SelectItem>
                <SelectItem value="mqtt">MQTT</SelectItem>
                <SelectItem value="ocpp">OCPP</SelectItem>
                <SelectItem value="bacnet">BACnet</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.manufacturer}
              onValueChange={(value) => handleFilterChange('manufacturer', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Manufacturer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="schneider">Schneider Electric</SelectItem>
                <SelectItem value="abb">ABB</SelectItem>
                <SelectItem value="siemens">Siemens</SelectItem>
                <SelectItem value="tesla">Tesla</SelectItem>
                <SelectItem value="sma">SMA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateRangePicker
              dateRange={filters.dateRange}
              onUpdate={(range) => handleFilterChange('dateRange', range)}
              className="w-full"
            />

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
                <SelectItem value="custom">Custom Range</SelectItem>
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