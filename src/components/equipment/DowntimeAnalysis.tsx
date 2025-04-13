import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { equipmentService } from '@/services/equipmentService';
import { DowntimeRecord } from '@/types/equipment';

export const DowntimeAnalysisComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [downtimes, setDowntimes] = useState<DowntimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDowntimes = async () => {
      try {
        if (!id) return;
        const data = await equipmentService.getDowntimeRecords(id);
        setDowntimes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch downtime records');
      } finally {
        setLoading(false);
      }
    };

    fetchDowntimes();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Downtime Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {downtimes.map((downtime) => (
              <Card key={downtime.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Time</Label>
                      <div className="text-sm font-medium">
                        {new Date(downtime.startTime).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <div className="text-sm font-medium">
                        {new Date(downtime.endTime).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <Label>Duration (hours)</Label>
                      <div className="text-sm font-medium">{downtime.duration}</div>
                    </div>
                    <div>
                      <Label>Reason</Label>
                      <div className="text-sm font-medium">{downtime.reason}</div>
                    </div>
                    <div>
                      <Label>Impact</Label>
                      <div className="text-sm font-medium">{downtime.impact}</div>
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