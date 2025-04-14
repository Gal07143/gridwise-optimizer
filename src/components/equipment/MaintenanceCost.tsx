
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { equipmentService } from '@/services/equipmentService';
import { MaintenanceCost } from '@/types/equipment';
import { Calendar, DollarSign, FileText, Wrench } from 'lucide-react'; // Replace Tool with Wrench which is available

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

  if (loading) return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50/10 border border-red-200/20 rounded-lg p-4 text-red-500">
      Error: {error}
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="shadow-sm hover:shadow-md transition-all border-border/50 backdrop-blur-sm bg-card/90">
        <CardHeader className="bg-gradient-to-r from-background to-background/90 rounded-t-lg border-b border-border/20">
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-primary" />
            Maintenance Costs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 pt-4">
            {costs.map((cost) => (
              <Card key={cost.id} className="overflow-hidden tech-card hover:scale-[1.01] transition-transform duration-300">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center text-xs text-muted-foreground mb-1">
                        <Wrench className="h-3 w-3 mr-1" />
                        Maintenance Type
                      </Label>
                      <div className="text-sm font-medium">{cost.maintenanceType || cost.costCategory}</div>
                    </div>
                    <div>
                      <Label className="flex items-center text-xs text-muted-foreground mb-1">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Cost
                      </Label>
                      <div className="text-sm font-medium text-primary">${(cost.cost || cost.totalCost).toFixed(2)}</div>
                    </div>
                    <div>
                      <Label className="flex items-center text-xs text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Date
                      </Label>
                      <div className="text-sm font-medium">
                        {new Date(cost.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <Label className="flex items-center text-xs text-muted-foreground mb-1">
                        <FileText className="h-3 w-3 mr-1" />
                        Description
                      </Label>
                      <div className="text-sm font-medium">{cost.description || `${cost.costCategory} maintenance`}</div>
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
