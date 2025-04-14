
import React from 'react';
import { useEquipment } from '../../contexts/EquipmentContext';
import { Equipment } from '../../types/equipment';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const getStatusColor = (status: Equipment['status']) => {
  switch (status) {
    case 'operational':
      return 'bg-green-500';
    case 'offline':
      return 'bg-gray-700';
    case 'maintenance':
      return 'bg-yellow-500';
    case 'faulty':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const EquipmentList: React.FC = () => {
  const { equipment, loading, error, selectEquipment } = useEquipment();

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {equipment.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">{item.name}</CardTitle>
            <Badge className={getStatusColor(item.status)}>
              {item.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Type</span>
                <span className="text-sm font-medium">{item.type}</span>
              </div>
              {item.location && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="text-sm font-medium">{item.location}</span>
                </div>
              )}
              {item.efficiency !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Efficiency</span>
                  <span className="text-sm font-medium">{item.efficiency}%</span>
                </div>
              )}
              {item.load !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Load</span>
                  <span className="text-sm font-medium">{item.load}%</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <div className="flex items-center space-x-2">
                  <Badge variant={item.isOnline ? 'default' : 'secondary'}>
                    {item.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectEquipment(item.id)}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EquipmentList;
