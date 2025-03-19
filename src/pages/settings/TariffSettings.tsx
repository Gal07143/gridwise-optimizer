import React, { useState, useEffect } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toggle } from '@/components/ui/toggle';
import { Plus, Trash2, Edit, Check, Star, Settings, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  getAllTariffs, 
  getTariffById, 
  updateTariff, 
  deleteTariff, 
  setDefaultTariff, 
  addRatePeriod, 
  updateRatePeriod, 
  deleteRatePeriod,
  Tariff,
  RatePeriod 
} from '@/services/tariffService';
import TariffForm from '@/components/settings/tariffs/TariffForm';
import NewTariffDialog from '@/components/settings/tariffs/NewTariffDialog';

const TariffSettings = () => {
  const [selectedTariff, setSelectedTariff] = useState<string | null>(null);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [dayType, setDayType] = useState<'weekday' | 'weekend'>('weekday');
  const [editingRatePeriod, setEditingRatePeriod] = useState<RatePeriod | null>(null);
  const [isAddingRatePeriod, setIsAddingRatePeriod] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    const loadedTariffs = getAllTariffs();
    setTariffs(loadedTariffs);
    
    const defaultTariff = loadedTariffs.find(t => t.isDefault);
    setSelectedTariff(defaultTariff?.id || loadedTariffs[0]?.id || null);
  }, []);
  
  const currentTariff = tariffs.find(t => t.id === selectedTariff);
  
  const ratePeriods = currentTariff 
    ? (dayType === 'weekday' ? currentTariff.weekdayRates : currentTariff.weekendRates)
    : [];
  
  const handleTariffChange = (id: string) => {
    setSelectedTariff(id);
  };
  
  const handleSetDefault = (id: string) => {
    setDefaultTariff(id);
    setTariffs(getAllTariffs());
    toast.success("Default tariff updated");
  };
  
  const handleDeleteTariff = (id: string) => {
    if (window.confirm("Are you sure you want to delete this tariff?")) {
      const success = deleteTariff(id);
      if (success) {
        const updatedTariffs = getAllTariffs();
        setTariffs(updatedTariffs);
        
        if (id === selectedTariff) {
          const defaultTariff = updatedTariffs.find(t => t.isDefault);
          setSelectedTariff(defaultTariff?.id || updatedTariffs[0]?.id || null);
        }
      }
    }
  };
  
  const handleDayTypeToggle = (type: 'weekday' | 'weekend') => {
    setDayType(type);
  };
  
  const handleAddRatePeriod = (values: RatePeriod) => {
    if (!currentTariff) return;
    
    const newRatePeriod = addRatePeriod(
      currentTariff.id!, 
      values,
      dayType
    );
    
    if (newRatePeriod) {
      setTariffs(getAllTariffs());
      setIsAddingRatePeriod(false);
      toast.success(`Rate period added to ${dayType} tariff`);
    }
  };
  
  const handleEditRatePeriod = (values: RatePeriod) => {
    if (!currentTariff || !editingRatePeriod?.id) return;
    
    const updatedRate = updateRatePeriod(
      currentTariff.id!,
      editingRatePeriod.id,
      values,
      dayType
    );
    
    if (updatedRate) {
      setTariffs(getAllTariffs());
      setEditingRatePeriod(null);
      toast.success("Rate period updated");
    }
  };
  
  const handleDeleteRatePeriod = (id: string) => {
    if (!currentTariff) return;
    
    const success = deleteRatePeriod(
      currentTariff.id!,
      id,
      dayType
    );
    
    if (success) {
      setTariffs(getAllTariffs());
    }
  };
  
  const handleTariffCreated = () => {
    const updatedTariffs = getAllTariffs();
    setTariffs(updatedTariffs);
    setSelectedTariff(updatedTariffs[updatedTariffs.length - 1].id);
  };
  
  const renderRatePeriodForm = () => {
    if (isAddingRatePeriod) {
      return (
        <div className="border rounded-md p-4 mb-4">
          <h4 className="font-medium mb-4">Add New Rate Period</h4>
          <TariffForm 
            onSubmit={handleAddRatePeriod}
            onCancel={() => setIsAddingRatePeriod(false)}
          />
        </div>
      );
    }
    
    if (editingRatePeriod) {
      return (
        <div className="border rounded-md p-4 mb-4">
          <h4 className="font-medium mb-4">Edit Rate Period</h4>
          <TariffForm 
            initialValues={editingRatePeriod}
            onSubmit={handleEditRatePeriod}
            onCancel={() => setEditingRatePeriod(null)}
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <SettingsPageTemplate 
      title="Energy Tariffs" 
      description="Configure electricity pricing and billing rates"
      headerIcon={<Zap size={24} />}
      actions={<NewTariffDialog onTariffCreated={handleTariffCreated} />}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Tariff Configuration</h3>
          <div className="flex space-x-2">
            <Select 
              value={selectedTariff || ''} 
              onValueChange={handleTariffChange}
            >
              <SelectTrigger className="w-[230px]">
                <SelectValue placeholder="Select tariff plan" />
              </SelectTrigger>
              <SelectContent>
                {tariffs.map(tariff => (
                  <SelectItem key={tariff.id} value={tariff.id!}>
                    {tariff.name} {tariff.isDefault && '(Default)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {currentTariff && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!currentTariff.isDefault && (
                    <DropdownMenuItem onClick={() => handleSetDefault(currentTariff.id!)}>
                      <Star className="mr-2 h-4 w-4" />
                      <span>Set as Default</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleDeleteTariff(currentTariff.id!)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Tariff</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        {currentTariff && (
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
                    {!isAddingRatePeriod && !editingRatePeriod && (
                      <Button size="sm" onClick={() => setIsAddingRatePeriod(true)}>
                        <Plus size={16} className="mr-1" /> Add Period
                      </Button>
                    )}
                  </div>
                </div>
                
                {renderRatePeriodForm()}
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <Label className="min-w-[100px]">Day Type:</Label>
                      <div className="flex border rounded-md overflow-hidden">
                        <Toggle 
                          pressed={dayType === 'weekday'} 
                          onClick={() => handleDayTypeToggle('weekday')}
                          className="rounded-none px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        >
                          Weekday
                        </Toggle>
                        <Toggle 
                          pressed={dayType === 'weekend'} 
                          onClick={() => handleDayTypeToggle('weekend')}
                          className="rounded-none px-4 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        >
                          Weekend
                        </Toggle>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Period Name</TableHead>
                          <TableHead>Start Time</TableHead>
                          <TableHead>End Time</TableHead>
                          <TableHead>Rate ($/kWh)</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ratePeriods.map(rate => (
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
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => setEditingRatePeriod(rate)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => handleDeleteRatePeriod(rate.id!)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        
                        {ratePeriods.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                              No rate periods defined. Click "Add Period" to create one.
                            </TableCell>
                          </TableRow>
                        )}
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
        )}
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={() => toast.success('Tariff settings saved successfully')}>Save Changes</Button>
        </div>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to perform this action?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </SettingsPageTemplate>
  );
};

export default TariffSettings;
