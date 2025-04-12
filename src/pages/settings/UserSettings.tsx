import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';

interface UserPreferences {
  email: string;
  name: string;
  notifications: boolean;
  darkMode: boolean;
  language: string;
}

const defaultPreferences: UserPreferences = {
  email: 'user@example.com',
  name: 'John Doe',
  notifications: true,
  darkMode: false,
  language: 'en',
};

/**
 * UserSettings component for managing user preferences
 */
const UserSettings = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save preferences
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast.success('Preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={preferences.name}
              onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={preferences.email}
              onChange={(e) => setPreferences({ ...preferences, email: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about device updates and alerts
              </p>
            </div>
            <Switch
              checked={preferences.notifications}
              onCheckedChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use dark theme for the application
              </p>
            </div>
            <Switch
              checked={preferences.darkMode}
              onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              className="w-full p-2 border rounded-md"
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
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

export default UserSettings; 