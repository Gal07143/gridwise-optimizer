
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BatteryControlTab from './BatteryControlTab';
import BatterySettingsTab from './BatterySettingsTab';
import BatteryMaintenanceTab from './BatteryMaintenanceTab';

interface BatteryControlPanelProps {
  deviceId: string;
}

const BatteryControlPanel: React.FC<BatteryControlPanelProps> = ({ deviceId }) => {
  return (
    <Tabs defaultValue="control">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="control">Control</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
      </TabsList>
      
      <TabsContent value="control" className="space-y-4 mt-4">
        <BatteryControlTab deviceId={deviceId} />
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4 mt-4">
        <BatterySettingsTab deviceId={deviceId} />
      </TabsContent>
      
      <TabsContent value="maintenance" className="space-y-4 mt-4">
        <BatteryMaintenanceTab deviceId={deviceId} />
      </TabsContent>
    </Tabs>
  );
};

export default BatteryControlPanel;
