
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { AlertTriangle, Check, Info, MessageSquare, Server, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MQTTIntegration = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [mqttStatus, setMqttStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [testResult, setTestResult] = useState<null | { success: boolean; message: string }>(null);
  
  const navigate = useNavigate();

  const handleConnect = () => {
    toast.success("MQTT connection request sent");
    
    // Simulate connection process
    setTimeout(() => {
      setMqttStatus('connected');
      toast.success("Successfully connected to MQTT broker");
    }, 2000);
  };
  
  const handleDisconnect = () => {
    toast.info("Disconnecting from MQTT broker");
    
    // Simulate disconnection
    setTimeout(() => {
      setMqttStatus('disconnected');
      toast.success("Successfully disconnected from MQTT broker");
    }, 1000);
  };
  
  const handleTest = () => {
    toast.info("Testing MQTT connection...");
    
    // Simulate test
    setTimeout(() => {
      setTestResult({
        success: true,
        message: "Successfully connected to broker and published test message"
      });
      toast.success("Connection test successful");
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="p-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">MQTT Integration</h1>
            <p className="text-muted-foreground">Configure MQTT for real-time telemetry and device control</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm mr-2">
              Status: 
              {mqttStatus === 'connected' && (
                <span className="ml-2 text-green-600 font-medium flex items-center">
                  <Check className="h-4 w-4 mr-1" /> Connected
                </span>
              )}
              {mqttStatus === 'disconnected' && (
                <span className="ml-2 text-muted-foreground font-medium">
                  Disconnected
                </span>
              )}
              {mqttStatus === 'error' && (
                <span className="ml-2 text-red-600 font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" /> Error
                </span>
              )}
            </div>
            
            {mqttStatus === 'connected' ? (
              <Button variant="outline" onClick={handleDisconnect}>
                Disconnect
              </Button>
            ) : (
              <Button onClick={handleConnect}>
                Connect
              </Button>
            )}
          </div>
        </div>
        
        {testResult && (
          <Alert className={testResult.success ? "bg-green-50 border-green-200 mb-6" : "bg-red-50 border-red-200 mb-6"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Test Result</AlertTitle>
            <AlertDescription>
              {testResult.message}
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="config">
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="topics">
              <MessageSquare className="h-4 w-4 mr-2" />
              Topics
            </TabsTrigger>
            <TabsTrigger value="broker">
              <Server className="h-4 w-4 mr-2" />
              Broker Setup
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>MQTT Connection Configuration</CardTitle>
                <CardDescription>
                  Configure your MQTT broker connection settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="broker-url">Broker URL</Label>
                    <Input id="broker-url" placeholder="mqtt://example.com" defaultValue="mqtt://broker.hivemq.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="broker-port">Port</Label>
                    <Input id="broker-port" placeholder="1883" defaultValue="1883" type="number" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="client-id">Client ID</Label>
                    <Input id="client-id" placeholder="my-energy-system" defaultValue={`grid-ems-${Math.floor(Math.random() * 10000)}`} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keepalive">Keepalive (seconds)</Label>
                    <Input id="keepalive" placeholder="60" defaultValue="60" type="number" />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Label className="text-base font-medium">Authentication</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" placeholder="Enter username" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Enter password" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Switch id="use-ssl" />
                  <Label htmlFor="use-ssl">Use SSL/TLS</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleTest}>Test Connection</Button>
                <Button onClick={handleConnect}>Save & Connect</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="topics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Topic Configuration</CardTitle>
                <CardDescription>
                  Configure MQTT topics for publishing and subscribing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Data Topics</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="publish-topic">Publish Topic</Label>
                        <Input id="publish-topic" placeholder="grid/telemetry" defaultValue="grid/telemetry" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subscribe-topic">Subscribe Topic</Label>
                        <Input id="subscribe-topic" placeholder="grid/commands" defaultValue="grid/commands" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Label className="text-base font-medium">Device Configuration</Label>
                    <div className="grid grid-cols-1 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="topic-format">Device Topic Format</Label>
                        <Input 
                          id="topic-format" 
                          placeholder="grid/device/{device_id}/data" 
                          defaultValue="grid/device/{device_id}/data" 
                        />
                        <p className="text-xs text-muted-foreground">
                          Use {'{device_id}'} as a placeholder for the device ID
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="qos">Quality of Service (QoS)</Label>
                      <Select defaultValue="1">
                        <SelectTrigger id="qos">
                          <SelectValue placeholder="Select QoS level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - At most once</SelectItem>
                          <SelectItem value="1">1 - At least once</SelectItem>
                          <SelectItem value="2">2 - Exactly once</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">Save Topic Configuration</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="broker" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configure Your Own MQTT Broker</CardTitle>
                <CardDescription>
                  Set up your own MQTT broker for this energy management system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Get Started with MQTT</AlertTitle>
                  <AlertDescription>
                    If you don't have your own MQTT broker, we recommend using one of the following:
                    <ul className="list-disc ml-6 mt-2">
                      <li>Mosquitto - Lightweight open source MQTT broker</li>
                      <li>HiveMQ - Scalable MQTT broker with free tier</li>
                      <li>CloudMQTT - Hosted MQTT brokers</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <div className="pt-4">
                  <h3 className="text-base font-medium mb-2">Broker Configuration Steps:</h3>
                  <ol className="list-decimal ml-6 space-y-2">
                    <li>Install and configure your MQTT broker</li>
                    <li>Set up authentication (recommended)</li>
                    <li>Configure SSL/TLS for secure connections (recommended)</li>
                    <li>Make sure the broker is accessible from your network</li>
                    <li>Use the Configuration tab to connect to your broker</li>
                  </ol>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('https://mosquitto.org/download/', '_blank')}
                >
                  Download Mosquitto MQTT Broker
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default MQTTIntegration;
