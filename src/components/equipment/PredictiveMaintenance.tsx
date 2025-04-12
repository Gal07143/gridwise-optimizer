import React, { useEffect } from 'react';
import { useEquipment } from '@/contexts/EquipmentContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

interface PredictiveMaintenanceProps {
  equipmentId: string;
}

export const PredictiveMaintenance: React.FC<PredictiveMaintenanceProps> = ({
  equipmentId,
}) => {
  const {
    predictiveMaintenance,
    performanceScores,
    maintenanceCosts,
    fetchPredictiveMaintenance,
    fetchPerformanceScores,
    fetchMaintenanceCosts,
    loading,
    error,
  } = useEquipment();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchPredictiveMaintenance(equipmentId),
        fetchPerformanceScores(equipmentId),
        fetchMaintenanceCosts(equipmentId),
      ]);
    };
    loadData();
  }, [
    equipmentId,
    fetchPredictiveMaintenance,
    fetchPerformanceScores,
    fetchMaintenanceCosts,
  ]);

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: 'Healthy', color: 'bg-green-500' };
    if (score >= 60) return { label: 'Fair', color: 'bg-yellow-500' };
    return { label: 'Poor', color: 'bg-red-500' };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return <div>Loading predictive maintenance data...</div>;
  if (error) return <div>Error loading predictive maintenance data: {error}</div>;

  const latestScore = performanceScores[0];
  const totalMaintenanceCost = maintenanceCosts.reduce(
    (sum, cost) => sum + cost.amount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Overall Health Score</CardTitle>
            <CardDescription>Current equipment performance</CardDescription>
          </CardHeader>
          <CardContent>
            {latestScore && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">
                    {latestScore.overallScore}%
                  </span>
                  <Badge
                    variant="outline"
                    className={getHealthStatus(latestScore.overallScore).color}
                  >
                    {getHealthStatus(latestScore.overallScore).label}
                  </Badge>
                </div>
                <Progress
                  value={latestScore.overallScore}
                  className="h-2"
                />
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Efficiency</span>
                    <span>{latestScore.efficiencyScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reliability</span>
                    <span>{latestScore.reliabilityScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance</span>
                    <span>{latestScore.maintenanceScore}%</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Costs</CardTitle>
            <CardDescription>Total and breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">
              ${totalMaintenanceCost.toFixed(2)}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceCosts.map((cost) => (
                  <TableRow key={cost.id}>
                    <TableCell>{cost.type}</TableCell>
                    <TableCell className="text-right">
                      ${cost.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predicted Issues</CardTitle>
            <CardDescription>Upcoming maintenance needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictiveMaintenance.map((prediction) => (
                <div
                  key={prediction.id}
                  className="border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{prediction.predictedIssue}</h4>
                      <p className="text-sm text-gray-500">
                        {prediction.recommendedAction}
                      </p>
                    </div>
                    <Badge
                      className={getConfidenceColor(prediction.confidence)}
                    >
                      {(prediction.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    Predicted: {format(new Date(prediction.predictionDate), 'PPP')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Factors</CardTitle>
          <CardDescription>Detailed analysis of performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestScore?.factors.map((factor) => (
                <TableRow key={factor.name}>
                  <TableCell>{factor.name}</TableCell>
                  <TableCell>{(factor.weight * 100).toFixed(0)}%</TableCell>
                  <TableCell>
                    <Progress
                      value={factor.score}
                      className="h-2 w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        factor.impact === 'positive'
                          ? 'success'
                          : factor.impact === 'negative'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {factor.impact}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}; 