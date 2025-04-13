
import { SettingCategory } from '@/types/settings';
import { 
  Book, 
  Cloud, 
  Cog, 
  Database, 
  Globe, 
  Key, 
  Lock, 
  RefreshCw, 
  Server, 
  Shield, 
  User, 
  Zap
} from 'lucide-react';
import React from 'react';

export const settingCategories: SettingCategory[] = [
  {
    id: 'system',
    name: 'System Settings',
    description: 'General system configuration',
    icon: React.createElement(Cog, { className: "h-8 w-8 text-primary" }),
    settings: [
      { 
        id: 'general', 
        name: 'General Configuration', 
        description: 'Basic system parameters',
        path: '/settings/general'
      },
      { 
        id: 'update', 
        name: 'System Updates', 
        description: 'Update firmware and software',
        path: '/settings/updates'
      },
      { 
        id: 'backup', 
        name: 'Backup & Restore', 
        description: 'System backup options',
        path: '/settings/backup'
      }
    ]
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'User accounts and access control',
    icon: React.createElement(User, { className: "h-8 w-8 text-primary" }),
    settings: [
      { 
        id: 'accounts', 
        name: 'User Accounts', 
        description: 'Manage system users',
        path: '/settings/users'
      },
      { 
        id: 'roles', 
        name: 'Role Management', 
        description: 'Configure access levels',
        path: '/settings/roles'
      },
      { 
        id: 'permissions', 
        name: 'Permissions', 
        description: 'Fine-grained access control',
        path: '/settings/permissions'
      }
    ]
  },
  {
    id: 'security',
    name: 'Security & Compliance',
    description: 'System security settings',
    icon: React.createElement(Shield, { className: "h-8 w-8 text-primary" }),
    settings: [
      { 
        id: 'auth', 
        name: 'Authentication', 
        description: 'Login and identity verification',
        path: '/settings/authentication'
      },
      { 
        id: 'encryption', 
        name: 'Encryption', 
        description: 'Data protection settings',
        path: '/settings/encryption'
      },
      { 
        id: 'audit', 
        name: 'Audit Logging', 
        description: 'System activity tracking',
        path: '/settings/audit'
      }
    ]
  },
  {
    id: 'integration',
    name: 'Integrations',
    description: 'External system connections',
    icon: React.createElement(Globe, { className: "h-8 w-8 text-primary" }),
    settings: [
      { 
        id: 'api', 
        name: 'API Configuration', 
        description: 'External API connections',
        path: '/settings/api'
      },
      { 
        id: 'services', 
        name: 'External Services', 
        description: 'Third-party integrations',
        path: '/settings/services'
      },
      { 
        id: 'notifications', 
        name: 'Notification Services', 
        description: 'Email, SMS, push notifications',
        path: '/settings/notifications'
      }
    ]
  },
  {
    id: 'data',
    name: 'Data Management',
    description: 'Data storage and processing',
    icon: React.createElement(Database, { className: "h-8 w-8 text-primary" }),
    settings: [
      { 
        id: 'storage', 
        name: 'Storage Configuration', 
        description: 'Data retention policies',
        path: '/settings/storage'
      },
      { 
        id: 'export', 
        name: 'Data Export', 
        description: 'Export system data',
        path: '/settings/export'
      },
      { 
        id: 'processing', 
        name: 'Processing Settings', 
        description: 'Configure data processing',
        path: '/settings/processing'
      }
    ]
  },
  {
    id: 'energy',
    name: 'Energy Settings',
    description: 'Energy system specific configuration',
    icon: React.createElement(Zap, { className: "h-8 w-8 text-primary" }),
    settings: [
      { 
        id: 'thresholds', 
        name: 'Operational Thresholds', 
        description: 'System operational parameters',
        path: '/settings/thresholds'
      },
      { 
        id: 'algorithms', 
        name: 'Optimization Algorithms', 
        description: 'AI and optimization settings',
        path: '/settings/algorithms'
      },
      { 
        id: 'tariffs', 
        name: 'Energy Tariffs', 
        description: 'Pricing and billing configuration',
        path: '/settings/tariffs'
      }
    ]
  }
];
