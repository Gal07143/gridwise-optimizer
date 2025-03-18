
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Battery, 
  BatteryCharging, 
  Cloud, 
  PlugZap, 
  Sun, 
  Wind, 
  AlertTriangle, 
  Activity, 
  Plus,
  Trash2,
  Edit,
  MoreHorizontal,
  Search,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import DashboardCard from '@/components/dashboard/DashboardCard';
import GlassPanel from '@/components/ui/GlassPanel';
import LiveChart from '@/components/dashboard/LiveChart';
import { getAllDevices, getDeviceById, deleteDevice } from '@/services/deviceService';
import { getDeviceReadings } from '@/services/devices/readingsService';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import SiteSelector from '@/components/sites/SiteSelector';
import { useSite } from '@/contexts/SiteContext';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const DeviceTypeIcons: Record<DeviceType | string, React.ReactNode> = {
  solar: <Sun size={20} />,
  wind: <Wind size={20} />,
  battery: <Battery size={20} />,
  grid: <Cloud size={20} />,
  load: <Activity size={20} />,
  ev_charger: <PlugZap size={20} />
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-green-500';
    case 'offline': return 'bg-gray-500';
    case 'maintenance': return 'bg-amber-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

interface DeviceFilterOptions {
  status?: DeviceStatus | null;
  type?: DeviceType | null;
  search: string;
}

const ITEMS_PER_PAGE = 10;

const Devices = () => {
  const navigate = useNavigate();
  const { currentSite } = useSite();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  const [filters, setFilters] = useState<DeviceFilterOptions>({
    status: null,
    type: null,
    search: '',
  });
  
  const {
    data: devices = [],
    isLoading: isLoadingDevices,
    refetch: refetchDevices
  } = useQuery({
    queryKey: ['devices', currentSite?.id, filters, currentPage],
    queryFn: () => getAllDevices({
      siteId: currentSite?.id,
      page: currentPage,
      pageSize: ITEMS_PER_PAGE,
      status: filters.status || undefined,
      type: filters.type || undefined,
      search: filters.search || undefined,
    }),
    enabled: !!currentSite
  });
  
  const { data: totalDevices = 0 } = useQuery({
    queryKey: ['deviceCount', currentSite?.id, filters],
    queryFn: () => getDeviceCount({
      siteId: currentSite?.id,
      status: filters.status || undefined,
      type: filters.type || undefined,
      search: filters.search || undefined,
    }),
    enabled: !!currentSite
  });
  
  const { 
    data: selectedDevice,
    isLoading: isLoadingDevice
  } = useQuery({
    queryKey: ['device', selectedDeviceId],
    queryFn: () => selectedDeviceId ? getDeviceById(selectedDeviceId) : null,
    enabled: !!selectedDeviceId
  });
  
  const { 
    data: deviceReadings = [],
    isLoading: isLoadingReadings
  } = useQuery({
    queryKey: ['deviceReadings', selectedDeviceId],
    queryFn: () => selectedDeviceId ? getDeviceReadings(selectedDeviceId) : [],
    enabled: !!selectedDeviceId
  });
  
  useEffect(() => {
    if (!selectedDeviceId && devices.length > 0) {
      setSelectedDeviceId(devices[0].id);
    }
  }, [devices, selectedDeviceId]);
  
  const chartData = deviceReadings.map(reading => ({
    time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: reading.power
  }));

  const handleAddDevice = () => {
    navigate('/devices/add');
  };

  const handleEditDevice = (deviceId: string) => {
    navigate(`/devices/edit/${deviceId}`);
  };

  const handleDeleteConfirm = async () => {
    if (!deviceToDelete) return;
    
    try {
      const success = await deleteDevice(deviceToDelete);
      
      if (success) {
        toast.success("Device deleted successfully");
        refetchDevices();
        
        // If we deleted the selected device, select another one
        if (deviceToDelete === selectedDeviceId) {
          const remainingDevices = devices.filter(d => d.id !== deviceToDelete);
          setSelectedDeviceId(remainingDevices.length > 0 ? remainingDevices[0].id : null);
        }
      } else {
        toast.error("Failed to delete device");
      }
    } catch (error) {
      console.error("Error deleting device:", error);
      toast.error("An error occurred while deleting the device");
    } finally {
      setDeleteDialogOpen(false);
      setDeviceToDelete(null);
    }
  };

  const openDeleteDialog = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeviceToDelete(deviceId);
    setDeleteDialogOpen(true);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setCurrentPage(0); // Reset to first page when search changes
  };
  
  const clearFilters = () => {
    setFilters({ status: null, type: null, search: '' });
    setCurrentPage(0);
  };
  
  const totalPages = Math.ceil(totalDevices / ITEMS_PER_PAGE);
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">Energy Devices</h1>
                <SiteSelector />
              </div>
              <p className="text-muted-foreground mt-1">
                {currentSite 
                  ? `Monitor and manage devices at ${currentSite.name}`
                  : 'Monitor and manage all connected energy devices'}
              </p>
            </div>
            <Button 
              onClick={handleAddDevice}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add Device</span>
            </Button>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
                className="pl-8"
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter size={16} />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem disabled className="text-xs font-medium text-muted-foreground">
                    Device Status
                  </DropdownMenuItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === 'online'}
                    onCheckedChange={() => setFilters(prev => ({
                      ...prev,
                      status: prev.status === 'online' ? null : 'online'
                    }))}
                  >
                    Online
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === 'offline'}
                    onCheckedChange={() => setFilters(prev => ({
                      ...prev,
                      status: prev.status === 'offline' ? null : 'offline'
                    }))}
                  >
                    Offline
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === 'maintenance'}
                    onCheckedChange={() => setFilters(prev => ({
                      ...prev,
                      status: prev.status === 'maintenance' ? null : 'maintenance'
                    }))}
                  >
                    Maintenance
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status === 'error'}
                    onCheckedChange={() => setFilters(prev => ({
                      ...prev,
                      status: prev.status === 'error' ? null : 'error'
                    }))}
                  >
                    Error
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem disabled className="text-xs font-medium text-muted-foreground">
                    Device Type
                  </DropdownMenuItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.type === 'solar'}
                    onCheckedChange={() => setFilters(prev => ({
                      ...prev,
                      type: prev.type === 'solar' ? null : 'solar'
                    }))}
                  >
                    Solar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.type === 'wind'}
                    onCheckedChange={() => setFilters(prev => ({
                      ...prev,
                      type: prev.type === 'wind' ? null : 'wind'
                    }))}
                  >
                    Wind
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.type === 'battery'}
                    onCheckedChange={() => setFilters(prev => ({
                      ...prev,
                      type: prev.type === 'battery' ? null : 'battery'
                    }))}
                  >
                    Battery
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.type === 'grid'}
                    onCheckedChange={() => setFilters(prev => ({
                      ...prev,
                      type: prev.type === 'grid' ? null : 'grid'
                    }))}
                  >
                    Grid
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={clearFilters}>
                    Clear All Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal size={16} />
                    <span className="hidden sm:inline">Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Name (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Name (Z-A)
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Status
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Type
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Recently Added
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <GlassPanel className="p-2 space-y-2 h-full overflow-auto">
                <div className="p-2 font-medium text-sm flex justify-between items-center">
                  <span>All Devices</span>
                  {(filters.status || filters.type || filters.search) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2">
                      Clear Filters
                    </Button>
                  )}
                </div>
                
                {isLoadingDevices ? (
                  <div className="p-4 text-center text-muted-foreground">Loading devices...</div>
                ) : devices.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    {filters.status || filters.type || filters.search 
                      ? "No devices match your filters"
                      : "No devices found"}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {devices.map(device => (
                      <div
                        key={device.id}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${selectedDeviceId === device.id ? 'bg-accent/50' : 'hover:bg-secondary/30'}`}
                        onClick={() => setSelectedDeviceId(device.id)}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="text-muted-foreground">
                            {DeviceTypeIcons[device.type] || <AlertTriangle size={20} />}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm truncate">{device.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{device.location}</div>
                          </div>
                          <div className={`rounded-full h-2.5 w-2.5 ${getStatusColor(device.status)}`}></div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEditDevice(device.id);
                            }}>
                              <Edit size={16} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => openDeleteDialog(device.id, e)}
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
                
                {totalPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                          disabled={currentPage === 0}
                        />
                      </PaginationItem>
                      
                      {/* First page */}
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationLink onClick={() => setCurrentPage(0)}>
                            1
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      
                      {/* Ellipsis if needed */}
                      {currentPage > 2 && (
                        <PaginationItem>
                          <span className="px-2.5">...</span>
                        </PaginationItem>
                      )}
                      
                      {/* Current page - 1 if applicable */}
                      {currentPage > 0 && (
                        <PaginationItem>
                          <PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>
                            {currentPage}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      
                      {/* Current page */}
                      <PaginationItem>
                        <PaginationLink isActive>
                          {currentPage + 1}
                        </PaginationLink>
                      </PaginationItem>
                      
                      {/* Current page + 1 if applicable */}
                      {currentPage < totalPages - 1 && (
                        <PaginationItem>
                          <PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>
                            {currentPage + 2}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      
                      {/* Ellipsis if needed */}
                      {currentPage < totalPages - 3 && (
                        <PaginationItem>
                          <span className="px-2.5">...</span>
                        </PaginationItem>
                      )}
                      
                      {/* Last page */}
                      {currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationLink onClick={() => setCurrentPage(totalPages - 1)}>
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                          disabled={currentPage >= totalPages - 1}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </GlassPanel>
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              {selectedDevice ? (
                <>
                  <GlassPanel className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <div className="text-primary">
                            {DeviceTypeIcons[selectedDevice.type] || <AlertTriangle size={24} />}
                          </div>
                          <h2 className="text-xl font-semibold">{selectedDevice.name}</h2>
                          <Badge variant={selectedDevice.status === 'online' ? 'default' : 'destructive'} className="ml-2">
                            {selectedDevice.status.charAt(0).toUpperCase() + selectedDevice.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="mt-1 text-muted-foreground">{selectedDevice.location}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditDevice(selectedDevice.id)}
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={(e) => openDeleteDialog(selectedDevice.id, e)}
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <DeviceStatusCard 
                        title="Capacity" 
                        value={`${selectedDevice.capacity} ${selectedDevice.type === 'battery' ? 'kWh' : 'kW'}`} 
                        icon={<Activity size={18} />}
                      />
                      <DeviceStatusCard 
                        title="Firmware" 
                        value={selectedDevice.firmware} 
                        icon={<Activity size={18} />}
                      />
                      <DeviceStatusCard 
                        title="Last Updated" 
                        value={selectedDevice?.last_updated ? new Date(selectedDevice.last_updated).toLocaleString() : 'Unknown'} 
                        icon={<Activity size={18} />}
                      />
                    </div>
                  </GlassPanel>
                  
                  <DashboardCard title="Power Output" icon={<BatteryCharging size={18} />}>
                    <LiveChart
                      data={chartData}
                      height={250}
                      color={selectedDevice.type === 'solar' ? 'rgba(45, 211, 111, 1)' : 
                             selectedDevice.type === 'wind' ? 'rgba(4, 150, 255, 1)' :
                             selectedDevice.type === 'battery' ? 'rgba(255, 196, 9, 1)' : 
                             'rgba(122, 90, 248, 1)'}
                      type="area"
                      gradientFrom={selectedDevice.type === 'solar' ? 'rgba(45, 211, 111, 0.5)' : 
                                   selectedDevice.type === 'wind' ? 'rgba(4, 150, 255, 0.5)' :
                                   selectedDevice.type === 'battery' ? 'rgba(255, 196, 9, 0.5)' : 
                                   'rgba(122, 90, 248, 0.5)'}
                      gradientTo={selectedDevice.type === 'solar' ? 'rgba(45, 211, 111, 0)' : 
                                 selectedDevice.type === 'wind' ? 'rgba(4, 150, 255, 0)' :
                                 selectedDevice.type === 'battery' ? 'rgba(255, 196, 9, 0)' : 
                                 'rgba(122, 90, 248, 0)'}
                      yAxisLabel="Power (kW)"
                    />
                  </DashboardCard>
                  
                  {selectedDevice.metrics && (
                    <DashboardCard title="Device Metrics" icon={<Activity size={18} />}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(selectedDevice.metrics).map(([key, value]) => (
                          <DeviceMetricCard key={key} name={key} value={value} />
                        ))}
                      </div>
                    </DashboardCard>
                  )}
                  
                  <DashboardCard title="Maintenance Information" icon={<AlertTriangle size={18} />}>
                    <div className="space-y-4">
                      <div className="flex justify-between p-3 bg-background/50 rounded-md">
                        <div className="text-sm">Installation Date</div>
                        <div className="text-sm font-medium">Jan 15, 2023</div>
                      </div>
                      <div className="flex justify-between p-3 bg-background/50 rounded-md">
                        <div className="text-sm">Last Inspection</div>
                        <div className="text-sm font-medium">Mar 22, 2023</div>
                      </div>
                      <div className="flex justify-between p-3 bg-background/50 rounded-md">
                        <div className="text-sm">Next Maintenance Due</div>
                        <div className="text-sm font-medium">Sep 15, 2023</div>
                      </div>
                      <div className="flex justify-between p-3 bg-background/50 rounded-md">
                        <div className="text-sm">Warranty Status</div>
                        <div className="text-sm font-medium">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </DashboardCard>
                </>
              ) : (
                <GlassPanel className="p-6 flex items-center justify-center h-64">
                  <div className="text-center text-muted-foreground">
                    {isLoadingDevice ? 'Loading device details...' : 'Select a device to view details'}
                  </div>
                </GlassPanel>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Device</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this device? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const DeviceStatusCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => {
  return (
    <GlassPanel className="p-4 h-full" intensity="low">
      <div className="flex items-center space-x-2 mb-2">
        <div className="text-muted-foreground">{icon}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
      <div className="text-lg font-medium">{value}</div>
    </GlassPanel>
  );
};

const DeviceMetricCard = ({ name, value }: { name: string, value: number }) => {
  const formatMetricName = (name: string) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  const getMetricWithUnit = (name: string, value: number) => {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('temperature')) return `${value.toFixed(1)} °C`;
    if (nameLower.includes('voltage')) return `${value.toFixed(1)} V`;
    if (nameLower.includes('current')) return `${value.toFixed(1)} A`;
    if (nameLower.includes('power')) return `${value.toFixed(1)} kW`;
    if (nameLower.includes('energy') || nameLower.includes('production')) return `${value.toFixed(1)} kWh`;
    if (nameLower.includes('efficiency') || nameLower.includes('charge')) return `${value.toFixed(1)} %`;
    if (nameLower.includes('frequency')) return `${value.toFixed(2)} Hz`;
    if (nameLower.includes('speed')) return nameLower.includes('wind') ? `${value.toFixed(1)} m/s` : `${value.toFixed(0)} rpm`;
    
    return value.toString();
  };
  
  return (
    <div className="p-3 bg-background/30 rounded-md">
      <div className="text-xs text-muted-foreground mb-1">{formatMetricName(name)}</div>
      <div className="text-base font-medium">{getMetricWithUnit(name, value)}</div>
    </div>
  );
};

export default Devices;
