import { supabase } from '../supabase';
import { EnergyMetrics, ForecastData } from '@/types/device';

export type TimeRange = '24h' | '7d' | '30d';

export async function fetchEnergyMetrics(deviceId: string, timeRange: TimeRange): Promise<EnergyMetrics[]> {
  const now = new Date();
  const startTime = new Date(now);

  switch (timeRange) {
    case '24h':
      startTime.setHours(now.getHours() - 24);
      break;
    case '7d':
      startTime.setDate(now.getDate() - 7);
      break;
    case '30d':
      startTime.setDate(now.getDate() - 30);
      break;
  }

  const { data, error } = await supabase
    .from('energy_metrics')
    .select('*')
    .eq('device_id', deviceId)
    .gte('timestamp', startTime.toISOString())
    .lte('timestamp', now.toISOString())
    .order('timestamp', { ascending: true });

  if (error) throw new Error(`Error fetching energy metrics: ${error.message}`);
  return data || [];
}

export async function fetchEnergyForecast(deviceId: string): Promise<ForecastData[]> {
  const { data, error } = await supabase
    .from('energy_forecasts')
    .select('*')
    .eq('device_id', deviceId)
    .order('timestamp', { ascending: true });

  if (error) throw new Error(`Error fetching energy forecast: ${error.message}`);
  return data || [];
}

export async function updateDeviceSettings(
  deviceId: string,
  settings: {
    scheduledOperations?: {
      startTime: string;
      endTime: string;
      mode: 'charge' | 'discharge' | 'idle';
    }[];
    alertThresholds?: {
      minPower?: number;
      maxPower?: number;
      minVoltage?: number;
      maxVoltage?: number;
      minEfficiency?: number;
    };
  }
) {
  const { error } = await supabase
    .from('devices')
    .update({ settings })
    .eq('id', deviceId);

  if (error) throw new Error(`Error updating device settings: ${error.message}`);
}

export async function getEnergyOptimizationSuggestions(deviceId: string) {
  const { data, error } = await supabase
    .rpc('get_energy_optimization_suggestions', { device_id: deviceId });

  if (error) throw new Error(`Error getting optimization suggestions: ${error.message}`);
  return data || [];
}

export async function calculateGridBalance(timeRange: TimeRange) {
  const { data, error } = await supabase
    .rpc('calculate_grid_balance', { time_range: timeRange });

  if (error) throw new Error(`Error calculating grid balance: ${error.message}`);
  return data || { import: 0, export: 0, balance: 0 };
} 