
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useDeviceModels, categoryNames } from '@/hooks/useDeviceModels';
import PageHeader from '@/components/integrations/PageHeader';
import SearchFilterBar from '@/components/integrations/SearchFilterBar';
import DeviceModelsCard from '@/components/integrations/DeviceModelsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

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
      <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
        {isLoading ? (
          <>
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-5 w-full max-w-lg" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </>
        ) : (
          <>
            <PageHeader 
              categoryName={categoryName} 
              categoryId={categoryId} 
            />
            
            <SearchFilterBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            
            <DeviceModelsCard 
              deviceCount={deviceCount}
              categoryName={categoryName}
              filteredDevices={filteredDevices}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default IntegrationCategoryPage;
