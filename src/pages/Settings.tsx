import React from 'react';
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
  Zap,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassPanel from '@/components/ui/GlassPanel';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';

const Settings = () => {
  // In a real app, these would be dynamic and connected to state
  const settingCategories = [
    {
      id: 'system',
      name: 'System Settings',
      description: 'General system configuration',
      icon: <Cog className="h-8 w-8 text-primary" />,
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
        },
      ]
    },
    {
      id: 'users',
      name: 'User Management',
      description: 'User accounts and access control',
      icon: <User className="h-8 w-8 text-primary" />,
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
        },
      ]
    },
    {
      id: 'security',
      name: 'Security & Compliance',
      description: 'System security settings',
      icon: <Shield className="h-8 w-8 text-primary" />,
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
        },
      ]
    },
    {
      id: 'integration',
      name: 'Integrations',
      description: 'External system connections',
      icon: <Globe className="h-8 w-8 text-primary" />,
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
        },
      ]
    },
    {
      id: 'data',
      name: 'Data Management',
      description: 'Data storage and processing',
      icon: <Database className="h-8 w-8 text-primary" />,
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
        },
      ]
    },
    {
      id: 'energy',
      name: 'Energy Settings',
      description: 'Energy system specific configuration',
      icon: <Zap className="h-8 w-8 text-primary" />,
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
        },
      ]
    },
  ];
  
  const SettingItem = ({ name, description, path }: { name: string; description: string; path: string }) => (
    <Link 
      to={path} 
      className="flex justify-between items-center p-3 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer border-b border-border/30 last:border-0"
    >
      <div>
        <div className="font-medium text-sm">{name}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <div className="text-primary">
        <ChevronRight size={20} />
      </div>
    </Link>
  );

  const QuickActionItem = ({ icon, title, description, path }: 
    { icon: React.ReactNode; title: string; description: string; path: string }) => (
    <Link to={path}>
      <GlassPanel className="p-4 flex items-center space-x-4 hover:bg-secondary/10 transition-colors">
        <div className="rounded-full p-3 bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </GlassPanel>
    </Link>
  );
  
  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">System Settings</h1>
          <p className="text-muted-foreground">Configure the Energy Management System</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {settingCategories.map((category, index) => (
            <GlassPanel
              key={category.id}
              className="overflow-hidden animate-slide-up"
              style={{ animationDelay: `${0.1 + 0.05 * index}s` }}
            >
              <div className="p-5 border-b border-border/50 flex items-center space-x-3">
                <div className="rounded-full p-2 bg-primary/10 text-primary">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
              
              <div className="p-2">
                {category.settings.map((setting) => (
                  <SettingItem
                    key={setting.id}
                    name={setting.name}
                    description={setting.description}
                    path={setting.path}
                  />
                ))}
              </div>
            </GlassPanel>
          ))}
        </div>
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <QuickActionItem 
            icon={<Key size={18} />} 
            title="API Key Management" 
            description="Configure secure API access keys" 
            path="/settings/api-keys"
          />
          
          <QuickActionItem 
            icon={<RefreshCw size={18} />} 
            title="Firmware Update" 
            description="System v4.2.1 available" 
            path="/settings/updates"
          />
          
          <QuickActionItem 
            icon={<Book size={18} />} 
            title="Documentation" 
            description="Access system documentation" 
            path="/documentation"
          />
          
          <QuickActionItem 
            icon={<Server size={18} />} 
            title="System Status" 
            description="All services operational" 
            path="/system-status"
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
