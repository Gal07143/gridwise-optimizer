
import React from 'react';
import { PanelTop, Wind, Sun, Battery, Bolt } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import WindControls from '@/components/devices/controls/WindControls';

const DeviceControlsPanel: React.FC = () => {
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
        <Tabs defaultValue="wind">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="wind">
              <Wind className="mr-2 h-4 w-4" />
              Wind Turbine
            </TabsTrigger>
            <TabsTrigger value="solar">
              <Sun className="mr-2 h-4 w-4" />
              Solar Array
            </TabsTrigger>
            <TabsTrigger value="battery">
              <Battery className="mr-2 h-4 w-4" />
              Battery System
            </TabsTrigger>
            <TabsTrigger value="loads">
              <Bolt className="mr-2 h-4 w-4" />
              Loads
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="wind" className="pt-6">
            <WindControls deviceId="wind-1" />
          </TabsContent>
          
          <TabsContent value="solar" className="pt-6">
            <div className="p-8 text-center">
              <Sun className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-xl font-medium">Solar Array Control</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Solar array control interface is currently being upgraded
              </p>
              <Button>Go to Solar Controls</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="battery" className="pt-6">
            <div className="p-8 text-center">
              <Battery className="h-16 w-16 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-medium">Battery System Control</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Battery system control interface is currently being upgraded
              </p>
              <Button>Go to Battery Controls</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="loads" className="pt-6">
            <div className="p-8 text-center">
              <Bolt className="h-16 w-16 mx-auto text-orange-500 mb-4" />
              <h3 className="text-xl font-medium">Load Management</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Load management interface is currently being upgraded
              </p>
              <Button>Go to Load Controls</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DeviceControlsPanel;
