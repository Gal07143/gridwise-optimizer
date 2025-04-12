import { Equipment, EquipmentMetrics, EquipmentMaintenance, EquipmentParameter, EquipmentAlarm, EnergyRateStructure, CarbonEmissionsDetail, PredictiveMaintenance, PerformanceScore, EfficiencyRecommendation, LoadForecast, LifecycleStage, SparePartInventory, MaintenanceCost, DowntimeRecord, EnergyBenchmark, AutomatedReport, EquipmentGroup, EnergySaving, BMSIntegration } from '../types/equipment';

class EquipmentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/equipment';
  }

  // Equipment CRUD operations
  async getAllEquipment(): Promise<Equipment[]> {
    const response = await fetch(`${this.baseUrl}`);
    if (!response.ok) {
      throw new Error('Failed to fetch equipment');
    }
    return response.json();
  }

  async getEquipmentById(id: string): Promise<Equipment> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch equipment');
    }
    return response.json();
  }

  async createEquipment(equipment: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Equipment> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equipment),
    });
    if (!response.ok) {
      throw new Error('Failed to create equipment');
    }
    return response.json();
  }

  async updateEquipment(id: string, equipment: Partial<Equipment>): Promise<Equipment> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(equipment),
    });
    if (!response.ok) {
      throw new Error('Failed to update equipment');
    }
    return response.json();
  }

  async deleteEquipment(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete equipment');
    }
  }

  // Equipment metrics operations
  async getEquipmentMetrics(id: string, startDate: Date, endDate: Date): Promise<EquipmentMetrics[]> {
    const response = await fetch(
      `${this.baseUrl}/${id}/metrics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch equipment metrics');
    }
    return response.json();
  }

  // Equipment parameters operations
  async getEquipmentParameters(id: string): Promise<EquipmentParameter[]> {
    const response = await fetch(`${this.baseUrl}/${id}/parameters`);
    if (!response.ok) {
      throw new Error('Failed to fetch equipment parameters');
    }
    return response.json();
  }

  async updateEquipmentParameter(id: string, parameterId: string, value: number): Promise<EquipmentParameter> {
    const response = await fetch(`${this.baseUrl}/${id}/parameters/${parameterId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    });
    if (!response.ok) {
      throw new Error('Failed to update equipment parameter');
    }
    return response.json();
  }

  // Equipment alarms operations
  async getEquipmentAlarms(id: string): Promise<EquipmentAlarm[]> {
    const response = await fetch(`${this.baseUrl}/${id}/alarms`);
    if (!response.ok) {
      throw new Error('Failed to fetch equipment alarms');
    }
    return response.json();
  }

  async acknowledgeAlarm(id: string, alarmId: string, acknowledgedBy: string): Promise<EquipmentAlarm> {
    const response = await fetch(`${this.baseUrl}/${id}/alarms/${alarmId}/acknowledge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ acknowledgedBy }),
    });
    if (!response.ok) {
      throw new Error('Failed to acknowledge alarm');
    }
    return response.json();
  }

  // Equipment maintenance operations
  async getEquipmentMaintenance(id: string): Promise<EquipmentMaintenance[]> {
    const response = await fetch(`${this.baseUrl}/${id}/maintenance`);
    if (!response.ok) {
      throw new Error('Failed to fetch equipment maintenance');
    }
    return response.json();
  }

  async createMaintenanceRecord(id: string, maintenance: Omit<EquipmentMaintenance, 'id' | 'equipmentId'>): Promise<EquipmentMaintenance> {
    const response = await fetch(`${this.baseUrl}/${id}/maintenance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(maintenance),
    });
    if (!response.ok) {
      throw new Error('Failed to create maintenance record');
    }
    return response.json();
  }

  async updateMaintenanceRecord(id: string, maintenanceId: string, maintenance: Partial<EquipmentMaintenance>): Promise<EquipmentMaintenance> {
    const response = await fetch(`${this.baseUrl}/${id}/maintenance/${maintenanceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(maintenance),
    });
    if (!response.ok) {
      throw new Error('Failed to update maintenance record');
    }
    return response.json();
  }

  // New methods for the 15 capabilities

  // 1. Energy Cost Analysis
  async getEnergyRateStructures(): Promise<EnergyRateStructure[]> {
    const response = await fetch(`${this.baseUrl}/energy-rates`);
    if (!response.ok) {
      throw new Error('Failed to fetch energy rate structures');
    }
    return response.json();
  }

  async applyEnergyRateStructure(equipmentId: string, rateStructureId: string): Promise<Equipment> {
    const response = await fetch(`${this.baseUrl}/${equipmentId}/energy-rates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rateStructureId }),
    });
    if (!response.ok) {
      throw new Error('Failed to apply energy rate structure');
    }
    return response.json();
  }

  // 2. Carbon Footprint Tracking
  async getCarbonEmissionsDetails(equipmentId: string, startDate: Date, endDate: Date): Promise<CarbonEmissionsDetail[]> {
    const response = await fetch(
      `${this.baseUrl}/${equipmentId}/carbon-emissions?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch carbon emissions details');
    }
    return response.json();
  }

  // 3. Predictive Maintenance
  async getPredictiveMaintenance(equipmentId: string): Promise<PredictiveMaintenance[]> {
    const response = await fetch(`${this.baseUrl}/${equipmentId}/predictive-maintenance`);
    if (!response.ok) {
      throw new Error('Failed to fetch predictive maintenance data');
    }
    return response.json();
  }

  // 4. Equipment Performance Scoring
  async getPerformanceScores(equipmentId: string): Promise<PerformanceScore[]> {
    const response = await fetch(`${this.baseUrl}/${equipmentId}/performance-scores`);
    if (!response.ok) {
      throw new Error('Failed to fetch performance scores');
    }
    return response.json();
  }

  // 5. Energy Efficiency Recommendations
  async getEfficiencyRecommendations(equipmentId: string): Promise<EfficiencyRecommendation[]> {
    const response = await fetch(`${this.baseUrl}/${equipmentId}/efficiency-recommendations`);
    if (!response.ok) {
      throw new Error('Failed to fetch efficiency recommendations');
    }
    return response.json();
  }

  // 6. Load Forecasting
  async getLoadForecasts(equipmentId: string, period: 'hourly' | 'daily' | 'weekly' | 'monthly', horizon: number): Promise<LoadForecast[]> {
    const response = await fetch(
      `${this.baseUrl}/${equipmentId}/load-forecasts?period=${period}&horizon=${horizon}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch load forecasts');
    }
    return response.json();
  }

  // 7. Equipment Lifecycle Management
  async getLifecycleStages(equipmentId: string): Promise<LifecycleStage[]> {
    const response = await fetch(`${this.baseUrl}/${equipmentId}/lifecycle-stages`);
    if (!response.ok) {
      throw new Error('Failed to fetch lifecycle stages');
    }
    return response.json();
  }

  // 8. Spare Parts Inventory
  async getSparePartsInventory(equipmentId: string): Promise<SparePartInventory[]> {
    const response = await fetch(`${this.baseUrl}/${equipmentId}/spare-parts`);
    if (!response.ok) {
      throw new Error('Failed to fetch spare parts inventory');
    }
    return response.json();
  }

  async updateSparePart(equipmentId: string, sparePartId: string, sparePart: Partial<SparePartInventory>): Promise<SparePartInventory> {
    const response = await fetch(`${this.baseUrl}/${equipmentId}/spare-parts/${sparePartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sparePart),
    });
    if (!response.ok) {
      throw new Error('Failed to update spare part');
    }
    return response.json();
  }

  // 9. Maintenance Cost Tracking
  async getMaintenanceCosts(equipmentId: string): Promise<MaintenanceCost[]> {
    const response = await fetch(`${this.baseUrl}/${equipmentId}/maintenance-costs`);
    if (!response.ok) {
      throw new Error('Failed to fetch maintenance costs');
    }
    return response.json();
  }

  // 10. Equipment Downtime Analysis
  async getDowntimeRecords(equipmentId: string, startDate: Date, endDate: Date): Promise<DowntimeRecord[]> {
    const response = await fetch(
      `${this.baseUrl}/${equipmentId}/downtime?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch downtime records');
    }
    return response.json();
  }

  // 11. Energy Benchmarking
  async getEnergyBenchmarks(equipmentId: string): Promise<EnergyBenchmark[]> {
    const response = await fetch(`${this.baseUrl}/${equipmentId}/energy-benchmarks`);
    if (!response.ok) {
      throw new Error('Failed to fetch energy benchmarks');
    }
    return response.json();
  }

  // 12. Automated Reporting
  async getAutomatedReports(): Promise<AutomatedReport[]> {
    const response = await fetch(`${this.baseUrl}/automated-reports`);
    if (!response.ok) {
      throw new Error('Failed to fetch automated reports');
    }
    return response.json();
  }

  async createAutomatedReport(report: Omit<AutomatedReport, 'id' | 'lastGenerated' | 'nextGeneration' | 'status'>): Promise<AutomatedReport> {
    const response = await fetch(`${this.baseUrl}/automated-reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report),
    });
    if (!response.ok) {
      throw new Error('Failed to create automated report');
    }
    return response.json();
  }

  // 13. Equipment Grouping and Hierarchy
  async getEquipmentGroups(): Promise<EquipmentGroup[]> {
    const response = await fetch(`${this.baseUrl}/groups`);
    if (!response.ok) {
      throw new Error('Failed to fetch equipment groups');
    }
    return response.json();
  }

  async createEquipmentGroup(group: Omit<EquipmentGroup, 'id'>): Promise<EquipmentGroup> {
    const response = await fetch(`${this.baseUrl}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(group),
    });
    if (!response.ok) {
      throw new Error('Failed to create equipment group');
    }
    return response.json();
  }

  // 14. Energy Savings Verification
  async getEnergySavings(equipmentId: string): Promise<EnergySaving[]> {
    const response = await fetch(`${this.baseUrl}/${equipmentId}/energy-savings`);
    if (!response.ok) {
      throw new Error('Failed to fetch energy savings');
    }
    return response.json();
  }

  // 15. Integration with Building Management Systems
  async getBMSIntegration(equipmentId: string): Promise<BMSIntegration> {
    const response = await fetch(`${this.baseUrl}/${equipmentId}/bms-integration`);
    if (!response.ok) {
      throw new Error('Failed to fetch BMS integration');
    }
    return response.json();
  }

  async updateBMSIntegration(equipmentId: string, integration: Partial<BMSIntegration>): Promise<BMSIntegration> {
    const response = await fetch(`${this.baseUrl}/${equipmentId}/bms-integration`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(integration),
    });
    if (!response.ok) {
      throw new Error('Failed to update BMS integration');
    }
    return response.json();
  }
}

export const equipmentService = new EquipmentService(); 