
import React, { useState } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Database, HardDrive, Save, Cloud, ArchiveRestore, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const StorageConfiguration = () => {
  const [localStorageEnabled, setLocalStorageEnabled] = useState(true);
  const [cloudStorageEnabled, setCloudStorageEnabled] = useState(true);
  const [compressionEnabled, setCompressionEnabled] = useState(true);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  
  const handleSaveSettings = () => {
    toast.success("Storage settings saved successfully");
  };
  
  const handlePurgeData = () => {
    toast.success("Data purge scheduled");
  };

  return (
    <SettingsPageTemplate 
      title="Storage Configuration" 
      description="Configure data storage settings and retention policies"
      headerIcon={<Database size={20} />}
      actions={
        <Button onClick={handleSaveSettings} className="gap-2">
          <Save size={16} />
          Save Settings
        </Button>
      }
    >
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general" className="gap-2">
            <HardDrive size={14} />
            General
          </TabsTrigger>
          <TabsTrigger value="retention" className="gap-2">
            <Cloud size={14} />
            Retention
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-2">
            <ArchiveRestore size={14} />
            Backup
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Database size={18} />
              <span>Storage Settings</span>
            </h3>
            <p className="text-sm text-muted-foreground">Configure where and how data is stored</p>
          </div>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Storage Location</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">Local Storage</h4>
                  <p className="text-sm text-muted-foreground">Store data on local server</p>
                </div>
                <Switch 
                  checked={localStorageEnabled} 
                  onCheckedChange={setLocalStorageEnabled} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">Cloud Storage</h4>
                  <p className="text-sm text-muted-foreground">Store data in secure cloud</p>
                </div>
                <Switch 
                  checked={cloudStorageEnabled} 
                  onCheckedChange={setCloudStorageEnabled} 
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-medium">Storage Usage</h4>
                  <span className="text-sm text-muted-foreground">234.5 GB / 500 GB</span>
                </div>
                <Progress value={47} className="h-2" />
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <div className="h-2 w-full bg-blue-500 rounded" />
                    <span className="text-muted-foreground">Time Series Data</span>
                  </div>
                  <div>
                    <div className="h-2 w-full bg-green-500 rounded" />
                    <span className="text-muted-foreground">Device Data</span>
                  </div>
                  <div>
                    <div className="h-2 w-full bg-yellow-500 rounded" />
                    <span className="text-muted-foreground">Logs</span>
                  </div>
                  <div>
                    <div className="h-2 w-full bg-purple-500 rounded" />
                    <span className="text-muted-foreground">Other</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Storage Options</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">Data Compression</h4>
                  <p className="text-sm text-muted-foreground">Compress data to save storage space</p>
                </div>
                <Switch 
                  checked={compressionEnabled} 
                  onCheckedChange={setCompressionEnabled} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">Data Encryption</h4>
                  <p className="text-sm text-muted-foreground">Encrypt stored data for security</p>
                </div>
                <Switch 
                  checked={encryptionEnabled} 
                  onCheckedChange={setEncryptionEnabled}
                />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Maintenance</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium">Data Purge</h4>
                  <p className="text-sm text-muted-foreground">Delete old or unused data</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 size={14} />
                      Purge Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Purge Data</DialogTitle>
                      <DialogDescription>
                        This action will permanently delete data according to your selection.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <RadioGroup defaultValue="older-than-1-year" className="py-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <RadioGroupItem value="older-than-1-year" id="r1" />
                        <Label htmlFor="r1">Data older than 1 year</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <RadioGroupItem value="older-than-6-months" id="r2" />
                        <Label htmlFor="r2">Data older than 6 months</Label>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <RadioGroupItem value="older-than-3-months" id="r3" />
                        <Label htmlFor="r3">Data older than 3 months</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all-archives" id="r4" />
                        <Label htmlFor="r4">All archived data</Label>
                      </div>
                    </RadioGroup>
                    
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={handlePurgeData}>Confirm Purge</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="retention">
          <div className="flex items-center justify-center h-60 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Retention policy configuration coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="backup">
          <div className="flex items-center justify-center h-60 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Backup configuration coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </SettingsPageTemplate>
  );
};

export default StorageConfiguration;
