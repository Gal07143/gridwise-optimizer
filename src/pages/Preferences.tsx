
import React from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useQuery } from '@tanstack/react-query';
import { getUserPreferences, saveUserPreferences } from '@/services/energyOptimizationService';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';

const Preferences = () => {
  const { user } = useAuth();
  const userId = user?.id || '';
  
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['userPreferences', userId],
    queryFn: () => getUserPreferences(userId),
    enabled: !!userId,
  });
  
  const [minSoC, setMinSoC] = React.useState(preferences?.min_soc || 20);
  const [maxSoC, setMaxSoC] = React.useState(preferences?.max_soc || 90);
  const [startTime, setStartTime] = React.useState(preferences?.time_window_start || '');
  const [endTime, setEndTime] = React.useState(preferences?.time_window_end || '');

  const handleSavePreferences = async () => {
    try {
      await saveUserPreferences(userId, {
        min_soc: minSoC,
        max_soc: maxSoC,
        time_window_start: startTime,
        time_window_end: endTime
      });
      toast.success('Preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save preferences');
    }
  };

  return (
    <Main title="Preferences">
      <h1 className="text-2xl font-bold mb-4">User Preferences</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Energy Optimization Preferences</CardTitle>
            <CardDescription>
              Configure your energy optimization settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Battery SoC Limits</Label>
                <div className="text-sm text-slate-500">
                  {minSoC}% - {maxSoC}%
                </div>
              </div>
              <Slider
                value={[minSoC, maxSoC]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => {
                  setMinSoC(value[0]);
                  setMaxSoC(value[1]);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Set the minimum and maximum state of charge for your battery
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Optimization Window Start</Label>
                <Input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Optimization Window End</Label>
                <Input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            
            <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </Main>
  );
};

export default Preferences;
