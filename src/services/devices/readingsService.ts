import { supabase } from "@/integrations/supabase/client";
import { EnergyReading } from "@/types/energy";
import { toast } from "sonner";

// Ampeco API integration configuration
const AMPECO_API_URL = "https://api.ampeco.com/v1";
const POLLING_INTERVAL = 30000; // 30 seconds

/**
 * Get the latest readings for a device from the database
 * If realtime is enabled, this will fetch directly from the device
 */
export const getDeviceReadings = async (deviceId: string, limit = 24, realtime = false): Promise<EnergyReading[]> => {
  try {
    // For realtime data, try to fetch from the device via Ampeco API first
    if (realtime) {
      try {
        const realtimeReadings = await fetchRealtimeReadingsFromDevice(deviceId);
        if (realtimeReadings && realtimeReadings.length > 0) {
          // Store the realtime readings in the database for history
          for (const reading of realtimeReadings) {
            await addDeviceReading(reading);
          }
          return realtimeReadings;
        }
      } catch (error) {
        console.warn(`Failed to fetch realtime data for device ${deviceId}, falling back to database:`, error);
        // Fall back to database if realtime fetch fails
      }
    }

    // Fetch from database (either as primary source or as fallback)
    const { data, error } = await supabase
      .from('energy_readings')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error(`Error fetching readings for device ${deviceId}:`, error);
    toast.error("Failed to fetch device readings");
    return [];
  }
};

/**
 * Fetch real-time readings directly from a device via the Ampeco API
 */
export const fetchRealtimeReadingsFromDevice = async (deviceId: string): Promise<EnergyReading[]> => {
  try {
    // In a real implementation, you would make an authenticated request to the Ampeco API
    // For now, we'll simulate the API response with realistic data
    console.log(`Fetching real-time data for device ${deviceId}`);
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate realistic data based on device type
    const { data: deviceData } = await supabase
      .from('devices')
      .select('type, capacity')
      .eq('id', deviceId)
      .single();
    
    if (!deviceData) {
      throw new Error("Device not found");
    }
    
    const now = new Date();
    const reading: Omit<EnergyReading, 'id' | 'created_at'> = {
      device_id: deviceId,
      timestamp: now.toISOString(),
      power: generateRealisticPower(deviceData.type, deviceData.capacity),
      energy: 0, // Will be calculated based on previous readings
      voltage: 220 + (Math.random() * 10 - 5),
      current: 0, // Will be calculated
      frequency: 50 + (Math.random() * 0.5 - 0.25),
      temperature: 25 + (Math.random() * 10 - 5),
      state_of_charge: deviceData.type === 'battery' ? 20 + Math.floor(Math.random() * 80) : null
    };

    // Calculate derived values
    reading.current = reading.power / reading.voltage;
    
    // Get previous reading to calculate energy
    const { data: prevReadings } = await supabase
      .from('energy_readings')
      .select('energy, timestamp')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
      .limit(1);
    
    if (prevReadings && prevReadings.length > 0) {
      const prevReading = prevReadings[0];
      const prevTime = new Date(prevReading.timestamp).getTime();
      const currentTime = now.getTime();
      const hoursDiff = (currentTime - prevTime) / (1000 * 60 * 60);
      
      // Energy (kWh) = Previous Energy + Power (kW) * Time (hours)
      reading.energy = prevReading.energy + (reading.power * hoursDiff);
    } else {
      // No previous reading, start at 0
      reading.energy = 0;
    }
    
    return [reading as EnergyReading];
  } catch (error) {
    console.error("Error fetching real-time device readings:", error);
    throw error;
  }
};

/**
 * Generate realistic power values based on device type and capacity
 */
function generateRealisticPower(deviceType: string, capacity: number): number {
  const timeOfDay = new Date().getHours();
  const isDay = timeOfDay >= 7 && timeOfDay <= 19;
  
  switch (deviceType) {
    case 'solar':
      // Solar power dependent on time of day
      if (!isDay) return 0;
      const peakHour = timeOfDay >= 10 && timeOfDay <= 14;
      const cloudFactor = Math.random() * 0.3 + 0.7; // 70-100% efficiency for clouds
      return peakHour 
        ? capacity * cloudFactor * (0.7 + Math.random() * 0.3) // 70-100% of capacity at peak
        : capacity * cloudFactor * (0.3 + Math.random() * 0.4); // 30-70% of capacity during day
      
    case 'wind':
      // Wind is more random
      const windCondition = Math.random(); // Random wind condition
      if (windCondition < 0.2) return capacity * 0.1; // Low wind 20% of time
      if (windCondition < 0.7) return capacity * (0.3 + Math.random() * 0.3); // Moderate wind 50% of time 
      return capacity * (0.6 + Math.random() * 0.4); // High wind 30% of time
      
    case 'battery':
      // Battery can be charging or discharging
      const isCharging = Math.random() > 0.5;
      return isCharging 
        ? -1 * capacity * (0.1 + Math.random() * 0.4) // Charging (negative power)
        : capacity * (0.1 + Math.random() * 0.6);     // Discharging (positive power)
      
    case 'grid':
      // Grid power depends on overall consumption
      return capacity * (0.2 + Math.random() * 0.5); // 20-70% of capacity
      
    case 'ev_charger':
      // EV might be charging or not
      const isEVConnected = Math.random() > 0.7; // 30% chance an EV is connected
      return isEVConnected ? capacity * (0.7 + Math.random() * 0.3) : 0;
      
    default: // loads and other devices
      return capacity * (0.1 + Math.random() * 0.5); // 10-60% of capacity
  }
}

/**
 * Add a reading for a device
 */
export const addDeviceReading = async (reading: Omit<EnergyReading, 'id' | 'created_at'>): Promise<EnergyReading | null> => {
  try {
    const { data, error } = await supabase
      .from('energy_readings')
      .insert([reading])
      .select()
      .single();
    
    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error("Error adding device reading:", error);
    return null;
  }
};

/**
 * Setup realtime data polling for a device
 */
export const setupRealtimePolling = (deviceId: string, onUpdate: (reading: EnergyReading) => void) => {
  let intervalId: number;
  
  const startPolling = () => {
    // Initial fetch
    fetchRealtimeReadingsFromDevice(deviceId)
      .then(readings => {
        if (readings && readings.length > 0) {
          onUpdate(readings[0]);
        }
      })
      .catch(error => console.error("Error in initial device polling:", error));
    
    // Setup interval
    intervalId = window.setInterval(async () => {
      try {
        const readings = await fetchRealtimeReadingsFromDevice(deviceId);
        if (readings && readings.length > 0) {
          onUpdate(readings[0]);
        }
      } catch (error) {
        console.error("Error in device polling:", error);
      }
    }, 15000); // Changed from 30000 to 15000 (15 seconds)
  };
  
  const stopPolling = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
    }
  };
  
  startPolling();
  
  return {
    stopPolling
  };
};

/**
 * Enable realtime updates for energy readings via Supabase Realtime
 */
export const setupRealtimeUpdates = (deviceId: string, onUpdate: (reading: EnergyReading) => void) => {
  const channel = supabase
    .channel('energy_readings_changes')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'energy_readings',
        filter: `device_id=eq.${deviceId}`
      }, 
      payload => {
        onUpdate(payload.new as EnergyReading);
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
};
