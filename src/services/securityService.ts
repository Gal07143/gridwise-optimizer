import { supabaseService } from './supabaseService';
import { toast } from 'sonner';

export interface SecurityAuditLog {
  id: string;
  user_id: string;
  action: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
  metadata?: Record<string, any>;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string | null;
  permissions: string[];
  is_active: boolean;
}

export interface Session {
  id: string;
  user_id: string;
  device: string;
  ip_address: string;
  last_active: string;
  current: boolean;
  is_active: boolean;
}

export interface TwoFactorSettings {
  user_id: string;
  is_enabled: boolean;
  secret: string;
  backup_codes: string[];
  last_used_backup_code: string | null;
}

export const securityService = {
  // 2FA Management
  async enable2FA(userId: string, secret: string): Promise<void> {
    const { error } = await supabaseService.supabase
      .from('two_factor_settings')
      .upsert({
        user_id: userId,
        is_enabled: true,
        secret,
        backup_codes: Array.from({ length: 8 }, () => 
          Math.random().toString(36).substr(2, 8).toUpperCase()
        ),
      });

    if (error) throw error;
  },

  async disable2FA(userId: string): Promise<void> {
    const { error } = await supabaseService.supabase
      .from('two_factor_settings')
      .update({ is_enabled: false })
      .eq('user_id', userId);

    if (error) throw error;
  },

  async verify2FACode(userId: string, code: string): Promise<boolean> {
    const { data, error } = await supabaseService.supabase
      .from('two_factor_settings')
      .select('secret')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) return false;

    // Implement TOTP verification here
    // For now, we'll just return true for demonstration
    return true;
  },

  // Session Management
  async getActiveSessions(userId: string): Promise<Session[]> {
    const { data, error } = await supabaseService.supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('last_active', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async revokeSession(sessionId: string): Promise<void> {
    const { error } = await supabaseService.supabase
      .from('sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    if (error) throw error;
  },

  // API Key Management
  async createApiKey(userId: string, name: string, permissions: string[]): Promise<ApiKey> {
    const { data, error } = await supabaseService.supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        name,
        key: Math.random().toString(36).substr(2, 32),
        permissions,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getApiKeys(userId: string): Promise<ApiKey[]> {
    const { data, error } = await supabaseService.supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async revokeApiKey(keyId: string): Promise<void> {
    const { error } = await supabaseService.supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', keyId);

    if (error) throw error;
  },

  // IP Whitelist
  async getWhitelistedIPs(userId: string): Promise<string[]> {
    const { data, error } = await supabaseService.supabase
      .from('ip_whitelist')
      .select('ip_address')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map(item => item.ip_address) || [];
  },

  async addWhitelistedIP(userId: string, ip: string): Promise<void> {
    const { error } = await supabaseService.supabase
      .from('ip_whitelist')
      .insert({ user_id: userId, ip_address: ip });

    if (error) throw error;
  },

  async removeWhitelistedIP(userId: string, ip: string): Promise<void> {
    const { error } = await supabaseService.supabase
      .from('ip_whitelist')
      .delete()
      .eq('user_id', userId)
      .eq('ip_address', ip);

    if (error) throw error;
  },

  // Audit Logging
  async getAuditLogs(userId: string, limit = 50): Promise<SecurityAuditLog[]> {
    const { data, error } = await supabaseService.supabase
      .from('security_audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async logSecurityEvent(
    userId: string,
    action: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const { error } = await supabaseService.supabase
      .from('security_audit_logs')
      .insert({
        user_id: userId,
        action,
        ip_address: '', // Get from request context
        user_agent: '', // Get from request context
        metadata,
      });

    if (error) throw error;
  },
}; 