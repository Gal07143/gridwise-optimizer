
import { useState, useMemo } from 'react';

// Mock data until database is ready
const mockDeviceModels = {
  'batteries': [
    { id: 'b1', manufacturer: 'Tesla', model: 'Powerwall 2', protocol: 'Modbus TCP', firmware: 'v1.45.2', supported: true, hasManual: true },
    { id: 'b2', manufacturer: 'LG Chem', model: 'RESU10H', protocol: 'CAN bus', firmware: 'v2.3.0', supported: true, hasManual: true },
    { id: 'b3', manufacturer: 'Sonnen', model: 'eco 8', protocol: 'REST API', firmware: 'v1.2.3', supported: true, hasManual: true },
    { id: 'b4', manufacturer: 'BYD', model: 'Battery-Box Premium HVS', protocol: 'Modbus RTU', firmware: 'v1.9', supported: true, hasManual: false },
    { id: 'b5', manufacturer: 'Pylontech', model: 'US2000 Plus', protocol: 'RS485', firmware: 'v2.0', supported: true, hasManual: true },
  ],
  'inverters': [
    { id: 'i1', manufacturer: 'SMA', model: 'Sunny Boy 5.0', protocol: 'Modbus TCP', firmware: 'v3.20.13.R', supported: true, hasManual: true },
    { id: 'i2', manufacturer: 'Fronius', model: 'Symo 10.0-3-M', protocol: 'Solar API', firmware: 'v3.15.1-4', supported: true, hasManual: true },
    { id: 'i3', manufacturer: 'SolarEdge', model: 'SE10K', protocol: 'Modbus TCP', firmware: 'v4.10.12', supported: true, hasManual: true },
    { id: 'i4', manufacturer: 'ABB', model: 'UNO-DM-5.0-TL-PLUS', protocol: 'Aurora Protocol', firmware: 'v1.2.3', supported: false, hasManual: false },
    { id: 'i5', manufacturer: 'Huawei', model: 'SUN2000-10KTL-M1', protocol: 'Modbus TCP', firmware: 'v1.0.35', supported: true, hasManual: true },
  ],
  'ev-chargers': [
    { id: 'ev1', manufacturer: 'ChargePoint', model: 'Home Flex', protocol: 'OCPP 1.6J', firmware: 'v5.1.2', supported: true, hasManual: true },
    { id: 'ev2', manufacturer: 'Tesla', model: 'Wall Connector', protocol: 'Proprietary', firmware: 'v1.45.0', supported: true, hasManual: true },
    { id: 'ev3', manufacturer: 'JuiceBox', model: 'Pro 40', protocol: 'JuiceNet API', firmware: 'v2.12.6', supported: true, hasManual: false },
    { id: 'ev4', manufacturer: 'Wallbox', model: 'Pulsar Plus', protocol: 'Modbus TCP', firmware: 'v3.4.2', supported: false, hasManual: true },
  ],
  'meters': [
    { id: 'm1', manufacturer: 'Schneider Electric', model: 'PowerLogic PM5560', protocol: 'Modbus RTU', firmware: 'v10.6.1', supported: true, hasManual: true },
    { id: 'm2', manufacturer: 'ABB', model: 'B23 212-100', protocol: 'Modbus TCP', firmware: 'v2.0', supported: true, hasManual: true },
    { id: 'm3', manufacturer: 'Siemens', model: 'SENTRON PAC3200', protocol: 'Modbus TCP', firmware: 'v1.2', supported: true, hasManual: true },
  ],
  'controllers': [
    { id: 'c1', manufacturer: 'Schneider Electric', model: 'EcoStruxure Microgrid Controller', protocol: 'Modbus TCP/REST API', firmware: 'v3.2.1', supported: true, hasManual: true },
    { id: 'c2', manufacturer: 'ABB', model: 'Microgrid Plus Controller', protocol: 'OPC UA', firmware: 'v2.5.0', supported: true, hasManual: true },
    { id: 'c3', manufacturer: 'Siemens', model: 'SICAM A8000 Microgrid Controller', protocol: 'IEC 61850', firmware: 'v4.60', supported: false, hasManual: true },
  ]
};

export const categoryNames = {
  'batteries': 'Battery Systems',
  'inverters': 'Inverters',
  'ev-chargers': 'EV Chargers',
  'meters': 'Energy Meters',
  'controllers': 'Microgrid Controllers'
};

export type DeviceModel = {
  id: string;
  manufacturer: string;
  model: string;
  protocol: string;
  firmware: string;
  supported: boolean;
  hasManual: boolean;
};

export const useDeviceModels = (categoryId?: string) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState('manufacturer');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Get raw device models for the selected category
  const deviceModels = useMemo(() => {
    return categoryId ? mockDeviceModels[categoryId as keyof typeof mockDeviceModels] || [] : [];
  }, [categoryId]);
  
  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort devices
  const filteredDevices = useMemo(() => {
    return deviceModels
      .filter(device => {
        const query = searchQuery.toLowerCase();
        return (
          device.manufacturer.toLowerCase().includes(query) ||
          device.model.toLowerCase().includes(query) ||
          device.protocol.toLowerCase().includes(query)
        );
      })
      .filter(device => {
        if (activeTab === 'all') return true;
        if (activeTab === 'supported') return device.supported;
        if (activeTab === 'unsupported') return !device.supported;
        return true;
      })
      .sort((a, b) => {
        const fieldA = a[sortField as keyof typeof a];
        const fieldB = b[sortField as keyof typeof b];
        
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return sortDirection === 'asc'
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        }
        
        if (typeof fieldA === 'boolean' && typeof fieldB === 'boolean') {
          return sortDirection === 'asc'
            ? (fieldA === fieldB ? 0 : fieldA ? -1 : 1)
            : (fieldA === fieldB ? 0 : fieldA ? 1 : -1);
        }
        
        return 0;
      });
  }, [deviceModels, searchQuery, activeTab, sortField, sortDirection]);

  return {
    filteredDevices,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    sortField,
    sortDirection,
    handleSort,
    deviceCount: filteredDevices.length
  };
};
