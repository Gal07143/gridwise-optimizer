
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DeviceSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Device Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="connectivity">Connectivity</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Default Device Settings</h3>
                <p className="text-muted-foreground">
                  Configure default settings for all devices in the system.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="connectivity">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Connectivity Settings</h3>
                <p className="text-muted-foreground">
                  Configure default connection protocols and retry settings.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="security">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Settings</h3>
                <p className="text-muted-foreground">
                  Configure device security settings and encryption protocols.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceSettings;
