
import React, { useState } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Link, Globe, Cloud, Database, AlertTriangle, PlusCircle, Power, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface ServiceProps {
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  icon: React.ReactNode;
}

const ExternalServices = () => {
  const [services, setServices] = useState<ServiceProps[]>([
    {
      name: 'Weather API',
      description: 'Provides weather forecast data for energy optimization',
      status: 'connected',
      icon: <Cloud size={18} />
    },
    {
      name: 'Grid Monitoring',
      description: 'Connects to utility provider for grid status updates',
      status: 'connected',
      icon: <Power size={18} />
    },
    {
      name: 'Data Storage Cloud',
      description: 'External data storage and backup service',
      status: 'connected',
      icon: <Database size={18} />
    },
    {
      name: 'Emergency Alert System',
      description: 'Connects to emergency services for critical alerts',
      status: 'disconnected',
      icon: <AlertTriangle size={18} />
    }
  ]);

  const handleToggleService = (index: number) => {
    const updatedServices = [...services];
    const service = updatedServices[index];
    service.status = service.status === 'connected' ? 'disconnected' : 'connected';
    setServices(updatedServices);
    
    toast.success(`${service.name} ${service.status === 'connected' ? 'connected' : 'disconnected'} successfully`);
  };

  const handleAddNewService = () => {
    toast.info('Add new service dialog would open here');
  };

  return (
    <SettingsPageTemplate 
      title="External Services" 
      description="Connect and configure external service integrations"
      headerIcon={<Link size={20} />}
      actions={
        <Button onClick={handleAddNewService} className="gap-2">
          <PlusCircle size={16} />
          Add New Service
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="bg-primary/5 p-4 rounded-lg">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Globe size={18} />
            <span>Connected Services</span>
          </h3>
          <p className="text-sm text-muted-foreground">Manage connections to external APIs and services</p>
        </div>
        
        <div className="grid gap-4">
          {services.map((service, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="rounded-full p-2 bg-primary/10 text-primary mt-1">
                    {service.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-medium">{service.name}</h4>
                      <Badge variant={service.status === 'connected' ? 'default' : 'secondary'}>
                        {service.status === 'connected' ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">Configure</Button>
                      <Button variant="outline" size="sm">View Logs</Button>
                    </div>
                  </div>
                </div>
                <Switch 
                  checked={service.status === 'connected'} 
                  onCheckedChange={() => handleToggleService(index)} 
                />
              </div>
            </Card>
          ))}
        </div>

        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Service Settings</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium">Auto-reconnect Services</h4>
              <p className="text-sm text-muted-foreground">Automatically reconnect to services after disruptions</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium">Fail-safe Mode</h4>
              <p className="text-sm text-muted-foreground">Continue operations when services are unavailable</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium">Enhanced Security</h4>
              <p className="text-sm text-muted-foreground">Use additional security measures for service connections</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </SettingsPageTemplate>
  );
};

export default ExternalServices;
