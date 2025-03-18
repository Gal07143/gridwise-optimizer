
import { supabase } from "@/integrations/supabase/client";
import { EnergyDevice } from "@/types/energy";

// Mock data for now, will be replaced with Supabase queries
const mockDevices: EnergyDevice[] = [
  {
    id: "solar-01",
    name: "Rooftop Solar Array",
    type: "solar",
    status: "online",
    location: "Main Building",
    capacity: 50, // 50 kW
    lastUpdated: new Date().toISOString(),
    firmware: "v2.4.1",
    metrics: {
      efficiency: 96.7,
      temperature: 42.3,
      dailyProduction: 210.5
    }
  },
  {
    id: "battery-01",
    name: "Primary Storage System",
    type: "battery",
    status: "online",
    location: "Utility Room",
    capacity: 120, // 120 kWh
    lastUpdated: new Date().toISOString(),
    firmware: "v3.1.0",
    metrics: {
      stateOfCharge: 72.5,
      temperature: 28.1,
      cycles: 342
    }
  },
  {
    id: "wind-01",
    name: "Wind Turbine Array",
    type: "wind",
    status: "online",
    location: "North Field",
    capacity: 30, // 30 kW
    lastUpdated: new Date().toISOString(),
    firmware: "v1.8.2",
    metrics: {
      rotationSpeed: 120,
      windSpeed: 18.5,
      temperature: 19.2
    }
  },
  {
    id: "ev-01",
    name: "EV Charging Station 1",
    type: "ev_charger",
    status: "online",
    location: "Parking Level 1",
    capacity: 22, // 22 kW
    lastUpdated: new Date().toISOString(),
    firmware: "v2.1.5",
    metrics: {
      activePorts: 2,
      totalPorts: 4,
      currentPower: 15.3
    }
  },
  {
    id: "grid-01",
    name: "Grid Connection Point",
    type: "grid",
    status: "online",
    location: "Main Distribution",
    capacity: 200, // 200 kW
    lastUpdated: new Date().toISOString(),
    firmware: "v4.0.2",
    metrics: {
      frequency: 50.02,
      voltage: 233.5,
      importPower: 0,
      exportPower: 35.2
    }
  }
];

/**
 * Get all energy devices
 */
export const getAllDevices = async (): Promise<EnergyDevice[]> => {
  try {
    // This will be replaced with actual Supabase query once database is set up
    // const { data, error } = await supabase.from('devices').select('*');
    // if (error) throw error;
    // return data;
    
    return new Promise(resolve => {
      setTimeout(() => resolve(mockDevices), 500);
    });
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
};

/**
 * Get a single device by ID
 */
export const getDeviceById = async (id: string): Promise<EnergyDevice | null> => {
  try {
    // This will be replaced with actual Supabase query once database is set up
    // const { data, error } = await supabase.from('devices').select('*').eq('id', id).single();
    // if (error) throw error;
    // return data;
    
    return new Promise(resolve => {
      setTimeout(() => {
        const device = mockDevices.find(d => d.id === id) || null;
        resolve(device);
      }, 300);
    });
  } catch (error) {
    console.error(`Error fetching device ${id}:`, error);
    throw error;
  }
};

/**
 * Update a device's properties
 */
export const updateDevice = async (id: string, updates: Partial<EnergyDevice>): Promise<EnergyDevice> => {
  try {
    // This will be replaced with actual Supabase query once database is set up
    // const { data, error } = await supabase.from('devices').update(updates).eq('id', id).single();
    // if (error) throw error;
    // return data;
    
    return new Promise(resolve => {
      setTimeout(() => {
        const deviceIndex = mockDevices.findIndex(d => d.id === id);
        if (deviceIndex >= 0) {
          const updatedDevice = { ...mockDevices[deviceIndex], ...updates, lastUpdated: new Date().toISOString() };
          mockDevices[deviceIndex] = updatedDevice;
          resolve(updatedDevice);
        } else {
          throw new Error(`Device with ID ${id} not found`);
        }
      }, 500);
    });
  } catch (error) {
    console.error(`Error updating device ${id}:`, error);
    throw error;
  }
};

/**
 * Get the latest readings for a device
 */
export const getDeviceReadings = async (deviceId: string, limit = 24): Promise<any[]> => {
  try {
    // This will be replaced with actual Supabase query once database is set up
    // const { data, error } = await supabase
    //   .from('readings')
    //   .select('*')
    //   .eq('deviceId', deviceId)
    //   .order('timestamp', { ascending: false })
    //   .limit(limit);
    // if (error) throw error;
    // return data;
    
    // Mock data - generate random readings for the past 24 hours
    return new Promise(resolve => {
      setTimeout(() => {
        const now = new Date();
        const readings = [];
        
        for (let i = 0; i < limit; i++) {
          const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // hourly points
          
          // Generate data based on device type
          const device = mockDevices.find(d => d.id === deviceId);
          let powerValue = 0;
          
          if (device) {
            switch (device.type) {
              case 'solar':
                // Solar generation follows a bell curve during daylight hours
                const hour = timestamp.getHours();
                const solarFactor = hour >= 6 && hour <= 18 
                  ? Math.sin((hour - 6) * Math.PI / 12) // Bell curve between 6am and 6pm
                  : 0; // No production at night
                powerValue = device.capacity * solarFactor * (0.9 + Math.random() * 0.2);
                break;
                
              case 'battery':
                // Battery might be charging or discharging
                powerValue = (Math.random() > 0.5 ? 1 : -1) * device.capacity * 0.3 * Math.random();
                break;
                
              case 'wind':
                // Wind is variable but generally higher at night
                const windFactor = timestamp.getHours() >= 18 || timestamp.getHours() <= 6 ? 0.7 : 0.4;
                powerValue = device.capacity * windFactor * (0.5 + Math.random());
                break;
                
              case 'grid':
                // Grid might be importing or exporting
                powerValue = (Math.random() > 0.7 ? 1 : -1) * device.capacity * 0.2 * Math.random();
                break;
                
              default:
                powerValue = device.capacity * 0.5 * Math.random();
            }
          }
          
          readings.push({
            id: `reading-${deviceId}-${i}`,
            deviceId,
            timestamp: timestamp.toISOString(),
            power: Number(powerValue.toFixed(2)),
            energy: Number((powerValue * (Math.random() * 0.2 + 0.9)).toFixed(2)),
            temperature: Number((20 + Math.random() * 15).toFixed(1))
          });
        }
        
        // Sort by timestamp ascending (oldest first)
        readings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        
        resolve(readings);
      }, 600);
    });
  } catch (error) {
    console.error(`Error fetching readings for device ${deviceId}:`, error);
    throw error;
  }
};
