
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useDeviceModels, categoryNames } from '@/hooks/useDeviceModels';
import PageHeader from '@/components/integrations/PageHeader';
import SearchFilterBar from '@/components/integrations/SearchFilterBar';
import DeviceModelsCard from '@/components/integrations/DeviceModelsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Create interface types for component props to resolve typescript errors
interface PageHeaderProps {
  title?: string;
  description?: string;
  categoryId?: string;
}

interface SearchFilterBarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  deviceCount?: number;
}

interface DeviceModelsCardProps {
  deviceModels?: any[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

const IntegrationCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    filteredDevices,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    sortField,
    sortDirection,
    handleSort,
    deviceCount
  } = useDeviceModels(categoryId);
  
  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [categoryId]);
  
  // Redirect if category doesn't exist
  useEffect(() => {
    if (categoryId && !categoryNames[categoryId as keyof typeof categoryNames]) {
      toast.error("Invalid device category");
      navigate('/integrations', { replace: true });
    }
  }, [categoryId, navigate]);
  
  const categoryName = categoryId 
    ? categoryNames[categoryId as keyof typeof categoryNames] || 'Devices' 
    : 'Devices';
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <PageHeader 
          title={categoryName} 
          description={`Browse and manage ${categoryName.toLowerCase()} for your energy management system.`}
          categoryId={categoryId}
        />
        
        {/* Search and Filter Bar */}
        <SearchFilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          deviceCount={deviceCount}
        />
        
        {/* Device Models Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[300px] rounded-xl" />
            ))}
          </div>
        ) : (
          <DeviceModelsCard 
            deviceModels={filteredDevices} 
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default IntegrationCategoryPage;
