
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Filter } from 'lucide-react';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  deviceCount?: number;
  tabs?: Array<{ id: string; label: string }>;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  activeTab = 'all',
  onTabChange,
  deviceCount,
  tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' }
  ]
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center justify-between md:justify-end gap-4">
        {onTabChange && (
          <div className="flex gap-1 border rounded-md overflow-hidden">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                className="rounded-none"
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
                {tab.id === 'all' && deviceCount !== undefined && (
                  <span className="ml-1 text-xs">({deviceCount})</span>
                )}
              </Button>
            ))}
          </div>
        )}
        
        <Button variant="outline" size="sm" className="md:ml-auto">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
