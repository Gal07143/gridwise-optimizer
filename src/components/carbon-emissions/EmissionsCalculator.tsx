
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { fetchEnergyCategories, fetchCarbonEmissionFactors } from '@/services/myems';
import type { EnergyCategory, CarbonEmissionFactor } from '@/types/myems';

interface EmissionsCalculatorProps {
  initialCategory?: string;
  initialRegion?: string;
}

const EmissionsCalculator: React.FC<EmissionsCalculatorProps> = ({
  initialCategory,
  initialRegion = 'Global'
}) => {
  const [energyCategories, setEnergyCategories] = useState<EnergyCategory[]>([]);
  const [emissionFactors, setEmissionFactors] = useState<CarbonEmissionFactor[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory);
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion);
  const [energyValue, setEnergyValue] = useState<number>(100);
  const [result, setResult] = useState<{ emissions: number; unit: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get unique regions from emission factors
  const regions = Array.from(new Set(emissionFactors.map(ef => ef.region || 'Global'))).filter(Boolean);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const categories = await fetchEnergyCategories();
      setEnergyCategories(categories);
      
      // Set default category if not already selected
      if (!selectedCategory && categories.length > 0) {
        setSelectedCategory(categories[0].id);
      }
      
      // Load emission factors for the selected category
      if (selectedCategory || categories.length > 0) {
        const categoryToUse = selectedCategory || categories[0].id;
        const selectedCategoryName = categories.find(c => c.id === categoryToUse)?.name;
        const factors = await fetchCarbonEmissionFactors(selectedCategoryName);
        setEmissionFactors(factors);
      }
      
      setLoading(false);
    };

    loadData();
  }, [selectedCategory]);

  const calculateEmissions = () => {
    // Find the appropriate emission factor based on category and region
    const category = energyCategories.find(c => c.id === selectedCategory);
    if (!category) return;

    const factor = emissionFactors.find(ef => 
      ef.energy_category === category.name && 
      (ef.region === selectedRegion || (!ef.region && selectedRegion === 'Global'))
    );

    if (!factor) {
      setResult({ emissions: 0, unit: 'kg CO₂e' });
      return;
    }

    // Calculate emissions
    const emissions = energyValue * factor.factor;
    setResult({ 
      emissions: parseFloat(emissions.toFixed(2)), 
      unit: 'kg CO₂e' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carbon Emissions Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="energy-category">Energy Category</Label>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="energy-category">
                  <SelectValue placeholder="Select energy category" />
                </SelectTrigger>
                <SelectContent>
                  {energyCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select 
                value={selectedRegion} 
                onValueChange={setSelectedRegion}
              >
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="energy-value">
                Energy Value ({energyCategories.find(c => c.id === selectedCategory)?.unit})
              </Label>
              <Input
                id="energy-value"
                type="number"
                value={energyValue}
                onChange={(e) => setEnergyValue(parseFloat(e.target.value) || 0)}
              />
            </div>

            <Button onClick={calculateEmissions} className="w-full">
              Calculate Emissions
            </Button>

            {result && (
              <Card className="mt-4 bg-muted">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Estimated Emissions:</p>
                    <p className="text-3xl font-bold">{result.emissions} {result.unit}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmissionsCalculator;
