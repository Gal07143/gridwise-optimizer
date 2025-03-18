
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Sliders, Cpu, Workflow, Gauge, BarChart, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProcessingSettings = () => {
  return (
    <SettingsPageTemplate 
      title="Processing Settings" 
      description="Configure data processing and analysis parameters"
      headerIcon={<Cpu size={24} />}
    >
      <div className="space-y-8">
        <Tabs defaultValue="analysis">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Data Analysis</TabsTrigger>
            <TabsTrigger value="aggregation">Data Aggregation</TabsTrigger>
            <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Data Processing Configuration</h3>
              
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5" />
                      <span>Analytics Processing</span>
                    </CardTitle>
                    <CardDescription>Configure analytics processing settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="realtimeAnalytics">Real-time Analytics</Label>
                          <p className="text-sm text-muted-foreground">Process analytics in real-time</p>
                        </div>
                        <Switch id="realtimeAnalytics" defaultChecked />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="analysisResolution">Analysis Resolution</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger id="analysisResolution">
                            <SelectValue placeholder="Select resolution" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low (Less detail, faster)</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High (More detail, slower)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="processingPower">Processing Power</Label>
                          <span className="text-sm">High</span>
                        </div>
                        <Slider 
                          id="processingPower"
                          defaultValue={[75]} 
                          max={100} 
                          step={1}
                          className="py-2"
                        />
                        <p className="text-xs text-muted-foreground">Allocate more system resources to processing</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="anomalyDetection">Anomaly Detection</Label>
                          <p className="text-sm text-muted-foreground">Automatically detect anomalies in data</p>
                        </div>
                        <Switch id="anomalyDetection" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="h-5 w-5" />
                      <span>Processing Pipeline</span>
                    </CardTitle>
                    <CardDescription>Configure processing workflow steps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="dataCleaning">Data Cleaning</Label>
                          <p className="text-sm text-muted-foreground">Filter and clean incoming data</p>
                        </div>
                        <Switch id="dataCleaning" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="outlierRemoval">Outlier Removal</Label>
                          <p className="text-sm text-muted-foreground">Automatically remove statistical outliers</p>
                        </div>
                        <Switch id="outlierRemoval" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="interpolation">Missing Data Interpolation</Label>
                          <p className="text-sm text-muted-foreground">Fill gaps in time-series data</p>
                        </div>
                        <Switch id="interpolation" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="transformation">Data Transformation</Label>
                          <p className="text-sm text-muted-foreground">Apply transformations to raw data</p>
                        </div>
                        <Switch id="transformation" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Advanced Analytics Settings</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Models</CardTitle>
                  <CardDescription>Machine learning and prediction configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="predictiveAnalytics">Predictive Analytics</Label>
                        <p className="text-sm text-muted-foreground">Use machine learning for predictions</p>
                      </div>
                      <Switch id="predictiveAnalytics" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="modelComplexity">Model Complexity</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="modelComplexity">
                          <SelectValue placeholder="Select complexity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Simple (Fast, less accurate)</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">Complex (Slow, more accurate)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="retrainingFrequency">Model Retraining</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger id="retrainingFrequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="forecastingEnabled">Energy Forecasting</Label>
                        <p className="text-sm text-muted-foreground">Enable energy production/consumption forecasting</p>
                      </div>
                      <Switch id="forecastingEnabled" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="forecastHorizon">Forecast Horizon</Label>
                      <Select defaultValue="7d">
                        <SelectTrigger id="forecastHorizon">
                          <SelectValue placeholder="Select horizon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1d">24 hours</SelectItem>
                          <SelectItem value="3d">3 days</SelectItem>
                          <SelectItem value="7d">7 days</SelectItem>
                          <SelectItem value="30d">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="aggregation" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Time Series Aggregation</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    <span>Aggregation Settings</span>
                  </CardTitle>
                  <CardDescription>Configure how time series data is aggregated</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultInterval">Default Interval</Label>
                      <Select defaultValue="15m">
                        <SelectTrigger id="defaultInterval">
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1m">1 minute</SelectItem>
                          <SelectItem value="5m">5 minutes</SelectItem>
                          <SelectItem value="15m">15 minutes</SelectItem>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="1d">1 day</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Default time interval for data aggregation</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="retentionSchedule">Downsampling Schedule</Label>
                      <div className="border rounded-md p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="raw7days">Raw data for 7 days</Label>
                            <p className="text-xs text-muted-foreground">Keep raw data for 7 days</p>
                          </div>
                          <Switch id="raw7days" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="minute15_30days">15-minute intervals for 30 days</Label>
                            <p className="text-xs text-muted-foreground">Downsample to 15-minute intervals after 7 days</p>
                          </div>
                          <Switch id="minute15_30days" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="hourly_90days">Hourly data for 90 days</Label>
                            <p className="text-xs text-muted-foreground">Downsample to hourly intervals after 30 days</p>
                          </div>
                          <Switch id="hourly_90days" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="daily_1year">Daily data for 1 year</Label>
                            <p className="text-xs text-muted-foreground">Downsample to daily intervals after 90 days</p>
                          </div>
                          <Switch id="daily_1year" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aggregationFunction">Aggregation Function</Label>
                      <Select defaultValue="avg">
                        <SelectTrigger id="aggregationFunction">
                          <SelectValue placeholder="Select function" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="avg">Average</SelectItem>
                          <SelectItem value="sum">Sum</SelectItem>
                          <SelectItem value="min">Minimum</SelectItem>
                          <SelectItem value="max">Maximum</SelectItem>
                          <SelectItem value="first">First Value</SelectItem>
                          <SelectItem value="last">Last Value</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Method used to aggregate time series values</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Continuous Aggregation</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="continuousAggregation">Continuous Aggregation</Label>
                    <p className="text-sm text-muted-foreground">Automatically create and maintain aggregated views</p>
                  </div>
                  <Switch id="continuousAggregation" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="materializedViews">Materialized Views</Label>
                    <p className="text-sm text-muted-foreground">Use database materialized views for faster queries</p>
                  </div>
                  <Switch id="materializedViews" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refreshSchedule">Refresh Schedule</Label>
                  <Select defaultValue="hourly">
                    <SelectTrigger id="refreshSchedule">
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autocreateViews">Auto-create Views</Label>
                    <p className="text-sm text-muted-foreground">Automatically create new views for new device types</p>
                  </div>
                  <Switch id="autocreateViews" defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">System Resource Allocation</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    <span>Processor Allocation</span>
                  </CardTitle>
                  <CardDescription>Configure CPU resource allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="cpuPriority">Processing Priority</Label>
                        <span className="text-sm">High</span>
                      </div>
                      <Slider 
                        id="cpuPriority"
                        defaultValue={[80]} 
                        max={100} 
                        step={5}
                        className="py-2"
                      />
                      <p className="text-xs text-muted-foreground">Higher priority allocates more CPU resources</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxCores">Maximum CPU Cores</Label>
                      <Select defaultValue="4">
                        <SelectTrigger id="maxCores">
                          <SelectValue placeholder="Select cores" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 core</SelectItem>
                          <SelectItem value="2">2 cores</SelectItem>
                          <SelectItem value="4">4 cores</SelectItem>
                          <SelectItem value="8">8 cores</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="backgroundProcessing">Background Processing</Label>
                        <p className="text-sm text-muted-foreground">Process intensive tasks in the background</p>
                      </div>
                      <Switch id="backgroundProcessing" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    <span>Memory Allocation</span>
                  </CardTitle>
                  <CardDescription>Configure RAM resource allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="memoryLimit">Memory Limit</Label>
                        <span className="text-sm">4 GB</span>
                      </div>
                      <Slider 
                        id="memoryLimit"
                        defaultValue={[64]} 
                        max={100} 
                        step={1}
                        className="py-2"
                      />
                      <p className="text-xs text-muted-foreground">Maximum memory usage for processing tasks</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cacheSize">Cache Size</Label>
                      <Select defaultValue="1024">
                        <SelectTrigger id="cacheSize">
                          <SelectValue placeholder="Select cache size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="256">256 MB</SelectItem>
                          <SelectItem value="512">512 MB</SelectItem>
                          <SelectItem value="1024">1 GB</SelectItem>
                          <SelectItem value="2048">2 GB</SelectItem>
                          <SelectItem value="4096">4 GB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="swapUsage">Use Swap Memory</Label>
                        <p className="text-sm text-muted-foreground">Allow using disk space as virtual memory</p>
                      </div>
                      <Switch id="swapUsage" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Processing Scheduling</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="offPeakProcessing">Off-peak Processing</Label>
                    <p className="text-sm text-muted-foreground">Schedule intensive tasks during off-peak hours</p>
                  </div>
                  <Switch id="offPeakProcessing" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="offPeakStart">Off-peak Start Time</Label>
                  <Select defaultValue="22">
                    <SelectTrigger id="offPeakStart">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18">6:00 PM</SelectItem>
                      <SelectItem value="20">8:00 PM</SelectItem>
                      <SelectItem value="22">10:00 PM</SelectItem>
                      <SelectItem value="0">12:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="offPeakEnd">Off-peak End Time</Label>
                  <Select defaultValue="6">
                    <SelectTrigger id="offPeakEnd">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4:00 AM</SelectItem>
                      <SelectItem value="6">6:00 AM</SelectItem>
                      <SelectItem value="8">8:00 AM</SelectItem>
                      <SelectItem value="10">10:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="taskQueue">Task Queue Management</Label>
                    <p className="text-sm text-muted-foreground">Enable priority-based task scheduling</p>
                  </div>
                  <Switch id="taskQueue" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="parallelProcessing">Parallel Processing</Label>
                    <p className="text-sm text-muted-foreground">Run multiple processing tasks simultaneously</p>
                  </div>
                  <Switch id="parallelProcessing" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxThreads">Maximum Threads</Label>
                  <Select defaultValue="8">
                    <SelectTrigger id="maxThreads">
                      <SelectValue placeholder="Select max threads" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 threads</SelectItem>
                      <SelectItem value="4">4 threads</SelectItem>
                      <SelectItem value="8">8 threads</SelectItem>
                      <SelectItem value="16">16 threads</SelectItem>
                      <SelectItem value="auto">Auto (System Determined)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Reset to Default</Button>
              <Button onClick={() => toast.success('Resource allocation settings saved')}>Save Changes</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsPageTemplate>
  );
};

export default ProcessingSettings;
