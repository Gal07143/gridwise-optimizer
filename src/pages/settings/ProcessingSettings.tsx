
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Cpu, Sliders, BarChart4, LineChart, Cog, Code } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProcessingSettings = () => {
  return (
    <SettingsPageTemplate 
      title="Processing Settings" 
      description="Configure data processing and analytics options"
      headerIcon={<Cpu size={24} />}
    >
      <div className="space-y-8">
        <Tabs defaultValue="processing">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="aggregation">Data Aggregation</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="processing" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Processing Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="parallelProcessing">Parallel Processing</Label>
                    <p className="text-sm text-muted-foreground">Enable multi-threaded data processing</p>
                  </div>
                  <Switch id="parallelProcessing" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maxThreads">Maximum Processing Threads</Label>
                    <span className="text-muted-foreground">8</span>
                  </div>
                  <Slider defaultValue={[8]} min={1} max={16} step={1} id="maxThreads" />
                  <p className="text-xs text-muted-foreground">Adjust the number of processing threads (1-16)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="processingPriority">Processing Priority</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger id="processingPriority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="realtime">Real-time</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Higher priority may impact system performance</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dataValidation">Data Validation</Label>
                    <p className="text-sm text-muted-foreground">Validate data integrity before processing</p>
                  </div>
                  <Switch id="dataValidation" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dataNormalization">Data Normalization</Label>
                    <p className="text-sm text-muted-foreground">Normalize data values to a standard range</p>
                  </div>
                  <Switch id="dataNormalization" defaultChecked />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Error Handling</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoRetry">Automatic Retry</Label>
                    <p className="text-sm text-muted-foreground">Automatically retry failed processing tasks</p>
                  </div>
                  <Switch id="autoRetry" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxRetries">Maximum Retries</Label>
                  <Select defaultValue="3">
                    <SelectTrigger id="maxRetries">
                      <SelectValue placeholder="Select max retries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 retry</SelectItem>
                      <SelectItem value="3">3 retries</SelectItem>
                      <SelectItem value="5">5 retries</SelectItem>
                      <SelectItem value="10">10 retries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="errorNotification">Error Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications for processing errors</p>
                  </div>
                  <Switch id="errorNotification" defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="aggregation" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Data Aggregation</h3>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5" />
                    <span>Energy Data Aggregation</span>
                  </CardTitle>
                  <CardDescription>
                    Configure how energy data is aggregated for reports and visualization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultAggregation">Default Aggregation</Label>
                      <Select defaultValue="hourly">
                        <SelectTrigger id="defaultAggregation">
                          <SelectValue placeholder="Select aggregation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minute">Per Minute</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="aggregateOnIngestion">Aggregate on Ingestion</Label>
                        <p className="text-sm text-muted-foreground">Pre-aggregate data when it's first received</p>
                      </div>
                      <Switch id="aggregateOnIngestion" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aggregationMethod">Aggregation Method</Label>
                      <Select defaultValue="avg">
                        <SelectTrigger id="aggregationMethod">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="avg">Average</SelectItem>
                          <SelectItem value="sum">Sum</SelectItem>
                          <SelectItem value="min">Minimum</SelectItem>
                          <SelectItem value="max">Maximum</SelectItem>
                          <SelectItem value="median">Median</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    <span>Metrics Aggregation</span>
                  </CardTitle>
                  <CardDescription>
                    Configure how device metrics are aggregated
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="metricsAggregation">Default Metrics Aggregation</Label>
                      <Select defaultValue="5min">
                        <SelectTrigger id="metricsAggregation">
                          <SelectValue placeholder="Select aggregation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="raw">No Aggregation (Raw)</SelectItem>
                          <SelectItem value="1min">1 Minute</SelectItem>
                          <SelectItem value="5min">5 Minutes</SelectItem>
                          <SelectItem value="15min">15 Minutes</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="outlierDetection">Outlier Detection</Label>
                        <p className="text-sm text-muted-foreground">Detect and handle outlier values</p>
                      </div>
                      <Switch id="outlierDetection" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="missingDataInterpolation">Missing Data Interpolation</Label>
                        <p className="text-sm text-muted-foreground">Fill in missing data points using interpolation</p>
                      </div>
                      <Switch id="missingDataInterpolation" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="optimization" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Optimization Settings</h3>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sliders className="h-5 w-5" />
                    <span>Performance Optimization</span>
                  </CardTitle>
                  <CardDescription>
                    Configure system performance optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="cacheResults">Cache Processing Results</Label>
                        <p className="text-sm text-muted-foreground">Cache results to improve query performance</p>
                      </div>
                      <Switch id="cacheResults" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="cacheSize">Cache Size (MB)</Label>
                        <span className="text-muted-foreground">512</span>
                      </div>
                      <Slider defaultValue={[512]} min={128} max={2048} step={128} id="cacheSize" />
                      <p className="text-xs text-muted-foreground">Adjust cache size (128-2048 MB)</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cacheExpiry">Cache Expiry</Label>
                      <Select defaultValue="1h">
                        <SelectTrigger id="cacheExpiry">
                          <SelectValue placeholder="Select expiry time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15m">15 minutes</SelectItem>
                          <SelectItem value="30m">30 minutes</SelectItem>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="6h">6 hours</SelectItem>
                          <SelectItem value="24h">24 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="queryOptimization">Query Optimization</Label>
                        <p className="text-sm text-muted-foreground">Automatically optimize database queries</p>
                      </div>
                      <Switch id="queryOptimization" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cog className="h-5 w-5" />
                    <span>Resource Management</span>
                  </CardTitle>
                  <CardDescription>
                    Configure system resource allocation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="cpuLimit">CPU Limit (%)</Label>
                        <span className="text-muted-foreground">75%</span>
                      </div>
                      <Slider defaultValue={[75]} min={25} max={100} step={5} id="cpuLimit" />
                      <p className="text-xs text-muted-foreground">Limit CPU usage for processing tasks</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="memoryLimit">Memory Limit (%)</Label>
                        <span className="text-muted-foreground">50%</span>
                      </div>
                      <Slider defaultValue={[50]} min={25} max={90} step={5} id="memoryLimit" />
                      <p className="text-xs text-muted-foreground">Limit memory usage for processing tasks</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="lowPriorityBackground">Low Priority Background</Label>
                        <p className="text-sm text-muted-foreground">Run background tasks at lower priority</p>
                      </div>
                      <Switch id="lowPriorityBackground" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="throttleOnLoad">Throttle on High Load</Label>
                        <p className="text-sm text-muted-foreground">Automatically throttle processing on high system load</p>
                      </div>
                      <Switch id="throttleOnLoad" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    <span>Custom Processing Rules</span>
                  </CardTitle>
                  <CardDescription>
                    Define custom processing logic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="customRules">Enable Custom Rules</Label>
                        <p className="text-sm text-muted-foreground">Apply custom processing rules to data</p>
                      </div>
                      <Switch id="customRules" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rulesConfig">Rules Configuration</Label>
                      <div className="border rounded-md">
                        <Input
                          id="rulesConfig"
                          className="font-mono text-xs"
                          disabled
                          defaultValue="{&quot;rules&quot;: [{&quot;id&quot;: &quot;rule1&quot;, &quot;condition&quot;: &quot;value > threshold&quot;, &quot;action&quot;: &quot;notify&quot;}]}"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">JSON configuration for processing rules</p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast.info('Rules editor will open')}
                    >
                      Open Rules Editor
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Debug Mode</CardTitle>
                  <CardDescription>
                    Enable additional debugging information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="debugMode">Debug Logging</Label>
                        <p className="text-sm text-muted-foreground">Enable verbose debug logging</p>
                      </div>
                      <Switch id="debugMode" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="performanceTracking">Performance Tracking</Label>
                        <p className="text-sm text-muted-foreground">Track detailed processing performance metrics</p>
                      </div>
                      <Switch id="performanceTracking" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logLevel">Log Level</Label>
                      <Select defaultValue="info">
                        <SelectTrigger id="logLevel">
                          <SelectValue placeholder="Select log level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="error">Error</SelectItem>
                          <SelectItem value="warn">Warning</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="trace">Trace</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => toast.success('Debug logs cleared')}
                  >
                    Clear Debug Logs
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Maintenance</CardTitle>
                  <CardDescription>
                    System maintenance operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => toast.success('Temporary files cleared')}
                    >
                      Clear Temporary Files
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => toast.success('Processing queue cleared')}
                    >
                      Reset Processing Queue
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => toast.success('Cache cleared')}
                    >
                      Clear Processing Cache
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Reset to Default</Button>
          <Button onClick={() => toast.success('Processing settings saved')}>Save Changes</Button>
        </div>
      </div>
    </SettingsPageTemplate>
  );
};

export default ProcessingSettings;
