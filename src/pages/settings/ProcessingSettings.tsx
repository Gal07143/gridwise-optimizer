
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
import { Cpu, Sliders, BarChart4, LineChart, Cog } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProcessingSettingsPage = () => {
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
              <h3 className="text-lg font-medium mb-4">Processing Queue</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="queueEnabled">Processing Queue</Label>
                    <p className="text-sm text-muted-foreground">Enable background processing queue</p>
                  </div>
                  <Switch id="queueEnabled" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="queuePriority">Queue Priority Strategy</Label>
                  <Select defaultValue="fifo">
                    <SelectTrigger id="queuePriority">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fifo">First In, First Out</SelectItem>
                      <SelectItem value="priority">Priority Based</SelectItem>
                      <SelectItem value="deadline">Deadline Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maxQueueSize">Maximum Queue Size</Label>
                    <span className="text-muted-foreground">1000 items</span>
                  </div>
                  <Slider defaultValue={[1000]} min={100} max={10000} step={100} id="maxQueueSize" />
                  <p className="text-xs text-muted-foreground">Maximum number of items in the processing queue</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Processing settings saved')}>
                Save Changes
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="aggregation" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Data Aggregation Settings</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle>Time-Based Aggregation</CardTitle>
                  <CardDescription>Configure data aggregation intervals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="minuteAggregation">Minute Aggregation</Label>
                        <p className="text-sm text-muted-foreground">Aggregate data by minute</p>
                      </div>
                      <Switch id="minuteAggregation" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="hourlyAggregation">Hourly Aggregation</Label>
                        <p className="text-sm text-muted-foreground">Aggregate data by hour</p>
                      </div>
                      <Switch id="hourlyAggregation" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dailyAggregation">Daily Aggregation</Label>
                        <p className="text-sm text-muted-foreground">Aggregate data by day</p>
                      </div>
                      <Switch id="dailyAggregation" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="monthlyAggregation">Monthly Aggregation</Label>
                        <p className="text-sm text-muted-foreground">Aggregate data by month</p>
                      </div>
                      <Switch id="monthlyAggregation" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customInterval">Custom Aggregation Interval (minutes)</Label>
                      <Input id="customInterval" type="number" defaultValue="15" min="1" />
                      <p className="text-xs text-muted-foreground">Create custom aggregation intervals in minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Aggregation Methods</CardTitle>
                  <CardDescription>Configure data aggregation calculation methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="numericMethod">Numeric Values</Label>
                        <Select defaultValue="avg">
                          <SelectTrigger id="numericMethod">
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="statusMethod">Status Values</Label>
                        <Select defaultValue="latest">
                          <SelectTrigger id="statusMethod">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="latest">Latest Value</SelectItem>
                            <SelectItem value="most_common">Most Common</SelectItem>
                            <SelectItem value="worst">Worst Status</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="interpolation">Interpolation</Label>
                        <p className="text-sm text-muted-foreground">Interpolate missing values</p>
                      </div>
                      <Switch id="interpolation" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="outlierRemoval">Outlier Removal</Label>
                        <p className="text-sm text-muted-foreground">Filter out statistical outliers</p>
                      </div>
                      <Switch id="outlierRemoval" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Aggregation settings saved')}>
                Save Changes
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="optimization" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Performance Optimization</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle>Query Optimization</CardTitle>
                  <CardDescription>Configure database query performance settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="queryCache">Query Cache</Label>
                        <p className="text-sm text-muted-foreground">Cache frequently used queries</p>
                      </div>
                      <Switch id="queryCache" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="queryCacheSize">Query Cache Size (MB)</Label>
                        <span className="text-muted-foreground">256 MB</span>
                      </div>
                      <Slider defaultValue={[256]} min={64} max={1024} step={64} id="queryCacheSize" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="preparedStatements">Prepared Statements</Label>
                        <p className="text-sm text-muted-foreground">Use prepared statements for performance</p>
                      </div>
                      <Switch id="preparedStatements" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="indexingStrategy">Indexing Strategy</Label>
                      <Select defaultValue="auto">
                        <SelectTrigger id="indexingStrategy">
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Automatic</SelectItem>
                          <SelectItem value="minimal">Minimal (Faster Writes)</SelectItem>
                          <SelectItem value="aggressive">Aggressive (Faster Reads)</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Data Storage Optimization</CardTitle>
                  <CardDescription>Optimize data storage for performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="compressionEnabled">Data Compression</Label>
                        <p className="text-sm text-muted-foreground">Compress stored data to save space</p>
                      </div>
                      <Switch id="compressionEnabled" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="compressionLevel">Compression Level</Label>
                      <Select defaultValue="balanced">
                        <SelectTrigger id="compressionLevel">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (Faster)</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="high">High (Smaller)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="partitioning">Data Partitioning</Label>
                        <p className="text-sm text-muted-foreground">Partition data for faster queries</p>
                      </div>
                      <Switch id="partitioning" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="partitioningStrategy">Partitioning Strategy</Label>
                      <Select defaultValue="time">
                        <SelectTrigger id="partitioningStrategy">
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="time">Time-based</SelectItem>
                          <SelectItem value="device">Device-based</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Optimization settings saved')}>
                Save Changes
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Advanced Processing Settings</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle>Algorithm Configuration</CardTitle>
                  <CardDescription>Customize data processing algorithms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="filterAlgorithm">Filtering Algorithm</Label>
                      <Select defaultValue="kalman">
                        <SelectTrigger id="filterAlgorithm">
                          <SelectValue placeholder="Select algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kalman">Kalman Filter</SelectItem>
                          <SelectItem value="moving_avg">Moving Average</SelectItem>
                          <SelectItem value="exponential">Exponential Smoothing</SelectItem>
                          <SelectItem value="none">No Filtering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="predictionModel">Prediction Model</Label>
                      <Select defaultValue="arima">
                        <SelectTrigger id="predictionModel">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="arima">ARIMA</SelectItem>
                          <SelectItem value="lstm">LSTM Neural Network</SelectItem>
                          <SelectItem value="prophet">Prophet</SelectItem>
                          <SelectItem value="none">No Prediction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="adaptiveProcessing">Adaptive Processing</Label>
                        <p className="text-sm text-muted-foreground">Automatically adjust processing based on data patterns</p>
                      </div>
                      <Switch id="adaptiveProcessing" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="debugLogging">Debug Logging</Label>
                        <p className="text-sm text-muted-foreground">Enable detailed processing logs</p>
                      </div>
                      <Switch id="debugLogging" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>External Processing</CardTitle>
                  <CardDescription>Configure external data processing services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="externalEnabled">External Processing</Label>
                        <p className="text-sm text-muted-foreground">Use external service for heavy processing</p>
                      </div>
                      <Switch id="externalEnabled" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="externalEndpoint">Service Endpoint</Label>
                      <Input id="externalEndpoint" placeholder="https://processing.example.com/api" disabled />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input id="apiKey" type="password" placeholder="Your API key" disabled />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="failover">Local Failover</Label>
                        <p className="text-sm text-muted-foreground">Fall back to local processing if service unavailable</p>
                      </div>
                      <Switch id="failover" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => toast.info('Reset to default settings')}
              >
                Reset to Default
              </Button>
              <Button onClick={() => toast.success('Advanced settings saved')}>
                Save Changes
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsPageTemplate>
  );
};

export default ProcessingSettingsPage;
