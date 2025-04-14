
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { equipmentService } from '@/services/equipmentService';
import { SparePartInventory } from '@/types/equipment';

const SparePartsInventoryComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [parts, setParts] = useState<SparePartInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        if (!id) return;
        const data = await equipmentService.getSparePartsInventory(id);
        setParts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch spare parts');
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, [id]);

  const handleUpdatePart = async (partId: string, quantity: number) => {
    try {
      if (!id) return;
      // Fix: Pass a proper SparePartInventory object with quantity property
      await equipmentService.updateSparePart(id, partId, { quantity });
      // Refresh the list
      const data = await equipmentService.getSparePartsInventory(id);
      setParts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update spare part');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Spare Parts Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parts.map((part) => (
              <Card key={part.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Part Name</Label>
                      <div className="text-sm font-medium">{part.name}</div>
                    </div>
                    <div>
                      <Label>Part Number</Label>
                      <div className="text-sm font-medium">{part.partNumber || 'N/A'}</div>
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <div className="text-sm font-medium">{part.quantity}</div>
                    </div>
                    <div>
                      <Label>Minimum Quantity</Label>
                      <div className="text-sm font-medium">{part.minimumQuantity}</div>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <div className="text-sm font-medium">{part.location}</div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="text-sm font-medium">{part.status || 'Active'}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => handleUpdatePart(part.id, part.quantity + 1)}
                    >
                      Add One
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

export default SparePartsInventoryComponent;
