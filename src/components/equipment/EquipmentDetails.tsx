import React, { useEffect } from 'react';
import { useEquipment } from '../../contexts/EquipmentContext';
import { Equipment } from '../../types/equipment';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const getStatusIcon = (status: Equipment['status']) => {
  switch (status) {
    case 'operational':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'offline':
      return <XCircle className="w-5 h-5 text-gray-700" />;
    case 'maintenance':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'fault':
    case 'faulty':
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    default:
      return <XCircle className="w-5 h-5 text-gray-500" />;
  }
};

const EquipmentDetails: React.FC<{ equipmentId: string }> = ({ equipmentId }) => {
  const {
    selectedEquipment,
    loading,
    error,
    metrics,
    parameters,
    alarms,
    maintenance,
    selectEquipment,
    fetchMetrics,
    fetchParameters,
    fetchAlarms,
    fetchMaintenance,
  } = useEquipment();

  useEffect(() => {
    selectEquipment(equipmentId);
  }, [equipmentId, selectEquipment]);

  useEffect(() => {
    if (equipmentId) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Last 7 days
      fetchMetrics(equipmentId, startDate, endDate);
      fetchParameters(equipmentId);
      fetchAlarms(equipmentId);
      fetchMaintenance(equipmentId);
    }
  }, [equipmentId, fetchMetrics, fetchParameters, fetchAlarms, fetchMaintenance]);

  const handleSeverityDisplay = (severity: string) => {
    if (severity === 'critical') return 'text-red-500';
    if (severity === 'error' || severity === 'high') return 'text-orange-500';
    if (severity === 'warning' || severity === 'medium') return 'text-yellow-500';
    return 'text-blue-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!selectedEquipment) {
    return (
      <div className="p-4 text-gray-500">
        No equipment selected
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            {getStatusIcon(selectedEquipment.status)}
            <CardTitle className="text-2xl font-bold">{selectedEquipment.name}</CardTitle>
          </div>
          <Badge variant={selectedEquipment.isOnline ? 'default' : 'secondary'}>
            {selectedEquipment.isOnline ? 'Online' : 'Offline'}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Basic Information</h3>
              <div className="space-y-1">
                <p><span className="text-gray-500">Type:</span> {selectedEquipment.type}</p>
                {selectedEquipment.location && (
                  <p><span className="text-gray-500">Location:</span> {selectedEquipment.location}</p>
                )}
                {selectedEquipment.manufacturer && (
                  <p><span className="text-gray-500">Manufacturer:</span> {selectedEquipment.manufacturer}</p>
                )}
                {selectedEquipment.model && (
                  <p><span className="text-gray-500">Model:</span> {selectedEquipment.model}</p>
                )}
                {selectedEquipment.serial_number && (
                  <p><span className="text-gray-500">Serial Number:</span> {selectedEquipment.serial_number}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Performance Metrics</h3>
              <div className="space-y-1">
                {selectedEquipment.efficiency !== undefined && (
                  <p><span className="text-gray-500">Efficiency:</span> {selectedEquipment.efficiency}%</p>
                )}
                {selectedEquipment.load !== undefined && (
                  <p><span className="text-gray-500">Load:</span> {selectedEquipment.load}%</p>
                )}
                {selectedEquipment.energyConsumption !== undefined && (
                  <p><span className="text-gray-500">Energy Consumption:</span> {selectedEquipment.energyConsumption} kWh</p>
                )}
                {selectedEquipment.carbonEmissions !== undefined && (
                  <p><span className="text-gray-500">Carbon Emissions:</span> {selectedEquipment.carbonEmissions} kg CO2</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Maintenance Information</h3>
              <div className="space-y-1">
                {selectedEquipment.installation_date && (
                  <p><span className="text-gray-500">Installation Date:</span> {new Date(selectedEquipment.installation_date).toLocaleDateString()}</p>
                )}
                {selectedEquipment.last_maintenance_date && (
                  <p><span className="text-gray-500">Last Maintenance:</span> {new Date(selectedEquipment.last_maintenance_date).toLocaleDateString()}</p>
                )}
                {selectedEquipment.nextMaintenanceDate && (
                  <p><span className="text-gray-500">Next Maintenance:</span> {new Date(selectedEquipment.nextMaintenanceDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="parameters">
        <TabsList>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="alarms">Alarms</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parameters.map((param) => (
                  <div key={param.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{param.name}</h4>
                    <p className="text-2xl font-bold">{param.value} {param.unit}</p>
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(param.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="efficiency" stroke="#8884d8" />
                    <Line type="monotone" dataKey="load" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="energyConsumption" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alarms">
          <Card>
            <CardHeader>
              <CardTitle>Active Alarms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alarms.map((alarm) => (
                  <div key={alarm.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className={`w-5 h-5 ${handleSeverityDisplay(alarm.severity)}`} />
                      <div>
                        <p className="font-medium">{alarm.message}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(alarm.timestamp || alarm.triggered_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!alarm.acknowledged && !alarm.acknowledged_by && (
                      <Button variant="outline" size="sm">
                        Acknowledge
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenance.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{record.type || record.maintenance_type} Maintenance</h4>
                        <p className="text-sm text-gray-500">{record.description}</p>
                      </div>
                      <Badge variant={
                        record.status === 'completed' ? 'default' :
                        record.status === 'in-progress' || record.status === 'in_progress' ? 'secondary' :
                        record.status === 'overdue' ? 'destructive' :
                        'outline'
                      }>
                        {record.status}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Scheduled: {new Date(record.scheduledDate || record.scheduled_date).toLocaleDateString()}</p>
                      {(record.completedDate || record.completed_date) && (
                        <p>Completed: {new Date(record.completedDate || record.completed_date).toLocaleDateString()}</p>
                      )}
                      {(record.assignedTo || record.technician) && (
                        <p>Assigned to: {record.assignedTo || record.technician}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentDetails;
