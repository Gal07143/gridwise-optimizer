
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { equipmentService } from '@/services/equipmentService';
import { EnergySaving } from '@/types/equipment';

const EnergySavingComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [savings, setSavings] = useState<EnergySaving[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        if (!id) return;
        const data = await equipmentService.getEnergySavings(id);
        setSavings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch energy savings');
      } finally {
        setLoading(false);
      }
    };

    fetchSavings();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Energy Savings Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savings.map((saving) => (
              <Card key={saving.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Measure</Label>
                      <div className="text-sm font-medium">{saving.measureId}</div>
                    </div>
                    <div>
                      <Label>Baseline Period</Label>
                      <div className="text-sm font-medium">
                        {new Date(saving.baselinePeriod.start).toLocaleDateString()} - {new Date(saving.baselinePeriod.end).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <Label>Reporting Period</Label>
                      <div className="text-sm font-medium">
                        {new Date(saving.reportingPeriod.start).toLocaleDateString()} - {new Date(saving.reportingPeriod.end).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <Label>Baseline Consumption</Label>
                      <div className="text-sm font-medium">{saving.baselineConsumption}</div>
                    </div>
                    <div>
                      <Label>Reporting Consumption</Label>
                      <div className="text-sm font-medium">{saving.reportingConsumption}</div>
                    </div>
                    <div>
                      <Label>Saved Energy</Label>
                      <div className="text-sm font-medium">{saving.savedEnergy}</div>
                    </div>
                    <div>
                      <Label>Saved Cost</Label>
                      <div className="text-sm font-medium">${saving.savedCost}</div>
                    </div>
                    <div>
                      <Label>Saved Emissions</Label>
                      <div className="text-sm font-medium">{saving.savedEmissions}</div>
                    </div>
                    <div>
                      <Label>Verification Method</Label>
                      <div className="text-sm font-medium">{saving.verificationMethod}</div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="text-sm font-medium">{saving.status}</div>
                    </div>
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

export default EnergySavingComponent;
