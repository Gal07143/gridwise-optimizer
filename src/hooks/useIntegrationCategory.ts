
import { useDeviceModels } from './useDeviceModels';

export const useIntegrationCategory = (categoryId: string) => {
  const result = useDeviceModels(categoryId);
  
  // Return the data with property names expected by IntegrationCategoryPage
  return {
    devices: result.models,
    isLoading: result.loading,
    error: result.error,
    sortField: result.sortField,
    sortDirection: result.sortDirection,
    searchQuery: result.searchQuery,
    setSearchQuery: result.setSearchQuery,
    handleSort: result.handleSort,
    deviceCount: result.deviceCount,
    categoryName: result.categoryName
  };
};
