import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';

interface SiteSettings {
  siteName: string;
  timezone: string;
  dateFormat: string;
  autoRefresh: boolean;
  refreshInterval: number;
  defaultDeviceType: string;
  enableTelemetry: boolean;
}

const defaultSettings: SiteSettings = {
  siteName: 'GridWise Optimizer',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  autoRefresh: true,
  refreshInterval: 60,
  defaultDeviceType: 'modbus',
  enableTelemetry: true,
};

/**
 * SiteSettings component for managing site-wide settings
 */
const SiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save site settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast.success('Site settings saved successfully');
    } catch (error) {
      toast.error('Failed to save site settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              className="w-full p-2 border rounded-md"
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="CST">Central Time</option>
              <option value="MST">Mountain Time</option>
              <option value="PST">Pacific Time</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <select
              id="dateFormat"
              className="w-full p-2 border rounded-md"
              value={settings.dateFormat}
              onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-refresh Data</Label>
              <p className="text-sm text-muted-foreground">
                Automatically refresh device data at regular intervals
              </p>
            </div>
            <Switch
              checked={settings.autoRefresh}
              onCheckedChange={(checked) => setSettings({ ...settings, autoRefresh: checked })}
            />
          </div>
          {settings.autoRefresh && (
            <div className="space-y-2">
              <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
              <Input
                id="refreshInterval"
                type="number"
                min="30"
                max="3600"
                value={settings.refreshInterval}
                onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="defaultDeviceType">Default Device Type</Label>
            <select
              id="defaultDeviceType"
              className="w-full p-2 border rounded-md"
              value={settings.defaultDeviceType}
              onChange={(e) => setSettings({ ...settings, defaultDeviceType: e.target.value })}
            >
              <option value="modbus">Modbus</option>
              <option value="mqtt">MQTT</option>
              <option value="http">HTTP</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Telemetry</Label>
              <p className="text-sm text-muted-foreground">
                Collect and store device telemetry data
              </p>
            </div>
            <Switch
              checked={settings.enableTelemetry}
              onCheckedChange={(checked) => setSettings({ ...settings, enableTelemetry: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default SiteSettings; 