
import { EnergyDevice } from "@/types/energy";
import { getAllDevices } from "./getAllDevices";

/**
 * Get device statistics grouped by type/status
 */
export const getDeviceStatistics = async (siteId?: string): Promise<{
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  total: number;
}> => {
  try {
    // Get devices
    const devices = await getAllDevices({ 
      siteId, 
      pageSize: 1000 // Get a larger batch for stats
    });
    
    const stats = {
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      total: devices.length
    };
    
    // Calculate stats
    devices.forEach(device => {
      // Count by type
      if (!stats.byType[device.type]) {
        stats.byType[device.type] = 0;
      }
      stats.byType[device.type]++;
      
      // Count by status
      if (!stats.byStatus[device.status]) {
        stats.byStatus[device.status] = 0;
      }
      stats.byStatus[device.status]++;
    });
    
    return stats;
    
  } catch (error) {
    console.error("Error fetching device statistics:", error);
    return { byType: {}, byStatus: {}, total: 0 };
  }
};
