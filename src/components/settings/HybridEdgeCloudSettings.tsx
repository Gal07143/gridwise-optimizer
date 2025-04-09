
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Info, Cloud, Server, Zap, Clock, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const HybridEdgeCloudSettings = () => {
  // Edge autonomy settings
  const [edgeAutonomyEnabled, setEdgeAutonomyEnabled] = useState(true);
  const [edgeAutonomyLevel, setEdgeAutonomyLevel] = useState(70);
  const [fallbackMode, setFallbackMode] = useState('safe');
  
  // Cloud sync settings
  const [dataSyncInterval, setDataSyncInterval] = useState('5');
  const [highResTelemetry, setHighResTelemetry] = useState(false);
  const [offlineBufferDuration, setOfflineBufferDuration] = useState(24);
  
  // Security settings
  const [encryptionLevel, setEncryptionLevel] = useState('aes256');
  const [certificateExpiry, setCertificateExpiry] = useState('2025-12-31');
  
  const handleSaveSettings = () => {
    // In a real implementation, this would save the settings to the backend
    toast.success("Edge-cloud configuration updated successfully");
  };
  
  return (
    <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-500" />
              <span>Hybrid Edge-Cloud Architecture</span>
            </CardTitle>
            <CardDescription>
              Configure edge device autonomy and cloud synchronization settings
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-700/20 text-blue-300 border-blue-500/50 py-1">
            GridX-Inspired
          </Badge>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="edge" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4 bg-slate-700/30">
          <TabsTrigger value="edge" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Edge Autonomy
          </TabsTrigger>
          <TabsTrigger value="sync" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Cloud Sync
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>
        
        <CardContent>
          <TabsContent value="edge" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="edge-autonomy" className="text-base font-medium">Edge Device Autonomy</Label>
                <p className="text-sm text-slate-400">
                  Enable autonomous operation when cloud connection is lost
                </p>
              </div>
              <Switch
                id="edge-autonomy"
                checked={edgeAutonomyEnabled}
                onCheckedChange={setEdgeAutonomyEnabled}
              />
            </div>
            
            {edgeAutonomyEnabled && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="autonomy-level" className="text-sm">Autonomy Level</Label>
                    <span className="text-sm font-medium">{edgeAutonomyLevel}%</span>
                  </div>
                  <Slider
                    id="autonomy-level"
                    value={[edgeAutonomyLevel]}
                    onValueChange={values => setEdgeAutonomyLevel(values[0])}
                    max={100}
                    step={5}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Limited</span>
                    <span>Balanced</span>
                    <span>Full</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="fallback-mode" className="text-sm">Fallback Mode</Label>
                  <Select value={fallbackMode} onValueChange={setFallbackMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fallback mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safe">Safe Mode (Conservative)</SelectItem>
                      <SelectItem value="last">Use Last Instructions</SelectItem>
                      <SelectItem value="schedule">Follow Local Schedule</SelectItem>
                      <SelectItem value="adaptive">Adaptive Behavior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div className="bg-blue-900/20 border border-blue-500/20 rounded-md p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <span className="font-medium text-blue-300">Edge autonomy</span> ensures your energy system 
                continues to operate even during internet outages. Higher autonomy levels allow more independent 
                decision-making but require more edge computing resources.
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sync" className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="sync-interval" className="text-sm">Data Synchronization Interval</Label>
              <Select value={dataSyncInterval} onValueChange={setDataSyncInterval}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every 1 minute</SelectItem>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-res-telemetry" className="text-base font-medium">High-resolution Telemetry</Label>
                <p className="text-sm text-slate-400">
                  Upload detailed 1-second interval data (uses more bandwidth)
                </p>
              </div>
              <Switch
                id="high-res-telemetry"
                checked={highResTelemetry}
                onCheckedChange={setHighResTelemetry}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="offline-buffer" className="text-sm">Offline Buffer Duration</Label>
                <span className="text-sm font-medium">{offlineBufferDuration} hours</span>
              </div>
              <Slider
                id="offline-buffer"
                value={[offlineBufferDuration]}
                onValueChange={values => setOfflineBufferDuration(values[0])}
                min={1}
                max={72}
                step={1}
              />
              <p className="text-xs text-slate-400 mt-1">
                Your edge device will store up to {offlineBufferDuration} hours of data when offline.
              </p>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/20 rounded-md p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <span className="font-medium text-blue-300">Cloud synchronization</span> settings determine how 
                frequently your edge device sends data to the cloud and how much data is cached locally during 
                connection issues. Faster sync intervals provide more up-to-date data but use more bandwidth.
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="encryption-level" className="text-sm">Data Encryption Level</Label>
              <Select value={encryptionLevel} onValueChange={setEncryptionLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select encryption level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aes128">AES-128 (Standard)</SelectItem>
                  <SelectItem value="aes256">AES-256 (Enhanced)</SelectItem>
                  <SelectItem value="tls13">TLS 1.3 with Perfect Forward Secrecy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 bg-slate-700/30 rounded-md space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                Security Certificate Status
              </h4>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-slate-400">Certificate Authority</div>
                <div>GridX Secure CA</div>
                
                <div className="text-slate-400">Issued To</div>
                <div>edge-device-001</div>
                
                <div className="text-slate-400">Expires On</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span>{certificateExpiry}</span>
                    <Badge variant="outline" className="bg-green-700/20 text-green-300 border-green-500/50 text-xs">
                      Valid
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toast.success("Certificate will be renewed automatically before expiry")}
              className="text-xs flex items-center gap-2"
            >
              <RefreshCw className="h-3 w-3" />
              Update Certificate
            </Button>
            
            <div className="bg-blue-900/20 border border-blue-500/20 rounded-md p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <span className="font-medium text-blue-300">Security settings</span> ensure your data is 
                encrypted both at rest and in transit. We use industry-standard TLS certificates to authenticate 
                devices and encrypt all communications between edge devices and the cloud.
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="border-t border-slate-700/50 pt-4 flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            setEdgeAutonomyEnabled(true);
            setEdgeAutonomyLevel(70);
            setFallbackMode('safe');
            setDataSyncInterval('5');
            setHighResTelemetry(false);
            setOfflineBufferDuration(24);
            setEncryptionLevel('aes256');
            toast.info("Settings reset to defaults");
          }}
        >
          Reset to Defaults
        </Button>
        
        <Button 
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Save Configuration
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HybridEdgeCloudSettings;
