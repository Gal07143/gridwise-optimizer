
// This file re-exports all device-related service functions

// Core device operations
export {
  getAllDevices,
  getDeviceById,
  updateDevice,
  createDevice,
  deleteDevice
} from './devices';

// Device readings
export {
  getDeviceReadings,
  addDeviceReading
} from './devices/readingsService';

// Maintenance operations
export {
  getDeviceMaintenanceRecords
} from './devices/maintenanceService';

// Site operations
export {
  getOrCreateDummySite
} from './sites/siteService';

// Test data seeding
export {
  seedTestData
} from './devices/seedService';
