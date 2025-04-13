import { LucideIcon, LucideProps } from 'lucide-react';
import { FunctionComponentElement } from 'react';

export interface Setting {
  id: string;
  name: string;
  description: string;
  path: string;
}

export interface SettingCategory {
  id: string;
  name: string;
  description: string;
  icon: FunctionComponentElement<LucideProps>;
  settings: Setting[];
}

export interface UserPreferences {
  emailNotifications: boolean;
  darkMode: boolean;
  autoRefresh: boolean;
  language: string;
  timezone: string;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: boolean;
  apiKeyRotation: boolean;
  rateLimiting: boolean;
  deviceAuth: boolean;
  encryptedComms: boolean;
}

export interface SiteSettings {
  siteName: string;
  description: string;
  dataRetention: boolean;
  autoBackups: boolean;
  mqttBrokerUrl: string;
  apiEndpoint: string;
  maintenanceMode: boolean;
} 