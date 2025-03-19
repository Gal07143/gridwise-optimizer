
import { supabase } from '@/integrations/supabase/client';

/**
 * Get energy consumption statistics for devices
 */
export const getEnergyConsumptionStats = async (siteId?: string, period: 'day' | 'week' | 'month' = 'day') => {
  try {
    let query = supabase
      .from('energy_readings')
      .select('device_id, timestamp, energy')
      .order('timestamp', { ascending: true });
    
    // Filter by site if provided
    if (siteId) {
      // Join with devices table to filter by site
      query = supabase
        .from('energy_readings')
        .select('device_id, timestamp, energy, devices!inner(site_id)')
        .eq('devices.site_id', siteId)
        .order('timestamp', { ascending: true });
    }
    
    // Apply time period filter
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
    }
    
    query = query.gte('timestamp', startDate.toISOString());
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching energy consumption stats:', error);
    return [];
  }
};

/**
 * Get total energy consumption for a period
 */
export const getTotalEnergyConsumption = async (siteId?: string, period: 'day' | 'week' | 'month' = 'day') => {
  const stats = await getEnergyConsumptionStats(siteId, period);
  
  const total = stats.reduce((sum, record) => {
    return sum + (record.energy || 0);
  }, 0);
  
  return total;
};
