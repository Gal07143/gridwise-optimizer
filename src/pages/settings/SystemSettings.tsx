
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';

const SystemSettings: React.FC = () => {
  const [maintenance, setMaintenance] = React.useState(false);
  const [debugMode, setDebugMode] = React.useState(false);
  const [autoUpdates, setAutoUpdates] = React.useState(true);

  const handleReset = () => {
    toast.success('System settings reset to default values');
    setMaintenance(false);
    setDebugMode(false);
    setAutoUpdates(true);
  };

  const handleSave = () => {
    toast.success('System settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Put the system into maintenance mode
              </p>
            </div>
            <Switch
              id="maintenance"
              checked={maintenance}
              onCheckedChange={setMaintenance}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="debug">Debug Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable verbose logging and debugging tools
              </p>
            </div>
            <Switch
              id="debug"
              checked={debugMode}
              onCheckedChange={setDebugMode}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="updates">Automatic Updates</Label>
              <p className="text-sm text-muted-foreground">
                Allow system to update automatically when available
              </p>
            </div>
            <Switch
              id="updates"
              checked={autoUpdates}
              onCheckedChange={setAutoUpdates}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SystemSettings;
