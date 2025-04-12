import { createClient } from '@supabase/supabase-js';
import { SecuritySettings, DashboardData } from '../types/settings';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseService = {
    supabase, // Expose the Supabase client

    // Settings
    async getSettings(userId: string) {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('user_id', userId);
        
        if (error) throw error;
        return data;
    },

    async updateSettings(userId: string, settings: any) {
        const { data, error } = await supabase
            .from('settings')
            .upsert({ user_id: userId, ...settings });
        
        if (error) throw error;
        return data;
    },

    // Security Settings
    async getSecuritySettings(userId: string) {
        const { data, error } = await supabase
            .from('security_settings')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error) throw error;
        return data;
    },

    async updateSecuritySettings(userId: string, settings: SecuritySettings) {
        const { data, error } = await supabase
            .from('security_settings')
            .upsert({ user_id: userId, ...settings });
        
        if (error) throw error;
        return data;
    },

    // Dashboard Data
    async getDashboardData(userId: string) {
        const { data, error } = await supabase
            .from('dashboard_data')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error) throw error;
        return data;
    },

    async updateDashboardData(userId: string, data: DashboardData) {
        const { data: result, error } = await supabase
            .from('dashboard_data')
            .upsert({ user_id: userId, ...data });
        
        if (error) throw error;
        return result;
    }
}; 