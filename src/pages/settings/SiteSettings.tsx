import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const SiteSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                type="text"
                placeholder="Enter site name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Site Description</Label>
              <Textarea
                id="description"
                placeholder="Enter site description"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Data Retention</Label>
              <p className="text-sm text-muted-foreground">
                Keep historical data for 30 days
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backups</Label>
              <p className="text-sm text-muted-foreground">
                Create daily backups of site data
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="mqttBroker">MQTT Broker URL</Label>
              <Input
                id="mqttBroker"
                type="text"
                placeholder="mqtt://broker.example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apiEndpoint">API Endpoint</Label>
              <Input
                id="apiEndpoint"
                type="text"
                placeholder="https://api.example.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable maintenance mode for site updates
              </p>
            </div>
            <Switch />
          </div>
          <Button variant="destructive" className="w-full">
            Clear Site Cache
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettings; 