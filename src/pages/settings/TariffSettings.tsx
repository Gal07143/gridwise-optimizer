
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toggle } from '@/components/ui/toggle';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

const TariffSettings = () => {
  // Mock tariff data
  const weekdayRates = [
    { id: 1, period: 'Off-Peak', startTime: '00:00', endTime: '07:00', rate: 0.08 },
    { id: 2, period: 'Shoulder', startTime: '07:00', endTime: '16:00', rate: 0.15 },
    { id: 3, period: 'Peak', startTime: '16:00', endTime: '20:00', rate: 0.28 },
    { id: 4, period: 'Shoulder', startTime: '20:00', endTime: '23:59', rate: 0.15 },
  ];
  
  const weekendRates = [
    { id: 1, period: 'Off-Peak', startTime: '00:00', endTime: '09:00', rate: 0.07 },
    { id: 2, period: 'Shoulder', startTime: '09:00', endTime: '23:59', rate: 0.12 },
  ];

  return (
    <SettingsPageTemplate 
      title="Energy Tariffs" 
      description="Configure electricity pricing and billing rates"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Tariff Configuration</h3>
          <div className="flex space-x-2">
            <Select defaultValue="standard">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select tariff plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Tariff</SelectItem>
                <SelectItem value="tou">Time-of-Use</SelectItem>
                <SelectItem value="dynamic">Dynamic Pricing</SelectItem>
                <SelectItem value="fixed">Fixed Rate</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Save as New</Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Tabs defaultValue="tou" className="w-full">
            <TabsList className="grid grid-cols-4 h-auto p-0">
              <TabsTrigger value="tou" className="py-3 rounded-none rounded-tl-md data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Time-of-Use
              </TabsTrigger>
              <TabsTrigger value="demand" className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Demand Charges
              </TabsTrigger>
              <TabsTrigger value="export" className="py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Export Rates
              </TabsTrigger>
              <TabsTrigger value="seasonal" className="py-3 rounded-none rounded-tr-md data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Seasonal Adjustments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tou" className="p-4 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium mb-1">Time-of-Use Rates</h4>
                  <p className="text-sm text-muted-foreground">Electricity rates based on time of day</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => toast.info('Edit mode activated')}>
                    <Edit size={16} className="mr-1" /> Edit Periods
                  </Button>
                  <Button size="sm" onClick={() => toast.success('New rate period added')}>
                    <Plus size={16} className="mr-1" /> Add Period
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <Label className="min-w-[100px]">Day Type:</Label>
                    <div className="flex border rounded-md overflow-hidden">
                      <Toggle pressed className="rounded-none px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Weekday</Toggle>
                      <Toggle className="rounded-none px-4">Weekend</Toggle>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period Name</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Rate ($/kWh)</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weekdayRates.map(rate => (
                        <TableRow key={rate.id}>
                          <TableCell>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                              ${rate.period === 'Peak' ? 'bg-red-100 text-red-800' : 
                                rate.period === 'Shoulder' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'}`}>
                              {rate.period}
                            </div>
                          </TableCell>
                          <TableCell>{rate.startTime}</TableCell>
                          <TableCell>{rate.endTime}</TableCell>
                          <TableCell>${rate.rate.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="demand" className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Demand Charge Configuration</h4>
                  <p className="text-sm text-muted-foreground">Charges based on maximum demand</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Demand Charge Rate ($/kW)</Label>
                      <Input type="number" defaultValue="12.50" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Measurement Window (minutes)</Label>
                      <Select defaultValue="15">
                        <SelectTrigger>
                          <SelectValue placeholder="Select time window" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Demand Threshold (kW)</Label>
                      <Input type="number" defaultValue="50" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Calculation Method</Label>
                      <Select defaultValue="peak">
                        <SelectTrigger>
                          <SelectValue placeholder="Select calculation method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="peak">Monthly Peak</SelectItem>
                          <SelectItem value="average">Daily Peak Average</SelectItem>
                          <SelectItem value="ratchet">Ratchet Method</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="export" className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Energy Export Configuration</h4>
                  <p className="text-sm text-muted-foreground">Rates for selling energy back to the grid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Feed-in Tariff Rate ($/kWh)</Label>
                      <Input type="number" defaultValue="0.08" step="0.01" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Net Metering</Label>
                      <Select defaultValue="enabled">
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enabled">Enabled</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Export Limit (kW)</Label>
                    <div className="space-y-6">
                      <div>
                        <Slider 
                          defaultValue={[5]} 
                          max={20} 
                          step={0.5}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0 kW</span>
                          <span>5 kW</span>
                          <span>10 kW</span>
                          <span>15 kW</span>
                          <span>20 kW</span>
                        </div>
                      </div>
                      <Input type="number" defaultValue="5" min="0" max="20" step="0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="seasonal" className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Seasonal Rate Adjustments</h4>
                  <p className="text-sm text-muted-foreground">Season-specific pricing adjustments</p>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Season</TableHead>
                      <TableHead>Months</TableHead>
                      <TableHead>Adjustment Factor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Summer</TableCell>
                      <TableCell>Jun - Aug</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>1.2x</span>
                          <Input 
                            type="range" 
                            min={0.5} 
                            max={2} 
                            step={0.1} 
                            defaultValue={1.2}
                            className="w-32" 
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Toggle pressed aria-label="Toggle summer" className="data-[state=on]:bg-green-100 data-[state=on]:text-green-800">
                          Enabled
                        </Toggle>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Winter</TableCell>
                      <TableCell>Dec - Feb</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>1.1x</span>
                          <Input 
                            type="range" 
                            min={0.5} 
                            max={2} 
                            step={0.1} 
                            defaultValue={1.1}
                            className="w-32" 
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Toggle pressed aria-label="Toggle winter" className="data-[state=on]:bg-green-100 data-[state=on]:text-green-800">
                          Enabled
                        </Toggle>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Spring</TableCell>
                      <TableCell>Mar - May</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>1.0x</span>
                          <Input 
                            type="range" 
                            min={0.5} 
                            max={2} 
                            step={0.1} 
                            defaultValue={1.0}
                            className="w-32" 
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Toggle pressed aria-label="Toggle spring" className="data-[state=on]:bg-green-100 data-[state=on]:text-green-800">
                          Enabled
                        </Toggle>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fall</TableCell>
                      <TableCell>Sep - Nov</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>0.9x</span>
                          <Input 
                            type="range" 
                            min={0.5} 
                            max={2} 
                            step={0.1} 
                            defaultValue={0.9}
                            className="w-32" 
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Toggle pressed aria-label="Toggle fall" className="data-[state=on]:bg-green-100 data-[state=on]:text-green-800">
                          Enabled
                        </Toggle>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={() => toast.success('Tariff settings saved successfully')}>Save Changes</Button>
        </div>
      </div>
    </SettingsPageTemplate>
  );
};

export default TariffSettings;
