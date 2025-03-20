
import React from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useDeviceModels, categoryNames } from '@/hooks/useDeviceModels';
import PageHeader from '@/components/integrations/PageHeader';
import SearchFilterBar from '@/components/integrations/SearchFilterBar';
import DeviceModelsCard from '@/components/integrations/DeviceModelsCard';

const IntegrationCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
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
  
  const categoryName = categoryId 
    ? categoryNames[categoryId as keyof typeof categoryNames] || 'Devices' 
    : 'Devices';
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
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
      </div>
    </AppLayout>
  );
};

export default IntegrationCategoryPage;
