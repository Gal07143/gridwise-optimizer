
// Export all device-related functions from this index file

// Export from queries module
export { 
  getAllDevices,
  getDeviceById,
  getDeviceStatistics
} from './queries';

// We don't export getDeviceCount from queries to avoid name conflicts with stats

// Export from mutations module
export { 
  updateDevice,
  createDevice,
  deleteDevice,
  batchUpdateDevices
} from './mutations';

// Export from stats module (including its getDeviceCount)
export * from './stats';

// Export remaining services
export * from './readingsService';
export * from './maintenanceService';
export * from './seedService';
