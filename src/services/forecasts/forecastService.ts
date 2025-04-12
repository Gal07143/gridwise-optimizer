import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WeatherForecast } from '@/types/energy';

export interface ForecastParams {
  siteId: string;
  startDate?: string;
  endDate?: string;
  resolution?: 'hourly' | 'daily';
  includeWeather?: boolean;
}

export interface EnergyForecast {
  timestamp: string;
  solar_generation: number;
  consumption: number;
  battery_soc?: number;
  grid_import?: number;
  grid_export?: number;
}

export interface ForecastResult {
  forecasts: EnergyForecast[];
  weather?: WeatherForecast[];
  meta: {
    site_id: string;
    start_date: string;
    end_date: string;
    resolution: string;
    total_generation: number;
    total_consumption: number;
    net_grid_import: number;
  };
}

export const getEnergyForecasts = async (params: ForecastParams): Promise<ForecastResult> => {
  try {
    const { siteId, startDate, endDate, resolution = 'hourly', includeWeather = false } = params;
    
    // Default to next 24 hours if no dates provided
    const start = startDate || new Date().toISOString();
    const end = endDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    // Fetch energy forecasts
    const { data: forecasts, error: forecastError } = await supabase
      .from('energy_forecasts')
      .select('*')
      .eq('site_id', siteId)
      .gte('timestamp', start)
      .lte('timestamp', end)
      .order('timestamp', { ascending: true });
    
    if (forecastError) throw forecastError;
    
    // Fetch weather forecasts if requested
    let weather: WeatherForecast[] = [];
    if (includeWeather) {
      const { data: weatherData, error: weatherError } = await supabase
        .from('weather_forecasts')
        .select('*')
        .eq('site_id', siteId)
        .gte('timestamp', start)
        .lte('timestamp', end)
        .order('timestamp', { ascending: true });
      
      if (weatherError) throw weatherError;
      weather = weatherData || [];
    }
    
    // Calculate totals
    const totalGeneration = forecasts?.reduce((sum, f) => sum + (f.solar_generation || 0), 0) || 0;
    const totalConsumption = forecasts?.reduce((sum, f) => sum + (f.consumption || 0), 0) || 0;
    const netGridImport = forecasts?.reduce((sum, f) => {
      const gridImport = f.grid_import || 0;
      const gridExport = f.grid_export || 0;
      return sum + gridImport - gridExport;
    }, 0) || 0;
    
    return {
      forecasts: forecasts || [],
      weather: includeWeather ? weather : undefined,
      meta: {
        site_id: siteId,
        start_date: start,
        end_date: end,
        resolution,
        total_generation: totalGeneration,
        total_consumption: totalConsumption,
        net_grid_import: netGridImport
      }
    };
  } catch (error) {
    console.error('Error fetching energy forecasts:', error);
    toast.error('Failed to load energy forecasts');
    throw error;
  }
};

export const getWeatherForecast = async (siteId: string): Promise<WeatherForecast[]> => {
  try {
    const { data, error } = await supabase
      .from('weather_forecasts')
      .select('*')
      .eq('site_id', siteId)
      .gte('timestamp', new Date().toISOString())
      .order('timestamp', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    toast.error('Failed to load weather forecast');
    return [];
  }
};

export const generateForecasts = async (siteId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-forecasts', {
      body: { siteId }
    });
    
    if (error) throw error;
    
    if (data.success) {
      toast.success('Energy forecasts generated successfully');
      return true;
    } else {
      toast.error(data.message || 'Failed to generate forecasts');
      return false;
    }
  } catch (error) {
    console.error('Error generating forecasts:', error);
    toast.error('Failed to generate forecasts');
    return false;
  }
};

export const getForecastAccuracy = async (siteId: string): Promise<number> => {
  try {
    // This would typically compare forecasts to actual values
    // For now, return a mock accuracy value
    return 87.5; // 87.5% accuracy
  } catch (error) {
    console.error('Error calculating forecast accuracy:', error);
    return 0;
  }
};
