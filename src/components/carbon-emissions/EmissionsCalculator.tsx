
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, AreaChart, ChartContainer } from '@/components/ui/chart';

type EmissionFactor = {
  id: string;
  energy_category: string;
  region: string;
  factor: number;
  unit: string;
};

const EmissionsCalculator: React.FC = () => {
  const [energyCategory, setEnergyCategory] = useState<string>('electricity');
  const [region, setRegion] = useState<string>('global');
  const [consumption, setConsumption] = useState<string>('');
  const [calculatedEmissions, setCalculatedEmissions] = useState<number | null>(null);

  const { data: emissionFactors, isLoading } = useQuery({
    queryKey: ['emissionFactors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carbon_emission_factors')
        .select('*');
      
      if (error) throw error;
      return data as EmissionFactor[];
    },
  });

  const handleCalculate = () => {
    if (!consumption || !emissionFactors) return;
    
    const factor = emissionFactors.find(
      f => f.energy_category === energyCategory && (!f.region || f.region === region)
    );
    
    if (factor) {
      const emissions = parseFloat(consumption) * factor.factor;
      setCalculatedEmissions(emissions);
    }
  };

  // Sample data for the emissions chart
  const monthlyEmissionsData = [
    { month: 'Jan', emissions: 32 },
    { month: 'Feb', emissions: 28 },
    { month: 'Mar', emissions: 30 },
    { month: 'Apr', emissions: 35 },
    { month: 'May', emissions: 34 },
    { month: 'Jun', emissions: 40 },
    { month: 'Jul', emissions: 45 },
    { month: 'Aug', emissions: 42 },
    { month: 'Sep', emissions: 38 },
    { month: 'Oct', emissions: 36 },
    { month: 'Nov', emissions: 33 },
    { month: 'Dec', emissions: 35 },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Carbon Emissions Calculator</CardTitle>
        <CardDescription>
          Calculate the carbon emissions from your energy consumption
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="energy-category">
                Energy Category
              </Label>
              <Select
                defaultValue={energyCategory}
                onValueChange={setEnergyCategory}
              >
                <SelectTrigger id="energy-category">
                  <SelectValue placeholder="Select energy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="natural_gas">Natural Gas</SelectItem>
                  <SelectItem value="heating_oil">Heating Oil</SelectItem>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">
                Region
              </Label>
              <Select
                defaultValue={region}
                onValueChange={setRegion}
              >
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global Average</SelectItem>
                  <SelectItem value="eu">European Union</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="china">China</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consumption">
              Energy Consumption (kWh, m³, liters)
            </Label>
            <Input
              id="consumption"
              type="number"
              placeholder="Enter your energy consumption"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleCalculate} 
            className="w-full"
            disabled={!consumption || isLoading}
          >
            Calculate Emissions
          </Button>
          
          {calculatedEmissions !== null && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold text-lg">Results</h3>
              <p className="text-lg mt-1">
                <span className="font-normal">Carbon Emissions: </span>
                <span className="font-bold">{calculatedEmissions.toFixed(2)} kg CO₂e</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This is equivalent to driving approximately {(calculatedEmissions * 4).toFixed(1)} km in an average car.
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Historical Emissions</h3>
          <ChartContainer className="h-[240px]">
            <AreaChart
              data={monthlyEmissionsData}
              xKey="month"
              yKey="emissions"
              areaColor="hsl(142.1, 76.2%, 36.3%)"
              gradientId="emissionsGradient"
            />
          </ChartContainer>
          <div className="text-xs text-muted-foreground text-center">
            Monthly carbon emissions in kg CO₂e
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Data sourced from international carbon emission databases.
        </p>
        <Button variant="outline" size="sm">Export Data</Button>
      </CardFooter>
    </Card>
  );
};

export default EmissionsCalculator;
