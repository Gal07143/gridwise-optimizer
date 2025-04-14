
import { EnergyDevice } from '@/types/energy';

export const createDevice = async (deviceData: Omit<EnergyDevice, 'id'>): Promise<EnergyDevice> => {
  // In a real implementation, this would make an API call to create the device
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a unique ID
  const id = Date.now().toString();
  
  // Create the new device
  const newDevice: EnergyDevice = {
    id,
    ...deviceData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return newDevice;
};

export default createDevice;
