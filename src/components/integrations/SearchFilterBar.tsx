
import React from 'react';
import { Search, SlidersHorizontal, ArrowDownAZ, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuCheckboxItem 
} from '@/components/ui/dropdown-menu';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
}) => {
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
  
  // Dummy filter options for demonstration
  const filterOptions = [
    { id: 'protocol-modbus', label: 'Modbus Protocol' },
    { id: 'protocol-bacnet', label: 'BACnet Protocol' },
    { id: 'protocol-mqtt', label: 'MQTT Protocol' },
    { id: 'status-active', label: 'Active Status' },
    { id: 'status-inactive', label: 'Inactive Status' },
  ];
  
  const handleFilterToggle = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };
  
  const clearSearch = () => {
    onSearchChange('');
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by manufacturer, model or protocol..." 
            className="pl-10 bg-background pr-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6" 
              onClick={clearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilters.length > 0 && (
                  <Badge className="ml-2 bg-primary text-primary-foreground" variant="default">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filterOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.id}
                  checked={activeFilters.includes(option.id)}
                  onCheckedChange={() => handleFilterToggle(option.id)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-center"
                  onClick={clearFilters}
                  disabled={activeFilters.length === 0}
                >
                  Clear filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <ArrowDownAZ className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuCheckboxItem checked>
                Newest first
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Oldest first
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Name (A-Z)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Name (Z-A)
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full sm:w-auto">
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            <TabsTrigger value="all" className="px-4">All</TabsTrigger>
            <TabsTrigger value="supported" className="px-4">Supported</TabsTrigger>
            <TabsTrigger value="unsupported" className="px-4">Unsupported</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {(activeFilters.length > 0 || searchQuery) && (
          <div className="hidden sm:flex items-center gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1 px-2">
                Search: {searchQuery}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearSearch} 
                  className="h-4 w-4 ml-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-0"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            
            {activeFilters.length > 0 && filterOptions
              .filter(option => activeFilters.includes(option.id))
              .map(option => (
                <Badge key={option.id} variant="secondary" className="gap-1 px-2">
                  {option.label}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleFilterToggle(option.id)} 
                    className="h-4 w-4 ml-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-0"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                clearSearch();
                clearFilters();
              }}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilterBar;
