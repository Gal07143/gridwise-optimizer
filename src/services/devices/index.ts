
// Export all device-related functions from this index file

// Export from queries module
export { 
  getAllDevices,
  getDeviceById,
  getDeviceStatistics
} from './queries';

// Export from mutations module
export { 
  updateDevice,
  createDevice,
  deleteDevice,
  batchUpdateDevices
} from './mutations';

// Export from stats module
export {
  getDeviceCount,
  getDeviceTypeStats,
  getDeviceStatusStats,
  getEnergyConsumptionStats,
  getTotalEnergyConsumption
} from './stats';

// Export remaining services
export * from './readingsService';
export * from './maintenanceService';
export * from './seedService';
