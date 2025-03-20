
import React, { useState } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { User, Bell, Moon, Save, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const UserSettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  
  const handleSaveSettings = () => {
    toast.success("User settings saved successfully");
  };

  return (
    <SettingsPageTemplate 
      title="User Settings" 
      description="Configure your personal preferences and account settings"
      headerIcon={<User size={20} />}
      actions={
        <Button onClick={handleSaveSettings} className="gap-2">
          <Save size={16} />
          Save Settings
        </Button>
      }
    >
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="gap-2">
            <User size={14} />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Moon size={14} />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell size={14} />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield size={14} />
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">Change Avatar</Button>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" defaultValue="Energy System Manager" />
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="altEmail">Alternative Email</Label>
                <Input id="altEmail" type="email" defaultValue="" placeholder="Add alternative email" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">System Access</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-base font-medium">User Role</h4>
                  <p className="text-sm text-muted-foreground">Current role in the system</p>
                </div>
                <div className="rounded-full px-3 py-1 bg-primary/10 text-primary text-sm">
                  Administrator
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-base font-medium">Last Login</h4>
                  <p className="text-sm text-muted-foreground">Most recent system access</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Today, 09:45 AM
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Display Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">Dark Mode</h4>
                  <p className="text-sm text-muted-foreground">Use dark color scheme</p>
                </div>
                <Switch 
                  checked={isDarkMode} 
                  onCheckedChange={setIsDarkMode} 
                />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone" className="w-full">
                    <SelectValue placeholder="Select Time Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time (ET)</SelectItem>
                    <SelectItem value="cst">Central Time (CT)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Dashboard Preferences</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="defaultDashboard">Default Dashboard View</Label>
                <Select defaultValue="overview">
                  <SelectTrigger id="defaultDashboard" className="w-full">
                    <SelectValue placeholder="Select Default View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">System Overview</SelectItem>
                    <SelectItem value="energy">Energy Flow</SelectItem>
                    <SelectItem value="devices">Devices</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger id="dateFormat" className="w-full">
                    <SelectValue placeholder="Select Date Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive in-app notifications</p>
                </div>
                <Switch 
                  checked={pushNotifications} 
                  onCheckedChange={setPushNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">SMS Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive updates via text message</p>
                </div>
                <Switch 
                  checked={smsNotifications} 
                  onCheckedChange={setSmsNotifications}
                />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Notification Types</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="alerts" className="rounded" defaultChecked />
                <Label htmlFor="alerts">System Alerts</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="updates" className="rounded" defaultChecked />
                <Label htmlFor="updates">System Updates</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="reports" className="rounded" defaultChecked />
                <Label htmlFor="reports">Report Availability</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="deviceStatus" className="rounded" defaultChecked />
                <Label htmlFor="deviceStatus">Device Status Changes</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="login" className="rounded" defaultChecked />
                <Label htmlFor="login">Login Attempts</Label>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Account Security</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium">Change Password</h4>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
                <Button variant="outline" size="sm">Change Password</Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Enhance account security</p>
                </div>
                <Switch 
                  checked={twoFactorAuth} 
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium">Active Sessions</h4>
                  <p className="text-sm text-muted-foreground">Manage devices currently logged in</p>
                </div>
                <Button variant="outline" size="sm">View Sessions</Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">API Access</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium">Personal API Keys</h4>
                  <p className="text-sm text-muted-foreground">Manage your API access keys</p>
                </div>
                <Button variant="outline" size="sm">Manage Keys</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </SettingsPageTemplate>
  );
};

export default UserSettings;
