
import { Device } from '@/types/device';
import { getAllDevices as getDevicesFromService } from '@/services/devices/getAllDevices';

export { getAllDevices } from '@/services/devices/getAllDevices';

// Re-export as getDevices for backwards compatibility
export const getDevices = async (options?: any): Promise<Device[]> => {
  return getDevicesFromService(options);
};
