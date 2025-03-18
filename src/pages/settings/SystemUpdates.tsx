
import React, { useState } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { RefreshCw, Download, ArrowUpCircle, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const SystemUpdates = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [autoUpdates, setAutoUpdates] = useState(true);

  const handleCheckForUpdates = () => {
    setIsChecking(true);
    toast.info("Checking for updates...");
    
    // Simulate checking for updates
    setTimeout(() => {
      setIsChecking(false);
      toast.success("System is up to date!");
    }, 2000);
  };

  const handleInstallUpdate = () => {
    setIsInstalling(true);
    setProgress(0);
    toast.info("Installing system update...");
    
    // Simulate installation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsInstalling(false);
          toast.success("Update installed successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const toggleAutoUpdates = () => {
    setAutoUpdates(!autoUpdates);
    toast.success(`Automatic updates ${!autoUpdates ? 'enabled' : 'disabled'}`);
  };

  return (
    <SettingsPageTemplate 
      title="System Updates" 
      description="Manage system updates and version control"
      headerIcon={<RefreshCw size={20} />}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
          <div>
            <h3 className="text-lg font-medium">Current System Version</h3>
            <p className="text-sm text-muted-foreground">EMS v4.2.1 (Released: June 15, 2023)</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleCheckForUpdates}
            disabled={isChecking}
            className="gap-2"
          >
            <RefreshCw size={16} className={isChecking ? "animate-spin" : ""} />
            {isChecking ? "Checking..." : "Check for Updates"}
          </Button>
        </div>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <ArrowUpCircle size={18} className="text-green-500" />
                <span>Update Available: EMS v4.3.0</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Released: July 28, 2023</p>
            </div>
            <Button 
              onClick={handleInstallUpdate}
              disabled={isInstalling}
              className="gap-2"
            >
              <Download size={16} />
              {isInstalling ? "Installing..." : "Install Update"}
            </Button>
          </div>
          
          {isInstalling && (
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1 text-right">{progress}% complete</p>
            </div>
          )}
          
          <div className="mt-4">
            <h4 className="text-sm font-medium">Release Notes:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>Improved battery optimization algorithms</li>
              <li>Fixed issue with solar panel drift calculations</li>
              <li>Enhanced security for API authentication</li>
              <li>Added support for new inverter models</li>
              <li>Performance improvements for data processing</li>
            </ul>
          </div>
        </Card>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Update Settings</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium">Automatic Updates</h4>
              <p className="text-sm text-muted-foreground">Allow the system to install updates automatically during off-peak hours</p>
            </div>
            <Switch checked={autoUpdates} onCheckedChange={toggleAutoUpdates} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium">Schedule Updates</h4>
              <p className="text-sm text-muted-foreground">Set a schedule for automatic update installation</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Clock size={14} />
              Configure
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-medium">Critical Updates Only</h4>
              <p className="text-sm text-muted-foreground">Only install security and critical fixes automatically</p>
            </div>
            <Switch />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Update History</h3>
          
          <div className="space-y-3">
            <div className="flex items-start justify-between p-3 bg-muted/30 rounded-md">
              <div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-green-500" />
                  <span className="font-medium">EMS v4.2.1 (Security Patch)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Installed on: June 15, 2023</p>
              </div>
              <Button variant="ghost" size="sm">View Details</Button>
            </div>
            
            <div className="flex items-start justify-between p-3 bg-muted/30 rounded-md">
              <div>
                <div className="flex items-center gap-2">
                  <ArrowUpCircle size={16} className="text-blue-500" />
                  <span className="font-medium">EMS v4.2.0 (Feature Update)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Installed on: May 30, 2023</p>
              </div>
              <Button variant="ghost" size="sm">View Details</Button>
            </div>
            
            <div className="flex items-start justify-between p-3 bg-muted/30 rounded-md">
              <div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-green-500" />
                  <span className="font-medium">EMS v4.1.3 (Security Patch)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Installed on: April 12, 2023</p>
              </div>
              <Button variant="ghost" size="sm">View Details</Button>
            </div>
          </div>
        </div>
      </div>
    </SettingsPageTemplate>
  );
};

export default SystemUpdates;
