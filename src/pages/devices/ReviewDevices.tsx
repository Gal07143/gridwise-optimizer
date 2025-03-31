
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash, Check, X, Eye, Filter, Search, Download } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { getDevices } from '@/services/deviceService';

const ReviewDevices = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const { data: devices = [], isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching devices:', error);
        toast.error('Failed to load devices');
      }
    }
  });
  
  // Filter devices based on search query and status filter
  const filteredDevices = devices.filter(device => {
    // Apply status filter
    if (statusFilter && device.status !== statusFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        device.name.toLowerCase().includes(query) ||
        device.type.toLowerCase().includes(query) ||
        (device.location && device.location.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  const handleApprove = (deviceId: string) => {
    // In a real application, this would call an API
    toast.success(`Device ${deviceId} approved`);
  };
  
  const handleReject = (deviceId: string) => {
    // In a real application, this would call an API
    toast.error(`Device ${deviceId} rejected`);
  };
  
  const handleEdit = (deviceId: string) => {
    navigate(`/devices/${deviceId}/edit`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="text-gray-500">Offline</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge className="bg-blue-500">Pending Review</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Review Devices</h1>
            <p className="text-muted-foreground">Review and manage device approvals</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, type, or location..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {statusFilter ? `Status: ${statusFilter}` : 'Filter by Status'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('online')}>
                Online
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('offline')}>
                Offline
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('warning')}>
                Warning
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('error')}>
                Error
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                Pending Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Device Review Queue</CardTitle>
            <CardDescription>
              {filteredDevices.length} {filteredDevices.length === 1 ? 'device' : 'devices'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">Failed to load devices</p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : filteredDevices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Firmware</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.name}</TableCell>
                      <TableCell>{device.type}</TableCell>
                      <TableCell>{getStatusBadge(device.status)}</TableCell>
                      <TableCell>{device.location || 'N/A'}</TableCell>
                      <TableCell>{device.capacity} {device.type === 'battery' ? 'kWh' : 'kW'}</TableCell>
                      <TableCell>{device.firmware || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/devices/${device.id}`)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(device.id)}
                            title="Edit Device"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApprove(device.id)}
                            className="text-green-500"
                            title="Approve Device"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReject(device.id)}
                            className="text-red-500"
                            title="Reject Device"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg font-medium mb-2">No devices found</p>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter 
                    ? "No devices match your current filters"
                    : "There are no devices needing review at this time"}
                </p>
                {(searchQuery || statusFilter) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ReviewDevices;
