import { supabase } from "@/integrations/supabase/client";
import { EnergyDevice, EnergyReading, DeviceStatus, DeviceType } from "@/types/energy";
import { toast } from "sonner";

/**
 * Get all energy devices
 */
export const getAllDevices = async (): Promise<EnergyDevice[]> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*');
    
    if (error) throw error;
    
    // Convert the database response to match our TypeScript interface
    const devices: EnergyDevice[] = data?.map(device => ({
      ...device,
      type: device.type as DeviceType,
      status: device.status as DeviceStatus,
      metrics: device.metrics as Record<string, number> | null
    })) || [];
    
    return devices;
    
  } catch (error) {
    console.error("Error fetching devices:", error);
    toast.error("Failed to fetch devices");
    return [];
  }
};

/**
 * Get a single device by ID
 */
export const getDeviceById = async (id: string): Promise<EnergyDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Convert the database response to match our TypeScript interface
    const device: EnergyDevice = {
      ...data,
      type: data.type as DeviceType,
      status: data.status as DeviceStatus,
      metrics: data.metrics as Record<string, number> | null
    };
    
    return device;
    
  } catch (error) {
    console.error(`Error fetching device ${id}:`, error);
    toast.error("Failed to fetch device details");
    return null;
  }
};

/**
 * Update a device's properties
 */
export const updateDevice = async (id: string, updates: Partial<EnergyDevice>): Promise<EnergyDevice | null> => {
  try {
    // Remove any fields that shouldn't be updated directly
    const { id: _id, created_at, ...updateData } = updates as any;
    
    const { data, error } = await supabase
      .from('devices')
      .update({ ...updateData, last_updated: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Convert the database response to match our TypeScript interface
    const device: EnergyDevice = {
      ...data,
      type: data.type as DeviceType,
      status: data.status as DeviceStatus,
      metrics: data.metrics as Record<string, number> | null
    };
    
    toast.success("Device updated successfully");
    return device;
    
  } catch (error) {
    console.error(`Error updating device ${id}:`, error);
    toast.error("Failed to update device");
    return null;
  }
};

/**
 * Create a new device
 */
export const createDevice = async (deviceData: Omit<EnergyDevice, 'id' | 'created_at' | 'last_updated'>): Promise<EnergyDevice | null> => {
  try {
    // Add the user id to track who created the device
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) {
      throw new Error("No authenticated user found");
    }
    
    // Get default site if not specified
    let siteId = deviceData.site_id;
    if (!siteId) {
      console.log("No site ID provided, attempting to get default site");
      try {
        const { data: siteData } = await supabase.rpc('get_default_site_id');
        siteId = siteData;
        console.log("Got default site ID:", siteId);
      } catch (siteError) {
        console.error("Error getting default site:", siteError);
      }
    }

    if (!siteId) {
      console.log("No site found, creating a new one");
      const siteResponse = await createDummySite();
      if (siteResponse) {
        siteId = siteResponse.id;
        console.log("Created new site with ID:", siteId);
      } else {
        console.error("Failed to create site");
        throw new Error("Could not create or find a site");
      }
    }

    // Make sure we have a timestamp for creation
    const timestamp = new Date().toISOString();
    
    // Prepare the data with defaults for required fields
    const preparedData = {
      ...deviceData,
      created_by: userId,
      last_updated: timestamp,
      site_id: siteId,
      status: deviceData.status || 'online',
      metrics: deviceData.metrics || null
    };
    
    console.log("Creating device with data:", preparedData);
    
    const { data, error } = await supabase
      .from('devices')
      .insert([preparedData])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating device:", error);
      throw error;
    }
    
    if (!data) return null;
    
    // Convert the database response to match our TypeScript interface
    const device: EnergyDevice = {
      ...data,
      type: data.type as DeviceType,
      status: data.status as DeviceStatus,
      metrics: data.metrics as Record<string, number> | null
    };
    
    toast.success("Device created successfully");
    return device;
    
  } catch (error: any) {
    console.error("Error creating device:", error);
    toast.error(`Failed to create device: ${error.message || 'Unknown error'}`);
    return null;
  }
};

/**
 * Create a dummy site directly
 */
const createDummySite = async () => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .insert([
        {
          name: 'Main Campus',
          location: 'San Francisco, CA',
          timezone: 'America/Los_Angeles',
          lat: 37.7749,
          lng: -122.4194
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating site:", error);
    return null;
  }
};

/**
 * Get or create a dummy site for testing
 */
export const getOrCreateDummySite = async () => {
  try {
    // Check if we have a site
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('*')
      .limit(1);
    
    if (sitesError) throw sitesError;
    
    // If we have a site, return it
    if (sites && sites.length > 0) {
      return sites[0];
    }
    
    // Create a dummy site
    return await createDummySite();
    
  } catch (error) {
    console.error("Error with site setup:", error);
    return null;
  }
};

/**
 * Get the latest readings for a device
 */
export const getDeviceReadings = async (deviceId: string, limit = 24): Promise<EnergyReading[]> => {
  try {
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
 * Get maintenance records for a device
 */
export const getDeviceMaintenanceRecords = async (deviceId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error(`Error fetching maintenance records for device ${deviceId}:`, error);
    toast.error("Failed to fetch maintenance records");
    return [];
  }
};

/**
 * Helper functions to seed test data if needed
 */
export const seedTestData = async () => {
  try {
    // Get or create a test site
    const site = await getOrCreateDummySite();
    if (!site) return false;
    
    // Check if we already have devices
    const { count, error: countError } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // If we already have devices, skip seeding
    if (count && count > 0) {
      return true;
    }
    
    // Create test devices
    const testDevices = [
      {
        name: "Rooftop Solar Array",
        type: "solar" as DeviceType,
        status: "online" as DeviceStatus,
        location: "Main Building",
        capacity: 50,
        site_id: site.id,
        firmware: "v2.4.1",
        metrics: {
          efficiency: 96.7,
          temperature: 42.3,
          dailyProduction: 210.5
        }
      },
      {
        name: "Primary Storage System",
        type: "battery" as DeviceType,
        status: "online" as DeviceStatus,
        location: "Utility Room",
        capacity: 120,
        site_id: site.id,
        firmware: "v3.1.0",
        metrics: {
          stateOfCharge: 72.5,
          temperature: 28.1,
          cycles: 342
        }
      },
      {
        name: "Wind Turbine Array",
        type: "wind" as DeviceType,
        status: "online" as DeviceStatus,
        location: "North Field",
        capacity: 30,
        site_id: site.id,
        firmware: "v1.8.2",
        metrics: {
          rotationSpeed: 120,
          windSpeed: 18.5,
          temperature: 19.2
        }
      },
      {
        name: "EV Charging Station 1",
        type: "ev_charger" as DeviceType,
        status: "online" as DeviceStatus,
        location: "Parking Level 1",
        capacity: 22,
        site_id: site.id,
        firmware: "v2.1.5",
        metrics: {
          activePorts: 2,
          totalPorts: 4,
          currentPower: 15.3
        }
      },
      {
        name: "Grid Connection Point",
        type: "grid" as DeviceType,
        status: "online" as DeviceStatus,
        location: "Main Distribution",
        capacity: 200,
        site_id: site.id,
        firmware: "v4.0.2",
        metrics: {
          frequency: 50.02,
          voltage: 233.5,
          importPower: 0,
          exportPower: 35.2
        }
      }
    ];
    
    const { error: insertError } = await supabase
      .from('devices')
      .insert(testDevices);
    
    if (insertError) throw insertError;
    
    return true;
  } catch (error) {
    console.error("Error seeding test data:", error);
    return false;
  }
};
