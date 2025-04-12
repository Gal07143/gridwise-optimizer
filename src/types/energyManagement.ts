export interface Asset {
    id: string;
    name: string;
    type: 'solar' | 'wind' | 'battery' | 'grid';
    capacity: number;
    location: string;
    status: 'active' | 'inactive' | 'maintenance';
    created_at: string;
    updated_at: string;
}

export interface GridSignal {
    id: string;
    type: 'price' | 'demand' | 'generation' | 'frequency';
    value: number;
    timestamp: string;
    source: string;
    created_at: string;
}

export interface EnergyData {
    id: string;
    asset_id: string;
    timestamp: string;
    power: number;
    voltage: number;
    current: number;
    frequency: number;
    created_at: string;
} 