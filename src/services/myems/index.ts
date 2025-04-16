
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type {
  EnergyCategory,
  Space,
  CostCenter,
  Tenant,
  TenantSpace,
  VirtualMeter,
  EnergySavingProject,
  EnergySavingMeasure,
  Benchmark,
  CarbonEmissionFactor,
  ScheduledReport,
  WeatherNormalization,
  DashboardCustomization
} from '@/types/myems';

// Energy Categories
export const fetchEnergyCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('energy_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as EnergyCategory[];
  } catch (error) {
    console.error('Error fetching energy categories:', error);
    toast.error('Failed to fetch energy categories');
    return [];
  }
};

// Spaces
export const fetchSpaces = async (parentId?: string) => {
  try {
    let query = supabase
      .from('spaces')
      .select('*');
    
    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else {
      query = query.is('parent_id', null);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data as Space[];
  } catch (error) {
    console.error('Error fetching spaces:', error);
    toast.error('Failed to fetch spaces');
    return [];
  }
};

export const fetchSpaceHierarchy = async () => {
  try {
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // Build hierarchy
    const spaces = data as Space[];
    const spaceMap = new Map();
    const rootSpaces: Space[] = [];
    
    // Create a map of all spaces by ID
    spaces.forEach(space => {
      spaceMap.set(space.id, { ...space, children: [] });
    });
    
    // Organize into hierarchy
    spaces.forEach(space => {
      if (space.parent_id && spaceMap.has(space.parent_id)) {
        const parent = spaceMap.get(space.parent_id);
        parent.children.push(spaceMap.get(space.id));
      } else {
        rootSpaces.push(spaceMap.get(space.id));
      }
    });
    
    return rootSpaces;
  } catch (error) {
    console.error('Error fetching space hierarchy:', error);
    toast.error('Failed to fetch space hierarchy');
    return [];
  }
};

// Cost Centers
export const fetchCostCenters = async () => {
  try {
    const { data, error } = await supabase
      .from('cost_centers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as CostCenter[];
  } catch (error) {
    console.error('Error fetching cost centers:', error);
    toast.error('Failed to fetch cost centers');
    return [];
  }
};

// Tenants
export const fetchTenants = async () => {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Tenant[];
  } catch (error) {
    console.error('Error fetching tenants:', error);
    toast.error('Failed to fetch tenants');
    return [];
  }
};

// Tenant spaces
export const fetchTenantSpaces = async (tenantId?: string) => {
  try {
    let query = supabase
      .from('tenant_spaces')
      .select(`
        *,
        tenant:tenants(*),
        space:spaces(*)
      `);
    
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as TenantSpace[];
  } catch (error) {
    console.error('Error fetching tenant spaces:', error);
    toast.error('Failed to fetch tenant spaces');
    return [];
  }
};

// Virtual meters
export const fetchVirtualMeters = async () => {
  try {
    const { data, error } = await supabase
      .from('virtual_meters')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as VirtualMeter[];
  } catch (error) {
    console.error('Error fetching virtual meters:', error);
    toast.error('Failed to fetch virtual meters');
    return [];
  }
};

// Energy saving projects
export const fetchEnergySavingProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('energy_saving_projects')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as EnergySavingProject[];
  } catch (error) {
    console.error('Error fetching energy saving projects:', error);
    toast.error('Failed to fetch energy saving projects');
    return [];
  }
};

// Energy saving measures
export const fetchEnergySavingMeasures = async (projectId?: string) => {
  try {
    let query = supabase
      .from('energy_saving_measures')
      .select('*');
    
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data as EnergySavingMeasure[];
  } catch (error) {
    console.error('Error fetching energy saving measures:', error);
    toast.error('Failed to fetch energy saving measures');
    return [];
  }
};

// Benchmarks
export const fetchBenchmarks = async (category?: string) => {
  try {
    let query = supabase
      .from('benchmarks')
      .select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    return data as Benchmark[];
  } catch (error) {
    console.error('Error fetching benchmarks:', error);
    toast.error('Failed to fetch benchmarks');
    return [];
  }
};

// Carbon emission factors
export const fetchCarbonEmissionFactors = async (energyCategory?: string) => {
  try {
    let query = supabase
      .from('carbon_emission_factors')
      .select('*');
    
    if (energyCategory) {
      query = query.eq('energy_category', energyCategory);
    }
    
    const { data, error } = await query.order('valid_from', { ascending: false });
    
    if (error) throw error;
    return data as CarbonEmissionFactor[];
  } catch (error) {
    console.error('Error fetching carbon emission factors:', error);
    toast.error('Failed to fetch carbon emission factors');
    return [];
  }
};

// Scheduled reports
export const fetchScheduledReports = async () => {
  try {
    const { data, error } = await supabase
      .from('scheduled_reports')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as ScheduledReport[];
  } catch (error) {
    console.error('Error fetching scheduled reports:', error);
    toast.error('Failed to fetch scheduled reports');
    return [];
  }
};

// Weather normalization data
export const fetchWeatherNormalizationData = async (spaceId?: string, startDate?: Date, endDate?: Date) => {
  try {
    let query = supabase
      .from('weather_normalization')
      .select(`
        *,
        space:spaces(*)
      `);
    
    if (spaceId) {
      query = query.eq('space_id', spaceId);
    }
    
    if (startDate) {
      query = query.gte('date', startDate.toISOString().split('T')[0]);
    }
    
    if (endDate) {
      query = query.lte('date', endDate.toISOString().split('T')[0]);
    }
    
    const { data, error } = await query.order('date');
    
    if (error) throw error;
    return data as WeatherNormalization[];
  } catch (error) {
    console.error('Error fetching weather normalization data:', error);
    toast.error('Failed to fetch weather normalization data');
    return [];
  }
};

// Dashboard customizations
export const fetchDashboardCustomizations = async (dashboardId: string) => {
  try {
    const { data, error } = await supabase
      .from('dashboard_customizations')
      .select('*')
      .eq('dashboard_id', dashboardId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    
    return data as DashboardCustomization | null;
  } catch (error) {
    console.error('Error fetching dashboard customization:', error);
    toast.error('Failed to fetch dashboard customization');
    return null;
  }
};

export const saveDashboardCustomization = async (customization: Partial<DashboardCustomization>) => {
  try {
    const { data: existingData, error: fetchError } = await supabase
      .from('dashboard_customizations')
      .select('*')
      .eq('dashboard_id', customization.dashboard_id as string)
      .eq('user_id', customization.user_id as string)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    
    let result;
    
    if (existingData) {
      // Update
      result = await supabase
        .from('dashboard_customizations')
        .update(customization)
        .eq('id', existingData.id)
        .select()
        .single();
    } else {
      // Insert
      result = await supabase
        .from('dashboard_customizations')
        .insert(customization)
        .select()
        .single();
    }
    
    const { data, error } = result;
    
    if (error) throw error;
    
    toast.success('Dashboard customization saved');
    return data as DashboardCustomization;
  } catch (error) {
    console.error('Error saving dashboard customization:', error);
    toast.error('Failed to save dashboard customization');
    return null;
  }
};

export default {
  fetchEnergyCategories,
  fetchSpaces,
  fetchSpaceHierarchy,
  fetchCostCenters,
  fetchTenants,
  fetchTenantSpaces,
  fetchVirtualMeters,
  fetchEnergySavingProjects,
  fetchEnergySavingMeasures,
  fetchBenchmarks,
  fetchCarbonEmissionFactors,
  fetchScheduledReports,
  fetchWeatherNormalizationData,
  fetchDashboardCustomizations,
  saveDashboardCustomization
};
