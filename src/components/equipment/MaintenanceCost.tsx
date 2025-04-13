import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { equipmentService } from '@/services/equipmentService';
import { MaintenanceCost } from '@/types/equipment';

const MaintenanceCostComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [costs, setCosts] = useState<MaintenanceCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        if (!id) return;
        const data = await equipmentService.getMaintenanceCosts(id);
        setCosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch maintenance costs');
      } finally {
        setLoading(false);
      }
    };

    fetchCosts();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costs.map((cost) => (
              <Card key={cost.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Maintenance Type</Label>
                      <div className="text-sm font-medium">{cost.maintenanceType}</div>
                    </div>
                    <div>
                      <Label>Cost</Label>
                      <div className="text-sm font-medium">${cost.cost.toFixed(2)}</div>
                    </div>
                    <div>
                      <Label>Date</Label>
                      <div className="text-sm font-medium">
                        {new Date(cost.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <div className="text-sm font-medium">{cost.description}</div>
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

export default MaintenanceCostComponent; 