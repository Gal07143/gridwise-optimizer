
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  EnergyForecast, OptimizationResult, AIRecommendation, UserPreference 
} from '@/types/energy';

export async function runEnergyOptimization(
  siteId: string,
  deviceIds: string[],
  objective: 'cost' | 'self_consumption' | 'carbon' | 'peak_shaving',
  constraints: {
    minBatterySoc?: number;
    maxBatterySoc?: number;
    priorityDevices?: string[];
    evDepartureTime?: string;
    evTargetSoc?: number;
  } = {}
): Promise<OptimizationResult | null> {
  try {
    // Set time range: current time to 24 hours from now
    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase.functions.invoke('energy-optimizer', {
      body: {
        siteId,
        startTime,
        endTime,
        deviceIds,
        objective,
        constraints
      }
    });

    if (error) throw error;
    
    if (data.success === false) {
      throw new Error(data.message || 'Optimization failed');
    }
    
    toast.success('Energy optimization complete');
    
    return {
      id: data.id,
      site_id: siteId,
      timestamp_start: startTime,
      timestamp_end: endTime,
      schedule_json: data.schedule,
      cost_estimate: data.savings
    };
  } catch (error) {
    console.error('Error running energy optimization:', error);
    toast.error('Failed to run energy optimization');
    return null;
  }
}

export async function sendDeviceControl(
  deviceId: string,
  command: string,
  parameters: Record<string, any> = {}
): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('device-control', {
      body: {
        deviceId,
        command,
        parameters
      }
    });

    if (error) throw error;
    
    if (data.success === false) {
      throw new Error(data.message || 'Control command failed');
    }
    
    toast.success(`Command ${command} sent successfully`);
    return true;
  } catch (error) {
    console.error(`Error sending command ${command} to device ${deviceId}:`, error);
    toast.error('Failed to send control command');
    return false;
  }
}

export async function generateAIForecasts(
  siteId: string,
  days = 3,
  includeWeather = true
): Promise<EnergyForecast[]> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-forecasting', {
      body: {
        siteId,
        days,
        includeWeather
      }
    });

    if (error) throw error;
    
    if (data.success === false) {
      throw new Error(data.message || 'Forecast generation failed');
    }
    
    toast.success(`Generated forecasts for ${days} days`);
    
    // Fetch the saved forecasts
    const { data: forecasts, error: fetchError } = await supabase
      .from('energy_forecasts')
      .select('*')
      .eq('site_id', siteId)
      .gte('forecast_time', new Date().toISOString())
      .order('forecast_time', { ascending: true });
    
    if (fetchError) throw fetchError;
    
    return forecasts || [];
  } catch (error) {
    console.error('Error generating AI forecasts:', error);
    toast.error('Failed to generate forecasts');
    return [];
  }
}

export async function getAIRecommendations(siteId: string): Promise<AIRecommendation[]> {
  try {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('site_id', siteId)
      .eq('applied', false)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    toast.error('Failed to fetch recommendations');
    return [];
  }
}

export async function applyRecommendation(id: string, userId: string): Promise<boolean> {
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
    console.error('Error applying recommendation:', error);
    toast.error('Failed to apply recommendation');
    return false;
  }
}

export async function getUserPreferences(userId: string): Promise<UserPreference | null> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data || null;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
}

export async function saveUserPreferences(
  userId: string, 
  preferences: Omit<UserPreference, 'id' | 'user_id'>
): Promise<UserPreference | null> {
  try {
    // Check if preferences exist
    const existing = await getUserPreferences(userId);
    
    if (existing) {
      // Update
      const { data, error } = await supabase
        .from('user_preferences')
        .update(preferences)
        .eq('user_id', userId)
        .select()
        .single();
        
      if (error) throw error;
      toast.success('Preferences updated');
      return data;
    } else {
      // Insert
      const { data, error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          ...preferences
        })
        .select()
        .single();
        
      if (error) throw error;
      toast.success('Preferences saved');
      return data;
    }
  } catch (error) {
    console.error('Error saving user preferences:', error);
    toast.error('Failed to save preferences');
    return null;
  }
}
