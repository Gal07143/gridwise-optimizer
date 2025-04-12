import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
  apiKey: string;
}

const defaultSettings: SecuritySettings = {
  twoFactorAuth: false,
  sessionTimeout: 30,
  ipWhitelist: [],
  apiKey: 'sk_test_123456789',
};

/**
 * SecuritySettings component for managing security settings
 */
const SecuritySettings = () => {
  const [settings, setSettings] = useState<SecuritySettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [newIp, setNewIp] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save security settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast.success('Security settings saved successfully');
    } catch (error) {
      toast.error('Failed to save security settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddIp = () => {
    if (newIp && !settings.ipWhitelist.includes(newIp)) {
      setSettings({
        ...settings,
        ipWhitelist: [...settings.ipWhitelist, newIp],
      });
      setNewIp('');
    }
  };

  const handleRemoveIp = (ip: string) => {
    setSettings({
      ...settings,
      ipWhitelist: settings.ipWhitelist.filter((i) => i !== ip),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              min="5"
              max="120"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>IP Whitelist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter IP address"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
            />
            <Button onClick={handleAddIp}>Add IP</Button>
          </div>
          {settings.ipWhitelist.length > 0 ? (
            <div className="space-y-2">
              {settings.ipWhitelist.map((ip) => (
                <div key={ip} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span>{ip}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveIp(ip)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No IP addresses whitelisted</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex space-x-2">
              <Input
                type="password"
                value={settings.apiKey}
                readOnly
              />
              <Button variant="outline">Regenerate</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Keep your API key secure and never share it publicly
            </p>
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

export default SecuritySettings; 