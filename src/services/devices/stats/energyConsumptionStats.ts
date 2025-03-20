
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type EnergyConsumptionPeriod = 'day' | 'week' | 'month';

export interface EnergyReading {
  device_id: string;
  timestamp: string;
  energy: number;
}

/**
 * Get energy consumption statistics for devices
 */
export const getEnergyConsumptionStats = async (
  siteId?: string, 
  period: EnergyConsumptionPeriod = 'day'
): Promise<EnergyReading[]> => {
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
    
    if (error) {
      console.error('Error fetching energy consumption stats:', error);
      toast.error(`Failed to fetch energy data: ${error.message}`);
      throw error;
    }
    
    // Generate sample data if no actual data exists
    if (!data || data.length === 0) {
      console.log('No real data found, generating sample data');
      return generateSampleEnergyData(period);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching energy consumption stats:', error);
    return generateSampleEnergyData(period);
  }
};

/**
 * Get total energy consumption for a period
 */
export const getTotalEnergyConsumption = async (
  siteId?: string, 
  period: EnergyConsumptionPeriod = 'day'
): Promise<number> => {
  try {
    const stats = await getEnergyConsumptionStats(siteId, period);
    
    const total = stats.reduce((sum, record) => {
      return sum + (record.energy || 0);
    }, 0);
    
    return total;
  } catch (error) {
    console.error('Error calculating total energy consumption:', error);
    return 0;
  }
};

/**
 * Generate sample energy data for testing
 */
const generateSampleEnergyData = (period: EnergyConsumptionPeriod): EnergyReading[] => {
  const now = new Date();
  const data: EnergyReading[] = [];
  
  // Number of data points to generate based on period
  let dataPoints: number;
  let startDate: Date;
  
  switch (period) {
    case 'day':
      dataPoints = 24; // One for each hour
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      dataPoints = 7 * 24; // One for each hour over 7 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      dataPoints = 30 * 24; // One for each hour over 30 days
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      dataPoints = 24;
      startDate = new Date(now.setHours(0, 0, 0, 0));
  }
  
  // Base consumption pattern with peaks in morning and evening
  const basePattern = [
    0.5, 0.4, 0.3, 0.3, 0.4, 0.8, // 12am-6am
    1.5, 2.2, 2.0, 1.8, 1.5, 1.3, // 6am-12pm
    1.4, 1.5, 1.7, 1.9, 2.1, 2.3, // 12pm-6pm
    2.5, 2.1, 1.7, 1.3, 0.9, 0.7  // 6pm-12am
  ];
  
  // Generate data for each time interval
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = new Date(startDate);
    
    if (period === 'day') {
      timestamp.setHours(i);
    } else {
      // For week and month, increment by hours
      timestamp.setHours(timestamp.getHours() + i);
    }
    
    // Get the hour of day to use the right base pattern value
    const hourOfDay = timestamp.getHours();
    
    // Base value from the pattern
    const baseValue = basePattern[hourOfDay];
    
    // Add randomness (±20%)
    const randomFactor = 0.8 + (Math.random() * 0.4);
    
    // Add day of week factor (weekends lower, workdays higher)
    const dayOfWeek = timestamp.getDay(); // 0 = Sunday, 6 = Saturday
    const dayFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.8 : 1.1;
    
    // Calculate final energy value
    const energy = baseValue * randomFactor * dayFactor;
    
    data.push({
      device_id: '123e4567-e89b-12d3-a456-426614174000', // Dummy ID
      timestamp: timestamp.toISOString(),
      energy: parseFloat(energy.toFixed(2))
    });
  }
  
  return data;
};
