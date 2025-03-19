
import React, { useState } from 'react';
import { PanelTop, Wind, Sun, Battery, Bolt } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeviceType } from '@/types/energy';
import ControlDialog from '@/components/devices/controls/ControlDialog';
import { toast } from 'sonner';

const DeviceControlsPanel: React.FC = () => {
  const [activeDialog, setActiveDialog] = useState<{
    isOpen: boolean;
    deviceType: DeviceType;
    deviceId: string;
  }>({
    isOpen: false,
    deviceType: 'wind',
    deviceId: 'wind-1'
  });

  const openControlDialog = (deviceType: DeviceType, deviceId: string) => {
    setActiveDialog({
      isOpen: true,
      deviceType,
      deviceId
    });
    toast.info(`Opening ${deviceType} controls`);
  };

  const closeControlDialog = () => {
    setActiveDialog(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center text-lg">
          <PanelTop className="mr-2 h-5 w-5 text-primary" />
          Device Controls
        </CardTitle>
        <CardDescription>
          Individual device management and configuration
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-32 gap-2"
            onClick={() => openControlDialog('wind', 'wind-1')}
          >
            <Wind className="h-10 w-10 text-blue-500" />
            <div className="text-center">
              <p className="font-medium">Wind Turbine</p>
              <p className="text-xs text-muted-foreground">Control wind generation</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-32 gap-2"
            onClick={() => openControlDialog('solar', 'solar-1')}
          >
            <Sun className="h-10 w-10 text-yellow-500" />
            <div className="text-center">
              <p className="font-medium">Solar Array</p>
              <p className="text-xs text-muted-foreground">Manage solar production</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-32 gap-2"
            onClick={() => openControlDialog('battery', 'battery-1')}
          >
            <Battery className="h-10 w-10 text-green-500" />
            <div className="text-center">
              <p className="font-medium">Battery System</p>
              <p className="text-xs text-muted-foreground">Control energy storage</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-32 gap-2"
            onClick={() => openControlDialog('load', 'load-1')}
          >
            <Bolt className="h-10 w-10 text-orange-500" />
            <div className="text-center">
              <p className="font-medium">Loads</p>
              <p className="text-xs text-muted-foreground">Manage consumption</p>
            </div>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => toast.info("Switching to automatic control mode")}
          >
            <div className="text-center">
              <p className="font-medium">Automatic</p>
              <p className="text-xs text-muted-foreground">Optimized control</p>
            </div>
          </Button>
          
          <Button 
            variant="default" 
            className="flex flex-col items-center justify-center h-24 gap-2 bg-blue-500 hover:bg-blue-600"
            onClick={() => toast.info("Manual control mode active")}
          >
            <div className="text-center">
              <p className="font-medium">Manual</p>
              <p className="text-xs text-muted-foreground">User-defined settings</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => toast.success("Island Mode activated")}
          >
            <div className="text-center">
              <p className="font-medium">Island Mode</p>
              <p className="text-xs text-muted-foreground">Off-grid operation</p>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => toast.success("Grid Connected Mode activated")}
          >
            <div className="text-center">
              <p className="font-medium">Grid Connected</p>
              <p className="text-xs text-muted-foreground">Grid-tied operation</p>
            </div>
          </Button>
        </div>
        
        <ControlDialog 
          isOpen={activeDialog.isOpen}
          onClose={closeControlDialog}
          deviceType={activeDialog.deviceType}
          deviceId={activeDialog.deviceId}
        />
      </CardContent>
    </Card>
  );
};

export default DeviceControlsPanel;
