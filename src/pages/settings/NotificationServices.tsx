
import React, { useState } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Bell, Mail, MessageSquare, PhoneCall, Smartphone, PlusCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface NotificationChannelProps {
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
  configuredAddresses: string[];
}

const NotificationServices = () => {
  const [channels, setChannels] = useState<NotificationChannelProps[]>([
    {
      name: 'Email Notifications',
      description: 'Send alerts and reports via email',
      enabled: true,
      icon: <Mail size={18} />,
      configuredAddresses: ['admin@example.com', 'operations@example.com']
    },
    {
      name: 'SMS Alerts',
      description: 'Send critical alerts via SMS',
      enabled: true,
      icon: <MessageSquare size={18} />,
      configuredAddresses: ['+1 (555) 123-4567']
    },
    {
      name: 'Mobile Push Notifications',
      description: 'Send alerts to mobile devices',
      enabled: false,
      icon: <Smartphone size={18} />,
      configuredAddresses: []
    },
    {
      name: 'Phone Calls',
      description: 'Automated calls for critical alerts',
      enabled: false,
      icon: <PhoneCall size={18} />,
      configuredAddresses: []
    }
  ]);

  const handleToggleChannel = (index: number) => {
    const updatedChannels = [...channels];
    updatedChannels[index].enabled = !updatedChannels[index].enabled;
    setChannels(updatedChannels);
    
    toast.success(`${updatedChannels[index].name} ${updatedChannels[index].enabled ? 'enabled' : 'disabled'}`);
  };

  const handleAddNewChannel = () => {
    toast.info('Add new notification channel dialog would open here');
  };

  return (
    <SettingsPageTemplate 
      title="Notification Services" 
      description="Configure system notifications and alerts"
      headerIcon={<Bell size={20} />}
      actions={
        <Button onClick={handleAddNewChannel} className="gap-2">
          <PlusCircle size={16} />
          Add Channel
        </Button>
      }
    >
      <Tabs defaultValue="channels">
        <TabsList className="mb-6">
          <TabsTrigger value="channels">Notification Channels</TabsTrigger>
          <TabsTrigger value="templates">Notification Templates</TabsTrigger>
          <TabsTrigger value="schedules">Notification Schedules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="channels" className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Bell size={18} />
              <span>Notification Channels</span>
            </h3>
            <p className="text-sm text-muted-foreground">Configure how alerts and notifications are delivered</p>
          </div>
          
          <div className="grid gap-4">
            {channels.map((channel, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="rounded-full p-2 bg-primary/10 text-primary mt-1">
                      {channel.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-medium">{channel.name}</h4>
                        <Badge variant={channel.enabled ? 'default' : 'secondary'}>
                          {channel.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{channel.description}</p>
                      
                      {channel.configuredAddresses.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground">Configured recipients:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {channel.configuredAddresses.map((address, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {address}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Settings size={14} />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">Test</Button>
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={channel.enabled} 
                    onCheckedChange={() => handleToggleChannel(index)} 
                  />
                </div>
              </Card>
            ))}
          </div>

          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium">Batched Notifications</h4>
                <p className="text-sm text-muted-foreground">Group similar notifications to reduce frequency</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium">Quiet Hours</h4>
                <p className="text-sm text-muted-foreground">Suppress non-critical notifications during specified hours</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium">Escalation</h4>
                <p className="text-sm text-muted-foreground">Escalate unacknowledged critical alerts</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="flex items-center justify-center h-40 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Notification Templates configuration coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="schedules">
          <div className="flex items-center justify-center h-40 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Notification Schedules configuration coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </SettingsPageTemplate>
  );
};

export default NotificationServices;
