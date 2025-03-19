
// Export all device-related functions from this index file
// Note: We're carefully managing exports to avoid duplicates

// Export everything from deviceQueries except getDeviceCount since it's duplicated
export { 
  getAllDevices,
  getDeviceById,
  getDeviceStatistics
} from './deviceQueries';

// Re-export everything from deviceMutations
export { 
  updateDevice,
  createDevice,
  deleteDevice,
  batchUpdateDevices
} from './deviceMutations';

// Export everything from deviceStats including its getDeviceCount
export * from './deviceStats';
export * from './readingsService';
export * from './maintenanceService';
export * from './seedService';

