
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/useToast';
import { UserPreference } from '@/types/energy';

const UserPreferencesPage = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    min_soc: 20,
    max_soc: 85,
    time_window_start: '22:00',
    time_window_end: '07:00',
    priority_device_ids: []
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch user preferences
    const fetchPreferences = async () => {
      setIsLoading(true);
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockPreferences = {
          min_soc: 20,
          max_soc: 85,
          time_window_start: '22:00',
          time_window_end: '07:00',
          priority_device_ids: ['device-1', 'device-2']
        };
        
        setPreferences(mockPreferences);
      } catch (error) {
        console.error('Error fetching preferences:', error);
        toast({
          title: 'Failed to load preferences',
          description: 'Please try again later',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPreferences();
  }, [toast]);

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Preferences saved',
        description: 'Your energy preferences have been updated',
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Failed to save preferences',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Energy Preferences</h1>
      <p className="text-muted-foreground mb-8">
        Customize how your energy system operates based on your preferences.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Battery Preferences</CardTitle>
          <CardDescription>
            Control how your battery charges and discharges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Battery State of Charge Limits</Label>
                <span className="text-sm text-muted-foreground">
                  {preferences.min_soc}% - {preferences.max_soc}%
                </span>
              </div>
              <Slider
                value={[preferences.min_soc, preferences.max_soc]}
                min={0}
                max={100}
                step={5}
                className="my-4"
                onValueChange={(values) => {
                  setPreferences({
                    ...preferences,
                    min_soc: values[0],
                    max_soc: values[1]
                  });
                }}
              />
              <p className="text-sm text-muted-foreground">
                Set the minimum and maximum charge levels for your battery
              </p>
            </div>

            <Separator />

            <div>
              <Label className="mb-2 block">Preferred Charge/Discharge Window</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="time-start" className="text-sm">Start Time</Label>
                  <Input
                    id="time-start"
                    type="time"
                    value={preferences.time_window_start}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      time_window_start: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-end" className="text-sm">End Time</Label>
                  <Input
                    id="time-end"
                    type="time"
                    value={preferences.time_window_end}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      time_window_end: e.target.value
                    })}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Set your preferred times for charging (typically during low-cost periods)
              </p>
            </div>

            <Separator />

            <div>
              <Label className="mb-2 block">Energy Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cost">Cost Saving</SelectItem>
                  <SelectItem value="self_consumption">Self Consumption</SelectItem>
                  <SelectItem value="backup">Backup Readiness</SelectItem>
                  <SelectItem value="grid_support">Grid Support</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                Choose what's most important to you
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSavePreferences}
            disabled={isLoading}
            className="ml-auto"
          >
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserPreferencesPage;
