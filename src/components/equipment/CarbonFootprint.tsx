import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { equipmentService } from '@/services/equipmentService';
import { CarbonEmissionsDetail } from '@/types/equipment';

const CarbonFootprint: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [emissions, setEmissions] = useState<CarbonEmissionsDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmissions = async () => {
      try {
        if (!id) return;
        const data = await equipmentService.getCarbonEmissionsDetails(id);
        setEmissions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch emissions data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmissions();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Carbon Footprint Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emissions.map((emission) => (
              <Card key={emission.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Source</Label>
                      <div className="text-sm font-medium">{emission.source}</div>
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <div className="text-sm font-medium">{emission.amount} {emission.unit}</div>
                    </div>
                    <div>
                      <Label>Date</Label>
                      <div className="text-sm font-medium">
                        {new Date(emission.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <div className="text-sm font-medium">{emission.category}</div>
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

export default CarbonFootprint; 