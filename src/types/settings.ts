export interface SettingCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  settings: SettingItem[];
}

export interface SettingItem {
  id: string;
  name: string;
  description: string;
  path: string;
}

export interface SecuritySettings {
  authentication: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
    };
  };
  encryption: {
    enabled: boolean;
    algorithm: string;
    keyRotation: number;
  };
  apiSecurity: {
    rateLimiting: boolean;
    allowedOrigins: string[];
    tokenExpiration: number;
  };
  auditLogging: {
    enabled: boolean;
    retentionPeriod: number;
    logLevel: 'info' | 'warning' | 'error';
  };
}

export interface DashboardData {
  gridSupply: {
    power: number;
    status: 'importing' | 'exporting' | 'neutral';
  };
  pvProduction: {
    power: number;
    capacity: number;
  };
  battery: {
    level: number;
    status: 'charging' | 'discharging' | 'idle';
    power: number;
  };
  household: {
    consumption: number;
  };
  energyFlow: {
    totalEnergy: number;
    selfConsumption: number;
    peakDemand: number;
  };
} 