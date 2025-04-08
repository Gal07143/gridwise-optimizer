
import { supabase } from '@/integrations/supabase/client';
import { 
  EnergyDevice, Site, EnergyReading, EnergyForecast, 
  Tariff, OptimizationResult, AIRecommendation, Alert 
} from '@/types/energy';
import { toast } from 'sonner';

/* ----- Sites API ----- */
export const fetchSites = async (): Promise<Site[]> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching sites:', error);
    toast.error('Failed to fetch sites');
    return [];
  }
};

export const fetchSiteById = async (id: string): Promise<Site | null> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching site ${id}:`, error);
    toast.error('Failed to fetch site');
    return null;
  }
};

export const createSite = async (site: Omit<Site, 'id' | 'created_at' | 'updated_at'>): Promise<Site | null> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .insert(site)
      .select()
      .single();

    if (error) throw error;
    toast.success('Site created successfully');
    return data;
  } catch (error) {
    console.error('Error creating site:', error);
    toast.error('Failed to create site');
    return null;
  }
};

export const updateSite = async (id: string, site: Partial<Site>): Promise<Site | null> => {
  try {
    const { data, error } = await supabase
      .from('sites')
      .update(site)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Site updated successfully');
    return data;
  } catch (error) {
    console.error(`Error updating site ${id}:`, error);
    toast.error('Failed to update site');
    return null;
  }
};

export const deleteSite = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success('Site deleted successfully');
    return true;
  } catch (error) {
    console.error(`Error deleting site ${id}:`, error);
    toast.error('Failed to delete site');
    return false;
  }
};

/* ----- Devices API ----- */
export const fetchDevices = async (siteId?: string): Promise<EnergyDevice[]> => {
  try {
    let query = supabase.from('devices').select('*');
    
    if (siteId) {
      query = query.eq('site_id', siteId);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching devices:', error);
    toast.error('Failed to fetch devices');
    return [];
  }
};

export const fetchDeviceById = async (id: string): Promise<EnergyDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching device ${id}:`, error);
    toast.error('Failed to fetch device');
    return null;
  }
};

export const createDevice = async (device: Omit<EnergyDevice, 'id' | 'created_at' | 'updated_at'>): Promise<EnergyDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .insert(device)
      .select()
      .single();

    if (error) throw error;
    toast.success('Device created successfully');
    return data;
  } catch (error) {
    console.error('Error creating device:', error);
    toast.error('Failed to create device');
    return null;
  }
};

export const updateDevice = async (id: string, device: Partial<EnergyDevice>): Promise<EnergyDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .update(device)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Device updated successfully');
    return data;
  } catch (error) {
    console.error(`Error updating device ${id}:`, error);
    toast.error('Failed to update device');
    return null;
  }
};

export const deleteDevice = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success('Device deleted successfully');
    return true;
  } catch (error) {
    console.error(`Error deleting device ${id}:`, error);
    toast.error('Failed to delete device');
    return false;
  }
};

/* ----- Energy Readings API ----- */
export const fetchEnergyReadings = async (deviceId: string, limit = 100): Promise<EnergyReading[]> => {
  try {
    const { data, error } = await supabase
      .from('energy_readings')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      value: item.power,
      unit: 'W'
    }));
  } catch (error) {
    console.error(`Error fetching energy readings for device ${deviceId}:`, error);
    return [];
  }
};

export const addEnergyReading = async (reading: Omit<EnergyReading, 'id' | 'created_at'>): Promise<EnergyReading | null> => {
  try {
    const { data, error } = await supabase
      .from('energy_readings')
      .insert({
        device_id: reading.device_id,
        timestamp: reading.timestamp,
        power: reading.power,
        energy: reading.energy,
        voltage: reading.voltage,
        current: reading.current,
        frequency: reading.frequency,
        temperature: reading.temperature,
        state_of_charge: reading.state_of_charge
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      value: data.power,
      unit: 'W'
    };
  } catch (error) {
    console.error('Error adding energy reading:', error);
    return null;
  }
};

/* ----- Energy Forecasts API ----- */
export const fetchEnergyForecasts = async (siteId: string, limit = 24): Promise<EnergyForecast[]> => {
  try {
    const { data, error } = await supabase
      .from('energy_forecasts')
      .select('*')
      .eq('site_id', siteId)
      .gte('forecast_time', new Date().toISOString())
      .order('forecast_time', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching forecasts for site ${siteId}:`, error);
    return [];
  }
};

/* ----- Tariffs API ----- */
export const fetchLatestTariff = async (): Promise<Tariff | null> => {
  try {
    const { data, error } = await supabase
      .from('tariffs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching latest tariff:', error);
    return null;
  }
};

export const fetchTariffHistory = async (hours = 48): Promise<Tariff[]> => {
  try {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);
    
    const { data, error } = await supabase
      .from('tariffs')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tariff history:', error);
    return [];
  }
};

/* ----- Optimization Results API ----- */
export const fetchOptimizationResults = async (siteId: string): Promise<OptimizationResult[]> => {
  try {
    const { data, error } = await supabase
      .from('optimization_results')
      .select('*')
      .eq('site_id', siteId)
      .order('timestamp_start', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching optimization results for site ${siteId}:`, error);
    return [];
  }
};

/* ----- AI Recommendations API ----- */
export const fetchAIRecommendations = async (siteId: string): Promise<AIRecommendation[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching AI recommendations for site ${siteId}:`, error);
    return [];
  }
};

export const applyAIRecommendation = async (id: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ai_recommendations')
      .update({
        applied: true,
        applied_at: new Date().toISOString(),
        applied_by: userId
      })
      .eq('id', id);

    if (error) throw error;
    toast.success('Recommendation applied successfully');
    return true;
  } catch (error) {
    console.error(`Error applying recommendation ${id}:`, error);
    toast.error('Failed to apply recommendation');
    return false;
  }
};

/* ----- Alerts API ----- */
export const fetchAlerts = async (deviceId?: string, limit = 10): Promise<Alert[]> => {
  try {
    let query = supabase.from('alerts').select('*');
    
    if (deviceId) {
      query = query.eq('device_id', deviceId);
    }
    
    const { data, error } = await query
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
};

export const acknowledgeAlert = async (id: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({
        acknowledged: true,
        acknowledged_by: userId,
        acknowledged_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    toast.success('Alert acknowledged');
    return true;
  } catch (error) {
    console.error(`Error acknowledging alert ${id}:`, error);
    toast.error('Failed to acknowledge alert');
    return false;
  }
};
