import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronDown, ChevronUp, ExternalLink, Package, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DeviceModel } from '@/types/device';

export interface DeviceModelsCardProps {
  deviceModels: DeviceModel[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  isLoading: boolean;
}

const DeviceModelsCard: React.FC<DeviceModelsCardProps> = ({
  deviceModels,
  sortField,
  sortDirection,
  onSort,
  isLoading
}) => {
  const renderSortArrow = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Device Models</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : deviceModels.length === 0 ? (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold">No device models found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No device models match your criteria
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => onSort('manufacturer')}
                  >
                    Manufacturer {renderSortArrow('manufacturer')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => onSort('name')}
                  >
                    Model {renderSortArrow('name')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => onSort('device_type')}
                  >
                    Type {renderSortArrow('device_type')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => onSort('support_level')}
                  >
                    Support {renderSortArrow('support_level')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deviceModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell>{model.manufacturer}</TableCell>
                    <TableCell>{model.name}</TableCell>
                    <TableCell>
                      {model.device_type.charAt(0).toUpperCase() + model.device_type.slice(1)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.location.href = `/devices/model/${model.id}`}
                        className="text-primary"
                      >
                        View <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceModelsCard;
