
import React, { useEffect, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { BMSParameter } from '@/types/equipment';

interface BMSIntegrationProps {
  equipmentId: string;
}

export const BMSIntegration: React.FC<BMSIntegrationProps> = ({ equipmentId }) => {
  const {
    bmsIntegration,
    fetchBMSIntegration,
    updateBMSIntegration,
    loading,
    error,
  } = useEquipment();

  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({
    bmsType: '',
    syncFrequency: 0, // Changed to number
    parameters: [] as BMSParameter[],
  });

  useEffect(() => {
    fetchBMSIntegration(equipmentId);
  }, [equipmentId, fetchBMSIntegration]);

  useEffect(() => {
    if (bmsIntegration) {
      setEditedValues({
        bmsType: bmsIntegration.bmsType,
        syncFrequency: bmsIntegration.syncFrequency, // Already a number
        parameters: bmsIntegration.parameters.map(param => ({
          id: param.id,
          name: param.name,
          bmsId: param.bmsId,
          dataType: param.dataType,
          unit: param.unit,
          mapping: param.mapping,
          status: param.status
        })),
      });
    }
  }, [bmsIntegration]);

  const handleSave = async () => {
    if (bmsIntegration) {
      await updateBMSIntegration(equipmentId, {
        bmsType: editedValues.bmsType,
        syncFrequency: editedValues.syncFrequency, // Already a number
        parameters: editedValues.parameters
      });
      setIsEditing(false);
    }
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'disconnected':
        return 'bg-red-500';
      case 'connecting':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) return <div>Loading BMS integration data...</div>;
  if (error) return <div>Error loading BMS integration data: {error}</div>;
  if (!bmsIntegration) return <div>No BMS integration configured</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>Current BMS connection state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge
                  variant="outline"
                  className={getConnectionStatusColor(bmsIntegration.connectionStatus)}
                >
                  {bmsIntegration.connectionStatus}
                </Badge>
                <div className="mt-2 text-sm text-gray-500">
                  Last Sync: {format(new Date(bmsIntegration.lastSync), 'PPp')}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>BMS Configuration</CardTitle>
            <CardDescription>System settings and sync frequency</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bmsType">BMS Type</Label>
                  <Input
                    id="bmsType"
                    value={editedValues.bmsType}
                    onChange={(e) =>
                      setEditedValues({ ...editedValues, bmsType: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="syncFrequency">Sync Frequency (minutes)</Label>
                  <Input
                    id="syncFrequency"
                    type="number"
                    value={editedValues.syncFrequency}
                    onChange={(e) =>
                      setEditedValues({
                        ...editedValues,
                        syncFrequency: parseInt(e.target.value) || 0, // Convert to number
                      })
                    }
                  />
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>BMS Type:</span>
                  <span className="font-medium">{bmsIntegration.bmsType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sync Frequency:</span>
                  <span className="font-medium">
                    {bmsIntegration.syncFrequency} minutes
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Health</CardTitle>
            <CardDescription>System performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Uptime</span>
                <Badge variant="outline">99.9%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Data Quality</span>
                <Badge variant="outline">98.5%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Response Time</span>
                <Badge variant="outline">120ms</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parameter Mapping</CardTitle>
          <CardDescription>BMS to equipment parameter mappings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter Name</TableHead>
                <TableHead>BMS ID</TableHead>
                <TableHead>Data Type</TableHead>
                <TableHead>Mapping</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bmsIntegration.parameters.map((param: BMSParameter) => (
                <TableRow key={param.id}>
                  <TableCell>{param.name}</TableCell>
                  <TableCell>{param.bmsId}</TableCell>
                  <TableCell>{param.dataType}</TableCell>
                  <TableCell>{typeof param.mapping === 'object' ? JSON.stringify(param.mapping) : String(param.mapping)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        param.status === 'active'
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }
                    >
                      {param.status || 'unknown'}
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

export default BMSIntegration;
