import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { equipmentService } from '@/services/equipmentService';
import { EnergyBenchmark } from '@/types/equipment';

const EnergyBenchmarkComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [benchmarks, setBenchmarks] = useState<EnergyBenchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenchmarks = async () => {
      try {
        if (!id) return;
        const data = await equipmentService.getEnergyBenchmarks(id);
        setBenchmarks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch energy benchmarks');
      } finally {
        setLoading(false);
      }
    };

    fetchBenchmarks();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Energy Benchmarking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {benchmarks.map((benchmark) => (
              <Card key={benchmark.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Metric</Label>
                      <div className="text-sm font-medium">{benchmark.metric}</div>
                    </div>
                    <div>
                      <Label>Value</Label>
                      <div className="text-sm font-medium">{benchmark.value} {benchmark.unit}</div>
                    </div>
                    <div>
                      <Label>Industry Average</Label>
                      <div className="text-sm font-medium">{benchmark.industryAverage} {benchmark.unit}</div>
                    </div>
                    <div>
                      <Label>Percentile</Label>
                      <div className="text-sm font-medium">{benchmark.percentile}%</div>
                    </div>
                    <div>
                      <Label>Period</Label>
                      <div className="text-sm font-medium">{benchmark.period}</div>
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

export default EnergyBenchmarkComponent; 