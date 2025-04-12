import React, { useState } from 'react';
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
  ChevronRight,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassPanel from '@/components/ui/GlassPanel';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import { settingCategories } from '@/config/settings';

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

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
    <ErrorBoundary>
      <AppLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Configure your system settings and preferences
            </p>
          </div>

          <div className="grid gap-6">
            {settingCategories.map((category) => (
              <GlassPanel key={category.id} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {category.icon}
                  <div>
                    <h2 className="text-lg font-semibold">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
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
        </div>
      </AppLayout>
    </ErrorBoundary>
  );
};

export default Settings;
