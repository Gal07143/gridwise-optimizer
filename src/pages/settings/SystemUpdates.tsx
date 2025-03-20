
import React, { useState } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Download, RefreshCw, AlertTriangle, CheckCircle2, Box, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SystemUpdates = () => {
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [installingUpdate, setInstallingUpdate] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleCheckUpdates = () => {
    setCheckingUpdates(true);
    toast.info("Checking for system updates...");
    
    // Simulate API call
    setTimeout(() => {
      setCheckingUpdates(false);
      toast.success("System is up to date");
    }, 2000);
  };
  
  const handleInstallUpdate = () => {
    setInstallingUpdate(true);
    setProgress(0);
    toast.info("Installing system update...");
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setInstallingUpdate(false);
            toast.success("System update installed successfully");
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };
  
  return (
    <SettingsPageTemplate 
      title="System Updates" 
      description="Check for and install system updates"
      headerIcon={<RefreshCw size={20} />}
      actions={
        <Button 
          onClick={handleCheckUpdates} 
          disabled={checkingUpdates || installingUpdate}
          className="gap-2"
        >
          {checkingUpdates ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Check for Updates
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="bg-primary/5 p-4 rounded-lg">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Box size={18} />
            <span>System Status</span>
          </h3>
          <p className="text-sm text-muted-foreground">Current system version and update status</p>
        </div>
        
        <Card className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium">GridWise Energy Management System</h3>
              <p className="text-sm text-muted-foreground">Version 4.2.1</p>
            </div>
            <Badge variant="outline" className="font-normal">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
              Up to Date
            </Badge>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Last checked:</span>
                <span className="text-muted-foreground">Today at 09:45 AM</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Last update:</span>
                <span className="text-muted-foreground">May 15, 2023</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Update channel:</span>
                <span className="text-muted-foreground">Stable</span>
              </div>
            </div>
            
            {installingUpdate && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Installing update...</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </Card>
        
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>Scheduled Maintenance</AlertTitle>
          <AlertDescription>
            Automatic system updates are scheduled for every Sunday at 2:00 AM.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Updates</h3>
          
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-medium">Security Update</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Critical security patches for system components
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Badge className="bg-amber-500 hover:bg-amber-600">Security</Badge>
                  <Badge variant="outline">2.5 MB</Badge>
                </div>
              </div>
              <Button 
                size="sm" 
                className="gap-2"
                onClick={handleInstallUpdate}
                disabled={installingUpdate}
              >
                <Download size={14} />
                Install
              </Button>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <h4 className="text-base font-medium">GridWise EMS v4.3.0</h4>
                  <Badge className="ml-2" variant="outline">Coming Soon</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  New features and performance improvements
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Badge>Feature</Badge>
                  <Badge variant="outline">156 MB</Badge>
                </div>
              </div>
              <Button 
                size="sm" 
                className="gap-2"
                disabled
              >
                <Clock size={14} />
                Pre-register
              </Button>
            </div>
          </Card>
        </div>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Notice</AlertTitle>
          <AlertDescription>
            Always ensure your system has a backup before installing major updates.
          </AlertDescription>
        </Alert>
      </div>
    </SettingsPageTemplate>
  );
};

export default SystemUpdates;
