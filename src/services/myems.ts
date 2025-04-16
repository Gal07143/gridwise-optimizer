
import { supabase } from '@/integrations/supabase/client';
import { EnergyCategory, Space, CostCenter, Tenant, VirtualMeter, EnergySavingProject } from '@/types/myems';

export async function fetchEnergyCategories(): Promise<EnergyCategory[]> {
  try {
    const { data, error } = await supabase
      .from('energy_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data as EnergyCategory[];
  } catch (error) {
    console.error('Error fetching energy categories:', error);
    return [];
  }
}

export async function fetchSpaces(parentId?: string): Promise<Space[]> {
  try {
    let query = supabase
      .from('spaces')
      .select('*, children:spaces(id, name, type)');
    
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
    return [];
  }
}

export async function fetchCostCenters(): Promise<CostCenter[]> {
  try {
    const { data, error } = await supabase
      .from('cost_centers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data as CostCenter[];
  } catch (error) {
    console.error('Error fetching cost centers:', error);
    return [];
  }
}

export async function fetchTenants(): Promise<Tenant[]> {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data as Tenant[];
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return [];
  }
}

export async function fetchVirtualMeters(): Promise<VirtualMeter[]> {
  try {
    const { data, error } = await supabase
      .from('virtual_meters')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data as VirtualMeter[];
  } catch (error) {
    console.error('Error fetching virtual meters:', error);
    return [];
  }
}

export async function fetchEnergySavingProjects(): Promise<EnergySavingProject[]> {
  try {
    const { data, error } = await supabase
      .from('energy_saving_projects')
      .select('*, measures:energy_saving_measures(*)')
      .order('name');
    
    if (error) throw error;
    
    return data as EnergySavingProject[];
  } catch (error) {
    console.error('Error fetching energy saving projects:', error);
    return [];
  }
}

export async function createEnergyCategory(category: Partial<EnergyCategory>): Promise<EnergyCategory | null> {
  try {
    const { data, error } = await supabase
      .from('energy_categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as EnergyCategory;
  } catch (error) {
    console.error('Error creating energy category:', error);
    return null;
  }
}

export async function updateEnergyCategory(id: string, updates: Partial<EnergyCategory>): Promise<EnergyCategory | null> {
  try {
    const { data, error } = await supabase
      .from('energy_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as EnergyCategory;
  } catch (error) {
    console.error('Error updating energy category:', error);
    return null;
  }
}

export async function deleteEnergyCategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('energy_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting energy category:', error);
    return false;
  }
}
