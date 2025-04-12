import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronDown,
  FolderPlus,
  Group,
  MoreHorizontal,
  Power,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { Device } from '@/types/device';
import { toast } from 'sonner';

interface DeviceGroup {
  id: string;
  name: string;
  description?: string;
  devices: string[]; // Array of device IDs
}

interface DeviceManagementProps {
  devices: Device[];
  onUpdateDevices: (devices: Device[]) => void;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({
  devices,
  onUpdateDevices,
}) => {
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [groups, setGroups] = useState<DeviceGroup[]>([]);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDevices(new Set(devices.map(d => d.id)));
    } else {
      setSelectedDevices(new Set());
    }
  };

  const handleSelectDevice = (deviceId: string, checked: boolean) => {
    const newSelection = new Set(selectedDevices);
    if (checked) {
      newSelection.add(deviceId);
    } else {
      newSelection.delete(deviceId);
    }
    setSelectedDevices(newSelection);
  };

  const handleBatchOperation = async (operation: 'power' | 'refresh' | 'delete') => {
    const selectedDevicesList = Array.from(selectedDevices);
    
    try {
      switch (operation) {
        case 'power':
          toast.promise(
            Promise.all(selectedDevicesList.map(async (id) => {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              const device = devices.find(d => d.id === id);
              if (device) {
                device.status = device.status === 'online' ? 'offline' : 'online';
              }
            })),
            {
              loading: 'Updating device power states...',
              success: 'Power states updated successfully',
              error: 'Failed to update power states',
            }
          );
          break;

        case 'refresh':
          toast.promise(
            Promise.all(selectedDevicesList.map(async (id) => {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              const device = devices.find(d => d.id === id);
              if (device) {
                device.last_updated = new Date().toISOString();
              }
            })),
            {
              loading: 'Refreshing devices...',
              success: 'Devices refreshed successfully',
              error: 'Failed to refresh devices',
            }
          );
          break;

        case 'delete':
          toast.promise(
            (async () => {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              const remainingDevices = devices.filter(d => !selectedDevices.has(d.id));
              onUpdateDevices(remainingDevices);
              setSelectedDevices(new Set());
            })(),
            {
              loading: 'Deleting devices...',
              success: 'Devices deleted successfully',
              error: 'Failed to delete devices',
            }
          );
          break;
      }
    } catch (error) {
      console.error('Batch operation failed:', error);
      toast.error('Operation failed. Please try again.');
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    try {
      const newGroup: DeviceGroup = {
        id: `group-${Date.now()}`,
        name: newGroupName.trim(),
        description: newGroupDescription.trim(),
        devices: Array.from(selectedDevices),
      };

      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setNewGroupDescription('');
      setIsCreateGroupOpen(false);
      toast.success('Group created successfully');
    } catch (error) {
      console.error('Failed to create group:', error);
      toast.error('Failed to create group');
    }
  };

  return (
    <div className="space-y-4">
      {/* Batch Operations */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedDevices.size === devices.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedDevices.size} device(s) selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedDevices.size > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBatchOperation('power')}
              >
                <Power className="h-4 w-4 mr-2" />
                Toggle Power
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBatchOperation('refresh')}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Group className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Device Group</DialogTitle>
                    <DialogDescription>
                      Create a new group with the selected devices
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Group Name</label>
                      <Input
                        placeholder="Enter group name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        placeholder="Enter description (optional)"
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateGroupOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateGroup}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Create Group
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBatchOperation('delete')}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Device Groups */}
      {groups.length > 0 && (
        <div className="rounded-md border">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Device Groups</h3>
            <div className="mt-2 space-y-2">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                >
                  <div>
                    <h4 className="font-medium">{group.name}</h4>
                    {group.description && (
                      <p className="text-sm text-muted-foreground">
                        {group.description}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {group.devices.length} devices
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Devices</DropdownMenuItem>
                      <DropdownMenuItem>Edit Group</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Devices Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedDevices.size === devices.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedDevices.has(device.id)}
                    onCheckedChange={(checked) =>
                      handleSelectDevice(device.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.status}</TableCell>
                <TableCell>{device.location}</TableCell>
                <TableCell>
                  {new Date(device.last_updated || '').toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Device</DropdownMenuItem>
                      <DropdownMenuItem>View History</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete Device
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DeviceManagement; 