
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { toDbDeviceType, toDbDeviceStatus } from './devices/deviceCompatibility';

// Re-export other device services
export * from './devices';

/**
 * Seed test data if needed
 */
export const seedTestData = async (): Promise<boolean> => {
  try {
    // Check if we already have devices
    const { count, error: countError } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // If we already have devices, skip seeding
    if (count && count > 0) {
      console.log(`Found ${count} existing devices, skipping seed`);
      return true;
    }
    
    // Check for a default site or create one
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .select('id')
      .limit(1)
      .single();
    
    if (siteError && siteError.code !== 'PGRST116') {
      throw siteError;
    }
    
    let siteId = siteData?.id;
    
    // Create a default site if none exists
    if (!siteId) {
      const { data: newSite, error: createError } = await supabase
        .from('sites')
        .insert({
          name: 'Default Site',
          location: 'Main Location',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
        .select('id')
        .single();
      
      if (createError) throw createError;
      siteId = newSite.id;
    }
    
    console.log('Creating sample devices for site:', siteId);
    
    // Create test devices with database-compatible types
    const testDevices = [
      {
        name: "Rooftop Solar Array",
        type: toDbDeviceType("solar"),
        status: toDbDeviceStatus("online"),
        location: "Main Building",
        capacity: 50,
        site_id: siteId,
        firmware: "v2.4.1",
        metrics: {
          efficiency: 96.7,
          temperature: 42.3,
          dailyProduction: 210.5
        }
      },
      {
        name: "Primary Storage System",
        type: toDbDeviceType("battery"),
        status: toDbDeviceStatus("online"),
        location: "Utility Room",
        capacity: 120,
        site_id: siteId,
        firmware: "v3.1.0",
        metrics: {
          stateOfCharge: 72.5,
          temperature: 28.1,
          cycles: 342
        }
      },
      {
        name: "Wind Turbine Array",
        type: toDbDeviceType("wind"),
        status: toDbDeviceStatus("online"),
        location: "North Field",
        capacity: 30,
        site_id: siteId,
        firmware: "v1.8.2",
        metrics: {
          rotationSpeed: 120,
          windSpeed: 18.5,
          temperature: 19.2
        }
      },
      {
        name: "EV Charging Station 1",
        type: toDbDeviceType("ev_charger"),
        status: toDbDeviceStatus("online"),
        location: "Parking Level 1",
        capacity: 22,
        site_id: siteId,
        firmware: "v2.1.5",
        metrics: {
          activePorts: 2,
          totalPorts: 4,
          currentPower: 15.3
        }
      },
      {
        name: "Grid Connection Point",
        type: toDbDeviceType("grid"),
        status: toDbDeviceStatus("online"),
        location: "Main Distribution",
        capacity: 200,
        site_id: siteId,
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
    
    console.log('Successfully seeded test devices');
    return true;
  } catch (error) {
    console.error("Error seeding test data:", error);
    toast.error("Failed to seed test data");
    return false;
  }
};
