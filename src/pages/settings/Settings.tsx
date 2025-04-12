import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, User, Shield, Building } from 'lucide-react';

interface SettingsNavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

const settingsNavItems: SettingsNavItem[] = [
  {
    title: 'User Settings',
    path: '/settings/user',
    icon: <User className="w-5 h-5" />,
    description: 'Manage your account settings and preferences',
  },
  {
    title: 'Security',
    path: '/settings/security',
    icon: <Shield className="w-5 h-5" />,
    description: 'Configure security settings and access controls',
  },
  {
    title: 'Site Settings',
    path: '/settings/site',
    icon: <Building className="w-5 h-5" />,
    description: 'Configure site-wide settings and defaults',
  },
];

/**
 * SettingsNav component for navigation between settings sections
 */
const SettingsNav = () => {
  const location = useLocation();

  return (
    <div className="space-y-4">
      {settingsNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path}>
            <Card className={`transition-colors ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-md ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

/**
 * Settings component for managing application settings
 */
const Settings = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-2 mb-6">
        <SettingsIcon className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <SettingsNav />
        </div>
        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Settings; 