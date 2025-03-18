
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  ArrowDownUp,
  Globe,
  Zap,
  Shield,
  Power
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GridControlsProps {
  deviceId: string;
}

const GridControls: React.FC<GridControlsProps> = ({ deviceId }) => {
  return (
    <Tabs defaultValue="control">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="control">Control</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
      </TabsList>
      
      <TabsContent value="control" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Power className="mr-2 h-5 w-5 text-primary" />
              Grid Connection
            </CardTitle>
            <CardDescription>
              Control grid connection and power flow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Grid Connection</Label>
                <p className="text-xs text-muted-foreground">Main connection to utility grid</p>
              </div>
              <Switch 
                id="grid-connected" 
                defaultChecked 
                onCheckedChange={(checked) => 
                  toast.success(checked ? "Grid connected" : "Grid disconnected")
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Export</Label>
                <p className="text-xs text-muted-foreground">Send excess power to grid</p>
              </div>
              <Switch 
                id="allow-export" 
                defaultChecked 
                onCheckedChange={(checked) => 
                  toast.success(checked ? "Grid export enabled" : "Grid export disabled")
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Import</Label>
                <p className="text-xs text-muted-foreground">Draw power from grid when needed</p>
              </div>
              <Switch 
                id="allow-import" 
                defaultChecked 
                onCheckedChange={(checked) => 
                  toast.success(checked ? "Grid import enabled" : "Grid import disabled")
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => toast.success('Grid settings applied')}
            >
              Apply
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Grid Operation Settings</CardTitle>
            <CardDescription>
              Configure advanced grid interaction parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Zero Export Mode</Label>
                <p className="text-xs text-muted-foreground">Never export to grid</p>
              </div>
              <Switch id="zero-export" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Grid Support Mode</Label>
                <p className="text-xs text-muted-foreground">Provide grid stability services</p>
              </div>
              <Switch id="grid-support" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Frequency Response</Label>
                <p className="text-xs text-muted-foreground">Respond to grid frequency changes</p>
              </div>
              <Switch id="frequency-response" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => toast.success('Advanced settings saved')}
            >
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="monitoring" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Grid Quality Monitoring</CardTitle>
            <CardDescription>
              Monitor grid power quality parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => toast.info('Running power quality analysis...')}
              >
                <Activity className="h-8 w-8" />
                <div className="text-center">
                  <p className="font-medium">Power Quality</p>
                  <p className="text-xs text-muted-foreground">Run quality analysis</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => toast.info('Checking connection integrity...')}
              >
                <Shield className="h-8 w-8" />
                <div className="text-center">
                  <p className="font-medium">Connection Test</p>
                  <p className="text-xs text-muted-foreground">Verify grid connection</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => toast.info('Exporting grid metrics...')}
              >
                <Globe className="h-8 w-8" />
                <div className="text-center">
                  <p className="font-medium">Export Metrics</p>
                  <p className="text-xs text-muted-foreground">Download grid data</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => toast.info('Testing grid response...')}
              >
                <ArrowDownUp className="h-8 w-8" />
                <div className="text-center">
                  <p className="font-medium">Response Test</p>
                  <p className="text-xs text-muted-foreground">Test grid responsiveness</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="font-medium text-sm">{children}</div>
);

export default GridControls;
