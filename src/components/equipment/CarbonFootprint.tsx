
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { equipmentService } from '@/services/equipmentService';
import { CarbonEmissionsDetail } from '@/types/equipment';
import { Activity, CalendarClock, FileText, Tag, Leaf } from 'lucide-react';

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
            <Leaf className="h-5 w-5 mr-2 text-green-500" />
            Carbon Footprint Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 pt-4">
            {emissions.map((emission) => (
              <Card key={emission.id} className="overflow-hidden tech-card hover:scale-[1.01] transition-transform duration-300">
                <div className="absolute top-0 right-0 m-1">
                  <span className="text-xs px-2 py-0.5 rounded-full tech-badge-green">
                    {emission.category}
                  </span>
                </div>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center text-xs text-muted-foreground mb-1">
                        <Tag className="h-3 w-3 mr-1" />
                        Source
                      </Label>
                      <div className="text-sm font-medium">{emission.source}</div>
                    </div>
                    <div>
                      <Label className="flex items-center text-xs text-muted-foreground mb-1">
                        <Activity className="h-3 w-3 mr-1" />
                        Amount
                      </Label>
                      <div className="text-sm font-medium">
                        <span className="text-primary">{emission.amount}</span> {emission.unit}
                      </div>
                    </div>
                    <div>
                      <Label className="flex items-center text-xs text-muted-foreground mb-1">
                        <CalendarClock className="h-3 w-3 mr-1" />
                        Date
                      </Label>
                      <div className="text-sm font-medium">
                        {new Date(emission.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <Label className="flex items-center text-xs text-muted-foreground mb-1">
                        <FileText className="h-3 w-3 mr-1" />
                        Category
                      </Label>
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
