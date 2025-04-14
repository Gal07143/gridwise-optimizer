
import { Asset, GridSignal } from '../types/energyManagement';

export class EnergyManagementService {
  async getAssets(): Promise<Asset[]> {
    // Mock implementation
    return [
      {
        id: '1',
        name: 'Battery Storage System',
        type: 'battery',
        capacity: 10000,
        status: 'active',
        location: 'Main Building'
      },
      {
        id: '2',
        name: 'Solar Panel Array',
        type: 'generation',
        capacity: 5000,
        status: 'active',
        location: 'Rooftop'
      }
    ];
  }

  async getGridSignals(): Promise<GridSignal[]> {
    // Mock implementation
    return [
      {
        id: '1',
        type: 'demand_response',
        value: '30% reduction',
        source: 'DSO',
        timestamp: new Date().toISOString(),
        priority: 'high'
      },
      {
        id: '2',
        type: 'price_signal',
        value: '0.15 EUR/kWh',
        source: 'Market',
        timestamp: new Date().toISOString(),
        priority: 'medium'
      }
    ];
  }

  // Add methods used in ml-dashboard
  async getDevices() {
    // Mock implementation
    return [
      { id: '1', name: 'Device 1', type: 'battery' },
      { id: '2', name: 'Device 2', type: 'inverter' }
    ];
  }

  async getTelemetryData() {
    // Mock implementation
    return {
      timestamps: Array(24).fill(0).map((_, i) => new Date(Date.now() - i * 3600000).toISOString()),
      values: Array(24).fill(0).map(() => Math.random() * 100)
    };
  }
}

// Create and export an instance for backward compatibility
export const energyManagementService = new EnergyManagementService();
