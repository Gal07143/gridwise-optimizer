
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import ErrorMessage from '@/components/ui/error-message';
import { useIntegrationCategory } from '@/hooks/useIntegrationCategory';
import IntegrationDeviceModelsCard from '@/components/integrations/IntegrationDeviceModelsCard';
import IntegrationInstallationCard from '@/components/integrations/IntegrationInstallationCard';
import PageHeader from '@/components/pages/PageHeader';
import NoResults from '@/components/ui/no-results';
import SearchFilterBar from '@/components/ui/SearchFilterBar';

const IntegrationCategoryPage = () => {
  const { categoryId = 'all' } = useParams<{ categoryId: string }>();
  const [activeTab, setActiveTab] = useState('all');
  
  const {
    devices: deviceModels,
    isLoading,
    error,
    sortField,
    sortDirection,
    searchQuery,
    setSearchQuery,
    handleSort,
    deviceCount,
    categoryName
  } = useIntegrationCategory(categoryId !== 'all' ? categoryId : '');
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex-1 p-6 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }
  
  if (error) {
    return (
      <AppLayout>
        <div className="p-6">
          <ErrorMessage message="Failed to load integrations" retryAction={() => window.location.reload()} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1 p-6 space-y-6">
        <PageHeader 
          title={categoryName}
          description={`Browse and manage ${categoryName.toLowerCase()} integrations`}
          categoryId={categoryId}
        />
        
        <SearchFilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          deviceCount={deviceCount}
        />
        
        {deviceModels.length === 0 ? (
          <NoResults message="No integrations found" suggestion="Try changing your search or filter criteria" />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <IntegrationDeviceModelsCard 
              deviceModels={deviceModels}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            
            <IntegrationInstallationCard
              categoryId={categoryId}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default IntegrationCategoryPage;
