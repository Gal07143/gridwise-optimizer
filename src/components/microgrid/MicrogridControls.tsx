
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MicrogridState } from './types';

export interface MicrogridControlsProps {
  microgridState: MicrogridState;
  onUpdateMode: (command: string) => boolean;
  onToggleConnection: (command: string) => boolean;
  disabled?: boolean;
}

const MicrogridControls: React.FC<MicrogridControlsProps> = ({
  microgridState,
  onUpdateMode,
  onToggleConnection,
  disabled = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Operating Mode</h3>
            <Tabs
              defaultValue={microgridState.systemMode}
              className="w-full"
              onValueChange={(value) => onUpdateMode(value)}
            >
              <TabsList className="w-full">
                <TabsTrigger value="auto" disabled={disabled}>Auto</TabsTrigger>
                <TabsTrigger value="eco" disabled={disabled}>Eco</TabsTrigger>
                <TabsTrigger value="backup" disabled={disabled}>Backup</TabsTrigger>
                <TabsTrigger value="manual" disabled={disabled}>Manual</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Grid Connection</h3>
            <Button
              variant={microgridState.gridConnection ? "default" : "outline"}
              className="w-full"
              onClick={() => onToggleConnection(microgridState.gridConnection ? "disconnect" : "connect")}
              disabled={disabled}
            >
              {microgridState.gridConnection ? "Connected" : "Disconnected"}
            </Button>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Current system status: <span className="font-semibold">{microgridState.systemMode.toUpperCase()}</span> mode
              with grid {microgridState.gridConnection ? "connected" : "disconnected"}.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MicrogridControls;
