
// Add necessary types for equipment management
export interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  manufacturer: string;
  serial_number: string;
  installation_date: string;
  warranty_expiry?: string;
  location: string;
  status: 'operational' | 'maintenance' | 'offline' | 'faulty';
  next_maintenance_date?: string;
  created_at: string;
  updated_at: string;
  description?: string;
  notes?: string;
}

// BMS Parameter interface with all required fields
export interface BMSParameter {
  id: string;
  name: string;
  bmsId: string;
  dataType: string; // Added missing field
  unit: string;    // Added missing field
  mapping: Record<string, any>;
  status?: string;
}

export interface BMSIntegration {
  id: string;
  equipmentId: string;
  bmsType: string;
  syncFrequency: string;
  connectionStatus: string;
  lastSync: string;
  nextGeneration: string;
  parameters: BMSParameter[];
}

export interface MaintenanceCost {
  id: string;
  equipmentId: string;
  date: string;
  maintenanceId?: string;
  costCategory: string;
  maintenanceType?: string; // Added as it's used in the component
  totalCost: number;
  cost?: number; // Added as it's used in the component
  description?: string; // Added as it's used in the component
  type?: string;  // Added as it's used in component
  amount?: number;  // Added as it's used in component
}

export interface SparePartInventory {
  id: string;
  equipmentId: string;
  name: string;
  quantity: number;
  minimumQuantity: number;
  location: string;
  partNumber?: string; // Added as it's used in the component
  status?: string;    // Added as it's used in the component
}

export interface AutomatedReport {
  id: string;
  equipmentId: string;
  reportType: string;
  schedule: string;
  lastGenerated: string;
  nextGeneration: string;
  status: string;
  parameters: Record<string, any>;
}
