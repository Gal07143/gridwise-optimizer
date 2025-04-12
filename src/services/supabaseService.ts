import { supabase } from '../lib/supabase';
import { SecuritySettings, DashboardData } from '../types/settings';

export const supabaseService = {
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
            .upsert({ ...settings, user_id: userId, updated_at: new Date() })
            .select();
        
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
            .upsert({
                user_id: userId,
                two_factor_enabled: settings.authentication.twoFactorEnabled,
                session_timeout: settings.authentication.sessionTimeout,
                password_policy: settings.authentication.passwordPolicy,
                encryption_enabled: settings.encryption.enabled,
                encryption_algorithm: settings.encryption.algorithm,
                key_rotation: settings.encryption.keyRotation,
                rate_limiting: settings.apiSecurity.rateLimiting,
                allowed_origins: settings.apiSecurity.allowedOrigins,
                token_expiration: settings.apiSecurity.tokenExpiration,
                audit_logging_enabled: settings.auditLogging.enabled,
                retention_period: settings.auditLogging.retentionPeriod,
                log_level: settings.auditLogging.logLevel,
                updated_at: new Date()
            })
            .select();
        
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
            .upsert({
                user_id: userId,
                grid_supply: data.gridSupply,
                pv_production: data.pvProduction,
                battery: data.battery,
                household: data.household,
                energy_flow: data.energyFlow,
                updated_at: new Date()
            })
            .select();
        
        if (error) throw error;
        return result;
    }
}; 