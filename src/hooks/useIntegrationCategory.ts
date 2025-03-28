
import { useDeviceModels, DeviceModel } from './useDeviceModels';

// Create a type that ensures name is required
type DeviceModelWithRequiredName = DeviceModel & { name: string };

export const useIntegrationCategory = (categoryId: string) => {
  const result = useDeviceModels(categoryId);
  
  // Map the models to ensure they all have required name property
  const devices = result.models.map(model => ({
    ...model,
    name: model.name || `${model.manufacturer} ${model.model_name}` // Provide fallback if name is missing
  })) as DeviceModelWithRequiredName[];
  
  // Return the data with property names expected by IntegrationCategoryPage
  return {
    devices,
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
