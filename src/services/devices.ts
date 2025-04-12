import { DeviceModel } from "@/types/device-model";
import { Device } from "@/types/device";

export const getDeviceModels = (): DeviceModel[] => {
  // Sample device models data
  return [
    {
      id: "1",
      name: "SolarEdge SE10K",
      manufacturer: "SolarEdge",
      model: "SE10K",
      model_number: "SE10000H-US",
      device_type: "inverter",
      category: "Solar Inverters",
      description: "SolarEdge 10kW Three Phase Inverter with HD-Wave Technology",
      power_rating: 10,
      support_level: "full",
      protocol: "Modbus TCP",
      has_manual: true,
      supported: true
    },
    {
      id: "2",
      name: "Tesla Powerwall 2",
      manufacturer: "Tesla",
      model: "Powerwall 2",
      model_number: "Powerwall 2",
      device_type: "battery",
      category: "Battery Systems",
      description: "Rechargeable home battery system with 13.5 kWh capacity",
      capacity: 13.5,
      support_level: "full",
      protocol: "Tesla API",
      has_manual: true,
      supported: true
    },
    {
      id: "3",
      name: "Enphase IQ7+",
      manufacturer: "Enphase",
      model: "IQ7+",
      model_number: "IQ7PLUS-72-x-US",
      device_type: "inverter",
      category: "Solar Inverters",
      description: "High-efficiency microinverter for residential solar",
      power_rating: 0.29,
      support_level: "beta",
      protocol: "Enphase API",
      has_manual: true,
      supported: true
    },
    {
      id: "4",
      name: "Generac PWRcell",
      manufacturer: "Generac",
      model: "PWRcell",
      model_number: "PWRcell",
      device_type: "battery",
      category: "Battery Systems",
      description: "Scalable battery storage system for home backup power",
      capacity: 8.6,
      support_level: "partial",
      protocol: "Generac API",
      has_manual: true,
      supported: true
    },
    {
      id: "5",
      name: "Emporia Vue",
      manufacturer: "Emporia",
      model: "Vue",
      model_number: "EM001",
      device_type: "meter",
      category: "Smart Meters",
      description: "Real-time energy monitor with circuit-level resolution",
      support_level: "community",
      protocol: "Emporia API",
      has_manual: true,
      supported: true
    },
    {
      id: "6",
      name: "Sense Energy Monitor",
      manufacturer: "Sense",
      model: "Energy Monitor",
      model_number: "SENSE-EM",
      device_type: "meter",
      category: "Smart Meters",
      description: "Home energy monitor that provides insights into energy usage",
      support_level: "community",
      protocol: "Sense API",
      has_manual: true,
      supported: true
    },
    {
      id: "7",
      name: "ABB Terra AC",
      manufacturer: "ABB",
      model: "Terra AC",
      model_number: "6AGC082141",
      device_type: "evCharger",
      category: "EV Chargers",
      description: "AC wallbox for charging electric vehicles",
      power_rating: 7.5,
      support_level: "partial",
      protocol: "OCPP 1.6",
      has_manual: true,
      supported: true
    },
    {
      id: "8",
      name: "ChargePoint Home Flex",
      manufacturer: "ChargePoint",
      model: "Home Flex",
      model_number: "CPH50",
      device_type: "evCharger",
      category: "EV Chargers",
      description: "Level 2 EV charger with adjustable amperage",
      power_rating: 9.6,
      support_level: "full",
      protocol: "ChargePoint API",
      has_manual: true,
      supported: true
    }
  ];
};

export const getDeviceById = (deviceId: string): Device | undefined => {
  const mockDevices: Device[] = [
    {
      id: 'device-1',
      name: 'Solar Inverter',
      type: 'inverter',
      status: 'active',
      capacity: 10,
      site_id: 'site-1',
      model: 'SE10K',
      description: 'SolarEdge Inverter',
    },
    {
      id: 'device-2',
      name: 'Battery Storage',
      type: 'battery',
      status: 'idle',
      capacity: 13.5,
      site_id: 'site-1',
      model: 'Powerwall 2',
      description: 'Tesla Powerwall',
    },
    {
      id: 'device-3',
      name: 'EV Charger',
      type: 'evCharger',
      status: 'charging',
      capacity: 7.2,
      site_id: 'site-2',
      model: 'Home Flex',
      description: 'ChargePoint Home Flex',
    },
  ];

  return mockDevices.find(device => device.id === deviceId);
};

export const getDevicesBySiteId = (siteId: string): Device[] => {
  const mockDevices: Device[] = [
    {
      id: 'device-1',
      name: 'Solar Inverter',
      type: 'inverter',
      status: 'active',
      capacity: 10,
      site_id: 'site-1',
      model: 'SE10K',
      description: 'SolarEdge Inverter',
    },
    {
      id: 'device-2',
      name: 'Battery Storage',
      type: 'battery',
      status: 'idle',
      capacity: 13.5,
      site_id: 'site-1',
      model: 'Powerwall 2',
      description: 'Tesla Powerwall',
    },
    {
      id: 'device-3',
      name: 'EV Charger',
      type: 'evCharger',
      status: 'charging',
      capacity: 7.2,
      site_id: 'site-2',
      model: 'Home Flex',
      description: 'ChargePoint Home Flex',
    },
  ];

  return mockDevices.filter(device => device.site_id === siteId);
};

export const createDevice = (device: Device): Device => {
  // Mock implementation
  console.log('Creating device:', device);
  return device;
};

export const updateDevice = (deviceId: string, updates: Partial<Device>): Device => {
  // Mock implementation
  console.log(`Updating device ${deviceId} with:`, updates);
  return { id: deviceId, ...updates } as Device;
};

export const deleteDevice = (deviceId: string): void => {
  // Mock implementation
  console.log('Deleting device:', deviceId);
};
