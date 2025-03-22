
// Update the addDeviceReading function to fix the type issue
import { supabase } from "@/integrations/supabase/client";
import { EnergyReading } from "@/types/energy";
import { toast } from "sonner";

// Ampeco API integration configuration
const AMPECO_API_URL = "https://api.ampeco.com/v1";
const POLLING_INTERVAL = 30000; // 30 seconds

// Interface to represent database readings structure
interface DbEnergyReading {
  id: string;
  device_id: string;
  timestamp: string;
  power: number;
  energy: number;
  voltage: number;
  current: number;
  frequency: number;
  temperature: number;
  state_of_charge: number | null;
  created_at: string;
}

// Convert database reading to application EnergyReading
const mapDbToEnergyReading = (dbReading: DbEnergyReading): EnergyReading => {
  return {
    id: dbReading.id,
    device_id: dbReading.device_id,
    timestamp: dbReading.timestamp,
    value: dbReading.power, // Use power as the primary value
    reading_type: 'power',
    unit: 'W',
    quality: 100, // Assume good quality for now
    power: dbReading.power,
    energy: dbReading.energy,
    voltage: dbReading.voltage,
    current: dbReading.current,
    frequency: dbReading.frequency,
    temperature: dbReading.temperature,
    state_of_charge: dbReading.state_of_charge || undefined,
    created_at: dbReading.created_at
  };
};

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

    // Map database results to EnergyReading objects
    return (data || []).map(mapDbToEnergyReading);
    
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
    const power = generateRealisticPower(deviceData.type, deviceData.capacity);
    const voltage = 220 + (Math.random() * 10 - 5);
    const current = power / voltage;
    const frequency = 50 + (Math.random() * 0.5 - 0.25);
    const temperature = 25 + (Math.random() * 10 - 5);
    const state_of_charge = deviceData.type === 'battery' ? 20 + Math.floor(Math.random() * 80) : null;
    
    // Get previous reading to calculate energy
    const { data: prevReadings } = await supabase
      .from('energy_readings')
      .select('energy, timestamp')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
      .limit(1);
    
    let energy = 0;
    if (prevReadings && prevReadings.length > 0) {
      const prevReading = prevReadings[0];
      const prevTime = new Date(prevReading.timestamp).getTime();
      const currentTime = now.getTime();
      const hoursDiff = (currentTime - prevTime) / (1000 * 60 * 60);
      
      // Energy (kWh) = Previous Energy + Power (kW) * Time (hours)
      energy = prevReading.energy + (power * hoursDiff);
    }
    
    // Create a reading with all required EnergyReading fields
    const reading: EnergyReading = {
      id: `tmp-${Date.now()}`,
      device_id: deviceId,
      timestamp: now.toISOString(),
      value: power,
      reading_type: 'power',
      unit: 'W',
      quality: 100,
      power,
      energy,
      voltage,
      current,
      frequency,
      temperature,
      state_of_charge: state_of_charge || undefined,
      created_at: now.toISOString()
    };
    
    return [reading];
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
    // Transform from application model to database model
    const readingData = {
      device_id: reading.device_id,
      timestamp: reading.timestamp,
      power: reading.power || reading.value,
      energy: reading.energy || 0,
      voltage: reading.voltage || 0,
      current: reading.current || 0,
      frequency: reading.frequency || 0,
      temperature: reading.temperature || 0,
      state_of_charge: reading.state_of_charge || null
    };

    const { data, error } = await supabase
      .from('energy_readings')
      .insert([readingData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Map database result back to EnergyReading
    return data ? mapDbToEnergyReading(data as DbEnergyReading) : null;
    
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
        // Convert database reading to app model
        const dbReading = payload.new as DbEnergyReading;
        onUpdate(mapDbToEnergyReading(dbReading));
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
};
