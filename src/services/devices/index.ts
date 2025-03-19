
// Export all device-related functions from this index file
// Note: We're carefully managing exports to avoid duplicates
export * from './deviceQueries';
// Re-export everything from deviceMutations except getDeviceCount to avoid naming conflict
export { 
  updateDevice,
  createDevice,
  deleteDevice,
  batchUpdateDevices
} from './deviceMutations';
export * from './deviceStats';
export * from './readingsService';
export * from './maintenanceService';
export * from './seedService';
