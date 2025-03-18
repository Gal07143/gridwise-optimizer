
import React, { useState } from 'react';
import { 
  CircleDot, 
  Filter, 
  Grid, 
  ListFilter, 
  MonitorSmartphone, 
  MoreHorizontal, 
  Power, 
  RefreshCw, 
  Settings, 
  Zap 
} from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import GlassPanel from '@/components/ui/GlassPanel';

// Mock device data
const devices = [
  {
    id: 'inv-001',
    name: 'Main Inverter',
    type: 'Inverter',
    status: 'online',
    lastUpdated: '2 minutes ago',
    firmwareVersion: 'v2.3.4',
    power: 62.4,
    metrics: {
      efficiency: 97.8,
      temperature: 42.3,
      uptime: '178 days'
    }
  },
  {
    id: 'bat-001',
    name: 'Battery Storage System',
    type: 'Battery',
    status: 'online',
    lastUpdated: '1 minute ago',
    firmwareVersion: 'v4.2.0',
    power: 120.0,
    metrics: {
      stateOfCharge: 68.2,
      temperature: 35.7,
      cycles: 342
    }
  },
  {
    id: 'sol-001',
    name: 'Solar Array A',
    type: 'Solar',
    status: 'online',
    lastUpdated: '3 minutes ago',
    firmwareVersion: 'v1.8.7',
    power: 75.2,
    metrics: {
      efficiency: 98.3,
      temperature: 48.6,
      panels: 42
    }
  },
  {
    id: 'ev-001',
    name: 'EV Charging Station 1',
    type: 'EV Charger',
    status: 'online',
    lastUpdated: '5 minutes ago',
    firmwareVersion: 'v3.0.2',
    power: 22.0,
    metrics: {
      connectedVehicle: 'Tesla Model 3',
      chargingRate: 22,
      sessionTime: '1:24'
    }
  },
  {
    id: 'ev-002',
    name: 'EV Charging Station 2',
    type: 'EV Charger',
    status: 'offline',
    lastUpdated: '16 hours ago',
    firmwareVersion: 'v3.0.2',
    power: 0,
    metrics: {
      connectedVehicle: 'None',
      chargingRate: 0,
      sessionTime: '-'
    }
  },
  {
    id: 'wind-001',
    name: 'Wind Turbine 1',
    type: 'Wind',
    status: 'online',
    lastUpdated: '4 minutes ago',
    firmwareVersion: 'v2.5.1',
    power: 42.8,
    metrics: {
      rotationSpeed: 176,
      windSpeed: 18.4,
      orientation: 'NW'
    }
  },
  {
    id: 'meter-001',
    name: 'Grid Connection Point',
    type: 'Meter',
    status: 'online',
    lastUpdated: '2 minutes ago',
    firmwareVersion: 'v1.2.0',
    power: -32.7,
    metrics: {
      voltage: 242.1,
      frequency: 49.98,
      powerFactor: 0.98
    }
  },
  {
    id: 'hvac-001',
    name: 'HVAC Controller',
    type: 'HVAC',
    status: 'maintenance',
    lastUpdated: '25 minutes ago',
    firmwareVersion: 'v3.6.5',
    power: 18.5,
    metrics: {
      setpoint: 22.5,
      actualTemp: 23.2,
      mode: 'Auto'
    }
  },
];

const Devices = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const filteredDevices = selectedType 
    ? devices.filter(device => device.type === selectedType) 
    : devices;
  
  const deviceTypes = Array.from(new Set(devices.map(device => device.type)));
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-energy-green text-energy-green';
      case 'offline':
        return 'bg-energy-red text-energy-red';
      case 'maintenance':
        return 'bg-energy-orange text-energy-orange';
      default:
        return 'bg-energy-blue text-energy-blue';
    }
  };
  
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'Inverter':
        return <Zap size={18} />;
      case 'Battery':
        return <Power size={18} />;
      case 'Solar':
        return <CircleDot size={18} />;
      case 'EV Charger':
        return <Zap size={18} />;
      case 'Wind':
        return <RefreshCw size={18} />;
      case 'Meter':
        return <MonitorSmartphone size={18} />;
      case 'HVAC':
        return <Settings size={18} />;
      default:
        return <MonitorSmartphone size={18} />;
    }
  };
  
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredDevices.map(device => (
        <GlassPanel 
          key={device.id}
          interactive
          className="flex flex-col h-full animate-slide-up overflow-hidden"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="icon-circle bg-secondary/30 text-foreground">
                {getDeviceIcon(device.type)}
              </div>
              <div>
                <h3 className="font-medium text-sm">{device.name}</h3>
                <div className="flex items-center mt-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full mr-1.5",
                    getStatusColor(device.status)
                  )}></div>
                  <span className="text-xs text-muted-foreground capitalize">{device.status}</span>
                </div>
              </div>
            </div>
            <button className="p-1.5 rounded-full hover:bg-secondary transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
          
          <div className="p-4 flex-1">
            <div className="flex justify-between items-center mb-3">
              <div className="data-pill bg-secondary/50">
                <span>{device.type}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Updated {device.lastUpdated}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-xs text-muted-foreground mb-1">Power</div>
              <div className="text-xl font-semibold">
                {device.power} {device.type === 'Meter' && device.power < 0 ? 'kW (export)' : 'kW'}
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              {Object.entries(device.metrics).map(([key, value]) => (
                <div key={key} className="glass-panel p-2 rounded-lg">
                  <div className="text-xs text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                  <div className="text-sm font-medium">{value}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-secondary/20 p-3 text-xs flex justify-between items-center border-t border-border/30">
            <div className="text-muted-foreground">Firmware: {device.firmwareVersion}</div>
            <button className="text-primary hover:underline">Configure</button>
          </div>
        </GlassPanel>
      ))}
    </div>
  );
  
  const renderListView = () => (
    <div className="glass-panel overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Device</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Power</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Updated</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((device, idx) => (
              <tr 
                key={device.id} 
                className={cn(
                  "transition-colors hover:bg-secondary/20",
                  idx !== filteredDevices.length - 1 && "border-b border-border/30"
                )}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="icon-circle bg-secondary/30 text-foreground mr-2 w-7 h-7">
                      {getDeviceIcon(device.type)}
                    </div>
                    <div className="text-sm font-medium">{device.name}</div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="data-pill bg-secondary/50 text-xs">
                    {device.type}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-2 h-2 rounded-full mr-1.5",
                      getStatusColor(device.status)
                    )}></div>
                    <span className="text-sm capitalize">{device.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {device.power} {device.type === 'Meter' && device.power < 0 ? 'kW (export)' : 'kW'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                  {device.lastUpdated}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                  <button className="text-primary hover:underline mr-3">Configure</button>
                  <button className="icon-circle bg-secondary/50 hover:bg-secondary/80">
                    <MoreHorizontal size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">Devices & Equipment</h1>
            <p className="text-muted-foreground">Manage and monitor all connected devices</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="glass-panel p-1.5 inline-flex rounded-lg">
              <button 
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === 'grid' ? "bg-secondary/80 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                )}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button 
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === 'list' ? "bg-secondary/80 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                )}
                onClick={() => setViewMode('list')}
              >
                <ListFilter size={18} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                className={cn(
                  "data-pill transition-colors",
                  selectedType === null 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setSelectedType(null)}
              >
                All Types
              </button>
              {deviceTypes.map(type => (
                <button 
                  key={type}
                  className={cn(
                    "data-pill transition-colors",
                    selectedType === type 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          {viewMode === 'grid' ? renderGridView() : renderListView()}
        </div>
      </div>
    </div>
  );
};

export default Devices;
