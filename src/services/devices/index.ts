
// Export all device-related functions from this index file

// Export from queries module
export { 
  getAllDevices,
  getDeviceById,
} from './queries';

// Export from mutations module
export { 
  updateDevice,
  createDevice,
  deleteDevice,
  batchUpdateDevices
} from './mutations';

// Export devices services
export * from './getAllDevices';
export * from './createDevice';
