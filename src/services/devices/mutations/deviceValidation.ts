
import { EnergyDevice, DeviceStatus, DeviceType, isValidDeviceStatus, isValidDeviceType } from "@/types/energy";

/**
 * Validate device type and status
 * @param deviceData Partial device data to validate
 * @throws Error if validation fails
 */
export const validateDeviceData = (deviceData: Partial<EnergyDevice>) => {
  if (deviceData.type && !isValidDeviceType(deviceData.type)) {
    throw new Error(`Invalid device type: ${deviceData.type}`);
  }
  
  if (deviceData.status && !isValidDeviceStatus(deviceData.status)) {
    throw new Error(`Invalid device status: ${deviceData.status}`);
  }
};
