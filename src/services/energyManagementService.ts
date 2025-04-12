import { supabase } from './supabase';
import { Asset, GridSignal, EnergyData } from '../types/energyManagement';

export const energyManagementService = {
    // Asset Management
    async getAssets(): Promise<Asset[]> {
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .order('name');
        
        if (error) throw error;
        return data || [];
    },

    async getAsset(id: string): Promise<Asset> {
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    },

    async createAsset(asset: Omit<Asset, 'id'>): Promise<Asset> {
        const { data, error } = await supabase
            .from('assets')
            .insert(asset)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async updateAsset(id: string, asset: Partial<Asset>): Promise<Asset> {
        const { data, error } = await supabase
            .from('assets')
            .update(asset)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async deleteAsset(id: string): Promise<void> {
        const { error } = await supabase
            .from('assets')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
    },

    // Grid Signals
    async getGridSignals(): Promise<GridSignal[]> {
        const { data, error } = await supabase
            .from('grid_signals')
            .select('*')
            .order('timestamp', { ascending: false });
        
        if (error) throw error;
        return data || [];
    },

    async createGridSignal(signal: Omit<GridSignal, 'id'>): Promise<GridSignal> {
        const { data, error } = await supabase
            .from('grid_signals')
            .insert(signal)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    // Energy Data
    async getEnergyData(assetId: string, startDate: string, endDate: string): Promise<EnergyData[]> {
        const { data, error } = await supabase
            .from('energy_data')
            .select('*')
            .eq('asset_id', assetId)
            .gte('timestamp', startDate)
            .lte('timestamp', endDate)
            .order('timestamp');
        
        if (error) throw error;
        return data || [];
    },

    async createEnergyData(energyData: Omit<EnergyData, 'id'>): Promise<EnergyData> {
        const { data, error } = await supabase
            .from('energy_data')
            .insert(energyData)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
}; 