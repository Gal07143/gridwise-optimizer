
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { equipmentService } from '@/services/equipmentService';
import { AutomatedReport } from '@/types/equipment';

const AutomatedReportComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reports, setReports] = useState<AutomatedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!id) return;
        const data = await equipmentService.getAutomatedReports();
        setReports(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch automated reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [id]);

  const handleCreateReport = async (type: string) => {
    try {
      if (!id) return;
      // Add required properties for AutomatedReport creation
      await equipmentService.createAutomatedReport({
        equipmentId: id,
        reportType: type,
        schedule: 'monthly', // Default value
        parameters: {} // Empty parameters object
      });

      const data = await equipmentService.getAutomatedReports();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create report');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Automated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Report Type</Label>
                      <div className="text-sm font-medium">{report.reportType}</div>
                    </div>
                    <div>
                      <Label>Schedule</Label>
                      <div className="text-sm font-medium">{report.schedule}</div>
                    </div>
                    <div>
                      <Label>Last Generated</Label>
                      <div className="text-sm font-medium">
                        {new Date(report.lastGenerated).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="text-sm font-medium">{report.status}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => handleCreateReport(report.reportType)}
                    >
                      Generate Now
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

export default AutomatedReportComponent;
