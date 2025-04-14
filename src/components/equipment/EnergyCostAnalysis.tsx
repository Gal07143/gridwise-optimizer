
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { equipmentService } from '@/services/equipmentService';
import { EnergyRateStructure } from '@/types/equipment';

const EnergyCostAnalysis: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rateStructures, setRateStructures] = useState<EnergyRateStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRateStructures = async () => {
      try {
        if (!id) return;
        // Fix: Changed to call the method without the id parameter
        const structures = await equipmentService.getEnergyRateStructures();
        setRateStructures(structures);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rate structures');
      } finally {
        setLoading(false);
      }
    };

    fetchRateStructures();
  }, [id]);

  const handleApplyRateStructure = async (structureId: string) => {
    try {
      if (!id) return;
      await equipmentService.applyEnergyRateStructure(id, structureId);
      // Fix: Changed to call the method without the id parameter
      const structures = await equipmentService.getEnergyRateStructures();
      setRateStructures(structures);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply rate structure');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Energy Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rateStructures.map((structure) => (
              <Card key={structure.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Rate Type</Label>
                      <div className="text-sm font-medium">{structure.rateType || structure.name}</div>
                    </div>
                    <div>
                      <Label>Rate Value</Label>
                      <div className="text-sm font-medium">
                        {structure.rateValue || (structure.rates.length > 0 ? structure.rates[0].rate : 0)} {structure.unit || (structure.rates.length > 0 ? structure.rates[0].unit : '$')}
                      </div>
                    </div>
                    <div>
                      <Label>Effective Date</Label>
                      <div className="text-sm font-medium">
                        {new Date(structure.effectiveDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="text-sm font-medium">{structure.status || 'active'}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => handleApplyRateStructure(structure.id)}
                      disabled={structure.status === 'active'}
                    >
                      {structure.status === 'active' ? 'Currently Active' : 'Apply Rate Structure'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergyCostAnalysis;
