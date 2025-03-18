
import React, { useState } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Gauge, Battery, Zap, Droplets, Thermometer, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ThresholdProps {
  name: string;
  description: string;
  currentValue: number;
  min: number;
  max: number;
  unit: string;
  criticalLow: number;
  criticalHigh: number;
  warningLow: number;
  warningHigh: number;
}

const OperationalThresholds = () => {
  const [batteryThresholds, setBatteryThresholds] = useState<ThresholdProps[]>([
    {
      name: 'State of Charge',
      description: 'Battery charge level thresholds',
      currentValue: 20,
      min: 0,
      max: 100,
      unit: '%',
      criticalLow: 10,
      warningLow: 20,
      warningHigh: 90,
      criticalHigh: 95
    },
    {
      name: 'Charge Rate',
      description: 'Maximum battery charging rate',
      currentValue: 80,
      min: 0,
      max: 100,
      unit: '%',
      criticalLow: 0,
      warningLow: 0,
      warningHigh: 85,
      criticalHigh: 95
    },
    {
      name: 'Temperature',
      description: 'Battery temperature limits',
      currentValue: 25,
      min: 0,
      max: 60,
      unit: '°C',
      criticalLow: 5,
      warningLow: 10,
      warningHigh: 40,
      criticalHigh: 45
    }
  ]);
  
  const [powerThresholds, setPowerThresholds] = useState<ThresholdProps[]>([
    {
      name: 'Grid Import',
      description: 'Maximum power draw from grid',
      currentValue: 15,
      min: 0,
      max: 30,
      unit: 'kW',
      criticalLow: 0,
      warningLow: 0,
      warningHigh: 20,
      criticalHigh: 25
    },
    {
      name: 'Grid Export',
      description: 'Maximum power export to grid',
      currentValue: 10,
      min: 0,
      max: 20,
      unit: 'kW',
      criticalLow: 0,
      warningLow: 0,
      warningHigh: 15,
      criticalHigh: 18
    }
  ]);
  
  const [changed, setChanged] = useState(false);
  
  const handleThresholdChange = (
    index: number, 
    thresholdType: 'batteryThresholds' | 'powerThresholds', 
    property: 'warningLow' | 'warningHigh' | 'criticalLow' | 'criticalHigh',
    value: number
  ) => {
    const thresholds = thresholdType === 'batteryThresholds' 
      ? [...batteryThresholds] 
      : [...powerThresholds];
      
    thresholds[index][property] = value;
    
    if (thresholdType === 'batteryThresholds') {
      setBatteryThresholds(thresholds);
    } else {
      setPowerThresholds(thresholds);
    }
    
    setChanged(true);
  };
  
  const handleSaveChanges = () => {
    toast.success("Threshold settings saved successfully");
    setChanged(false);
  };

  return (
    <SettingsPageTemplate 
      title="Operational Thresholds" 
      description="Configure system operational parameters and safety thresholds"
      headerIcon={<Gauge size={20} />}
      actions={
        <Button 
          onClick={handleSaveChanges} 
          disabled={!changed}
          className="gap-2"
        >
          <Save size={16} />
          Save Changes
        </Button>
      }
    >
      <Tabs defaultValue="battery">
        <TabsList className="mb-6">
          <TabsTrigger value="battery" className="gap-2">
            <Battery size={14} />
            Battery
          </TabsTrigger>
          <TabsTrigger value="power" className="gap-2">
            <Zap size={14} />
            Power
          </TabsTrigger>
          <TabsTrigger value="environmental" className="gap-2">
            <Thermometer size={14} />
            Environmental
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="battery" className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Battery size={18} />
              <span>Battery System Thresholds</span>
            </h3>
            <p className="text-sm text-muted-foreground">Configure operational limits for battery systems</p>
          </div>
          
          <div className="grid gap-6">
            {batteryThresholds.map((threshold, index) => (
              <Card key={index} className="p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-medium">{threshold.name}</h4>
                    <Badge variant="outline">
                      Current: {threshold.currentValue}{threshold.unit}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{threshold.description}</p>
                </div>
                
                <div className="space-y-6 mt-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Critical Low</span>
                      <span className="text-sm font-medium">{threshold.criticalLow}{threshold.unit}</span>
                    </div>
                    <Slider
                      value={[threshold.criticalLow]}
                      min={threshold.min}
                      max={threshold.max}
                      step={1}
                      onValueChange={(value) => handleThresholdChange(index, 'batteryThresholds', 'criticalLow', value[0])}
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Warning Low</span>
                      <span className="text-sm font-medium">{threshold.warningLow}{threshold.unit}</span>
                    </div>
                    <Slider
                      value={[threshold.warningLow]}
                      min={threshold.min}
                      max={threshold.max}
                      step={1}
                      onValueChange={(value) => handleThresholdChange(index, 'batteryThresholds', 'warningLow', value[0])}
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Warning High</span>
                      <span className="text-sm font-medium">{threshold.warningHigh}{threshold.unit}</span>
                    </div>
                    <Slider
                      value={[threshold.warningHigh]}
                      min={threshold.min}
                      max={threshold.max}
                      step={1}
                      onValueChange={(value) => handleThresholdChange(index, 'batteryThresholds', 'warningHigh', value[0])}
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Critical High</span>
                      <span className="text-sm font-medium">{threshold.criticalHigh}{threshold.unit}</span>
                    </div>
                    <Slider
                      value={[threshold.criticalHigh]}
                      min={threshold.min}
                      max={threshold.max}
                      step={1}
                      onValueChange={(value) => handleThresholdChange(index, 'batteryThresholds', 'criticalHigh', value[0])}
                      className="h-2"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Safety Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium">Emergency Shutdown</h4>
                <p className="text-sm text-muted-foreground">Automatically shut down if thresholds are exceeded</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium">Alarm Notifications</h4>
                <p className="text-sm text-muted-foreground">Send alerts when thresholds are approached</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="power" className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Zap size={18} />
              <span>Power System Thresholds</span>
            </h3>
            <p className="text-sm text-muted-foreground">Configure operational limits for power systems</p>
          </div>
          
          <div className="grid gap-6">
            {powerThresholds.map((threshold, index) => (
              <Card key={index} className="p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-medium">{threshold.name}</h4>
                    <Badge variant="outline">
                      Current: {threshold.currentValue}{threshold.unit}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{threshold.description}</p>
                </div>
                
                <div className="space-y-6 mt-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Warning High</span>
                      <span className="text-sm font-medium">{threshold.warningHigh}{threshold.unit}</span>
                    </div>
                    <Slider
                      value={[threshold.warningHigh]}
                      min={threshold.min}
                      max={threshold.max}
                      step={1}
                      onValueChange={(value) => handleThresholdChange(index, 'powerThresholds', 'warningHigh', value[0])}
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Critical High</span>
                      <span className="text-sm font-medium">{threshold.criticalHigh}{threshold.unit}</span>
                    </div>
                    <Slider
                      value={[threshold.criticalHigh]}
                      min={threshold.min}
                      max={threshold.max}
                      step={1}
                      onValueChange={(value) => handleThresholdChange(index, 'powerThresholds', 'criticalHigh', value[0])}
                      className="h-2"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="environmental">
          <div className="flex items-center justify-center h-60 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Environmental thresholds configuration coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </SettingsPageTemplate>
  );
};

export default OperationalThresholds;
