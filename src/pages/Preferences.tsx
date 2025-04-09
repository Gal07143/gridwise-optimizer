
import React from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { saveUserPreferences } from '@/services/energyOptimizationService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

const Preferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [minSoc, setMinSoc] = React.useState(20);
  const [maxSoc, setMaxSoc] = React.useState(90);
  const [startTime, setStartTime] = React.useState('22:00');
  const [endTime, setEndTime] = React.useState('06:00');

  const handleSavePreferences = async () => {
    if (!user || !user.id) {
      toast.error('You must be logged in to save preferences');
      return;
    }
    
    try {
      await saveUserPreferences(user.id, {
        min_soc: minSoc,
        max_soc: maxSoc,
        time_window_start: startTime,
        time_window_end: endTime,
        priority_device_ids: [] // Add required empty array for priority devices
      });
      
      toast.success('Preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save preferences');
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <Main title="User Preferences">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Energy Preferences</h1>
        <p className="text-muted-foreground">
          Customize your energy optimization settings
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Battery Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Battery State of Charge Limits</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Minimum SOC: {minSoc}%</span>
                  <span className="text-sm">Maximum SOC: {maxSoc}%</span>
                </div>
                <div className="px-2">
                  <Slider
                    value={[minSoc, maxSoc]}
                    min={5}
                    max={100}
                    step={5}
                    onValueChange={([min, max]) => {
                      setMinSoc(min);
                      setMaxSoc(max);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-2">Preferred Charging Window</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full mt-1 bg-background border rounded p-2"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full mt-1 bg-background border rounded p-2"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-end">
            <Button onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </Main>
  );
};

export default Preferences;
