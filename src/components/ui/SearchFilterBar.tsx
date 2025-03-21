
import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  deviceCount: number;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  deviceCount,
}) => {
  const [filters, setFilters] = useState({
    showSupported: true,
    showUnsupported: true,
    showWithManuals: true,
    showWithoutManuals: true,
  });

  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterName]: !prev[filterName] };
      
      // Don't allow both supported filters to be off at the same time
      if (filterName === 'showSupported' && !newFilters.showSupported && !newFilters.showUnsupported) {
        newFilters.showUnsupported = true;
      }
      if (filterName === 'showUnsupported' && !newFilters.showUnsupported && !newFilters.showSupported) {
        newFilters.showSupported = true;
      }
      
      // Same for manual filters
      if (filterName === 'showWithManuals' && !newFilters.showWithManuals && !newFilters.showWithoutManuals) {
        newFilters.showWithoutManuals = true;
      }
      if (filterName === 'showWithoutManuals' && !newFilters.showWithoutManuals && !newFilters.showWithManuals) {
        newFilters.showWithManuals = true;
      }
      
      return newFilters;
    });
  };

  const handleClearSearch = () => {
    onSearchChange('');
    toast.info("Search cleared");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by model, manufacturer, or protocol..."
            className="pl-10 bg-background pr-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuCheckboxItem 
                checked={filters.showSupported}
                onCheckedChange={() => handleFilterChange('showSupported')}
              >
                Show Supported Devices
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={filters.showUnsupported}
                onCheckedChange={() => handleFilterChange('showUnsupported')}
              >
                Show Unsupported Devices
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuCheckboxItem 
                checked={filters.showWithManuals}
                onCheckedChange={() => handleFilterChange('showWithManuals')}
              >
                Show Devices with Manuals
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={filters.showWithoutManuals}
                onCheckedChange={() => handleFilterChange('showWithoutManuals')}
              >
                Show Devices without Manuals
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Devices</TabsTrigger>
          <TabsTrigger value="supported">Supported</TabsTrigger>
          <TabsTrigger value="unsupported">Unsupported</TabsTrigger>
          <TabsTrigger value="manual">With Manual</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default SearchFilterBar;
