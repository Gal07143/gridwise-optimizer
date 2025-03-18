
import { DeviceStatus, DeviceType } from "@/types/energy";
import { supabase } from "@/integrations/supabase/client";
import { getOrCreateDummySite } from "../sites/siteService";

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
