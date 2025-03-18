
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
  Zap
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import GlassPanel from '@/components/ui/GlassPanel';

const Settings = () => {
  // In a real app, these would be dynamic and connected to state
  const settingCategories = [
    {
      id: 'system',
      name: 'System Settings',
      description: 'General system configuration',
      icon: <Cog size={20} />,
      settings: [
        { id: 'general', name: 'General Configuration', description: 'Basic system parameters' },
        { id: 'update', name: 'System Updates', description: 'Update firmware and software' },
        { id: 'backup', name: 'Backup & Restore', description: 'System backup options' },
      ]
    },
    {
      id: 'users',
      name: 'User Management',
      description: 'User accounts and access control',
      icon: <User size={20} />,
      settings: [
        { id: 'accounts', name: 'User Accounts', description: 'Manage system users' },
        { id: 'roles', name: 'Role Management', description: 'Configure access levels' },
        { id: 'permissions', name: 'Permissions', description: 'Fine-grained access control' },
      ]
    },
    {
      id: 'security',
      name: 'Security & Compliance',
      description: 'System security settings',
      icon: <Shield size={20} />,
      settings: [
        { id: 'auth', name: 'Authentication', description: 'Login and identity verification' },
        { id: 'encryption', name: 'Encryption', description: 'Data protection settings' },
        { id: 'audit', name: 'Audit Logging', description: 'System activity tracking' },
      ]
    },
    {
      id: 'integration',
      name: 'Integrations',
      description: 'External system connections',
      icon: <Globe size={20} />,
      settings: [
        { id: 'api', name: 'API Configuration', description: 'External API connections' },
        { id: 'services', name: 'External Services', description: 'Third-party integrations' },
        { id: 'notifications', name: 'Notification Services', description: 'Email, SMS, push notifications' },
      ]
    },
    {
      id: 'data',
      name: 'Data Management',
      description: 'Data storage and processing settings',
      icon: <Database size={20} />,
      settings: [
        { id: 'storage', name: 'Storage Configuration', description: 'Data retention policies' },
        { id: 'export', name: 'Data Export', description: 'Export system data' },
        { id: 'processing', name: 'Processing Settings', description: 'Configure data processing' },
      ]
    },
    {
      id: 'energy',
      name: 'Energy Settings',
      description: 'Energy system specific configuration',
      icon: <Zap size={20} />,
      settings: [
        { id: 'thresholds', name: 'Operational Thresholds', description: 'System operational parameters' },
        { id: 'algorithms', name: 'Optimization Algorithms', description: 'AI and optimization settings' },
        { id: 'tariffs', name: 'Energy Tariffs', description: 'Pricing and billing configuration' },
      ]
    },
  ];
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
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
                  {category.settings.map((setting, idx) => (
                    <div 
                      key={setting.id} 
                      className={cn(
                        "flex justify-between items-center p-3 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer",
                        idx < category.settings.length - 1 && "border-b border-border/30"
                      )}
                    >
                      <div>
                        <div className="font-medium text-sm">{setting.name}</div>
                        <div className="text-xs text-muted-foreground">{setting.description}</div>
                      </div>
                      <div className="text-primary">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            ))}
          </div>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <GlassPanel className="p-4 flex items-center space-x-4">
              <div className="rounded-full p-3 bg-primary/10 text-primary">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="font-medium">API Key Management</h3>
                <p className="text-sm text-muted-foreground">Configure secure API access keys</p>
              </div>
            </GlassPanel>
            
            <GlassPanel className="p-4 flex items-center space-x-4">
              <div className="rounded-full p-3 bg-primary/10 text-primary">
                <RefreshCw size={18} />
              </div>
              <div>
                <h3 className="font-medium">Firmware Update</h3>
                <p className="text-sm text-muted-foreground">System v4.2.1 available</p>
              </div>
            </GlassPanel>
            
            <GlassPanel className="p-4 flex items-center space-x-4">
              <div className="rounded-full p-3 bg-primary/10 text-primary">
                <Book size={18} />
              </div>
              <div>
                <h3 className="font-medium">Documentation</h3>
                <p className="text-sm text-muted-foreground">Access system documentation</p>
              </div>
            </GlassPanel>
            
            <GlassPanel className="p-4 flex items-center space-x-4">
              <div className="rounded-full p-3 bg-primary/10 text-primary">
                <Server size={18} />
              </div>
              <div>
                <h3 className="font-medium">System Status</h3>
                <p className="text-sm text-muted-foreground">All services operational</p>
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
