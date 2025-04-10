
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Plug, 
  Battery, 
  RadioTower,
  Activity,
  ServerOff
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';
import { getAllDevices, createDevice, updateDevice, deleteDevice } from '@/services/devices';
import { PageHeader } from "@/components/ui/page-header";

const DeviceManagement = () => {
  const { toast } = useToast();
  const [devices, setDevices] = useState<EnergyDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState<Partial<EnergyDevice>>({
    name: '',
    type: 'battery',
    status: 'offline',
    capacity: 0,
    location: '',
    description: ''
  });
  
  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const fetchedDevices = await getAllDevices();
      setDevices(fetchedDevices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast({
        title: "Error fetching devices",
        description: "Failed to retrieve device data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    
    // Set up real-time subscriptions for device updates
    const channel = supabase
      .channel('public:devices')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'devices' 
      }, payload => {
        // Handle device updates
        if (payload.eventType === 'INSERT') {
          setDevices(prev => [...prev, payload.new as EnergyDevice]);
        } else if (payload.eventType === 'UPDATE') {
          setDevices(prev => prev.map(device => 
            device.id === payload.new.id ? payload.new as EnergyDevice : device
          ));
        } else if (payload.eventType === 'DELETE') {
          setDevices(prev => prev.filter(device => device.id !== payload.old.id));
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'capacity' ? parseFloat(value) : value 
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      
      if (formData.id) {
        // Update existing device
        result = await updateDevice(formData.id, formData);
        if (result) {
          toast({
            title: "Device updated",
            description: `${formData.name} has been updated successfully.`
          });
        }
      } else {
        // Create new device
        result = await createDevice(formData as Omit<EnergyDevice, 'id' | 'created_at'>);
        if (result) {
          toast({
            title: "Device created",
            description: `${formData.name} has been added successfully.`
          });
        }
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchDevices();
    } catch (error) {
      console.error('Error saving device:', error);
      toast({
        title: "Error saving device",
        description: "There was a problem saving the device. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (device: EnergyDevice) => {
    setFormData({
      id: device.id,
      name: device.name,
      type: device.type,
      status: device.status,
      capacity: device.capacity,
      location: device.location,
      description: device.description,
      firmware: device.firmware
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteDevice(id);
        toast({
          title: "Device deleted",
          description: `${name} has been removed successfully.`
        });
        fetchDevices();
      } catch (error) {
        console.error('Error deleting device:', error);
        toast({
          title: "Error deleting device",
          description: "There was a problem deleting the device. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'battery',
      status: 'offline',
      capacity: 0,
      location: '',
      description: ''
    });
  };

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'battery':
        return <Battery className="size-4" />;
      case 'inverter':
        return <Plug className="size-4" />;
      case 'ev_charger':
        return <Plug className="size-4" />;
      case 'meter':
        return <Activity className="size-4" />;
      default:
        return <RadioTower className="size-4" />;
    }
  };

  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case 'online':
        return "bg-green-500 border-green-600";
      case 'offline':
        return "bg-gray-500 border-gray-600";
      case 'error':
        return "bg-red-500 border-red-600";
      case 'warning':
        return "bg-yellow-500 border-yellow-600";
      case 'maintenance':
        return "bg-blue-500 border-blue-600";
      default:
        return "bg-gray-500 border-gray-600";
    }
  };

  const filteredDevices = devices.filter(device => {
    // Filter by tab selection
    if (activeTab !== 'all' && device.type !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !device.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !device.location?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader 
        title="Device Management" 
        description="Add, configure and monitor all energy devices"
        actions={
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        }
      />
      
      <div className="flex items-center justify-between">
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-2/3"
        >
          <TabsList>
            <TabsTrigger value="all">All Devices</TabsTrigger>
            <TabsTrigger value="battery">Batteries</TabsTrigger>
            <TabsTrigger value="inverter">Inverters</TabsTrigger>
            <TabsTrigger value="ev_charger">EV Chargers</TabsTrigger>
            <TabsTrigger value="meter">Meters</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" onClick={fetchDevices}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Devices ({filteredDevices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ServerOff className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No devices found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try a different search term" : "Get started by adding your first device"}
              </p>
              {!searchQuery && (
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Device
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(device.status)}`}></div>
                        <span className="capitalize">{device.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getDeviceIcon(device.type)}
                        <span className="capitalize">{device.type.replace('_', ' ')}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{device.location}</TableCell>
                    <TableCell>{device.capacity} kW</TableCell>
                    <TableCell>
                      {device.last_updated 
                        ? new Date(device.last_updated).toLocaleString() 
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(device)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(device.id, device.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Device Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Edit Device' : 'Add New Device'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Device Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter device name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Device Type</Label>
                <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="battery">Battery</SelectItem>
                    <SelectItem value="inverter">Inverter</SelectItem>
                    <SelectItem value="ev_charger">EV Charger</SelectItem>
                    <SelectItem value="meter">Meter</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (kW)</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  step="0.01"
                  placeholder="Enter capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firmware">Firmware Version</Label>
              <Input
                id="firmware"
                name="firmware"
                placeholder="Enter firmware version"
                value={formData.firmware}
                onChange={handleInputChange}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {formData.id ? 'Update Device' : 'Add Device'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeviceManagement;
