import { supabase } from './supabase';
import { MLService } from './mlService';

export interface GridSignal {
  id: string;
  type: 'PRICING' | 'CAPACITY' | 'CURTAILMENT';
  timestamp: Date;
  value: number;
  unit: string;
  region: string;
  duration: number; // in minutes
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source: string;
  metadata?: Record<string, any>;
}

export interface GridSignalConfig {
  region: string;
  types: ('PRICING' | 'CAPACITY' | 'CURTAILMENT')[];
  minPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  maxAge: number; // in minutes
}

export interface GridSignalSubscription {
  config: GridSignalConfig;
  callback: (signal: GridSignal) => void;
}

export class GridSignalService {
  private mlService: MLService;
  private isInitialized: boolean = false;
  private subscriptions: GridSignalSubscription[] = [];
  private signalHistory: Map<string, GridSignal[]> = new Map();
  private readonly MAX_HISTORY = 1000;
  private realtimeSubscription: any = null;

  constructor() {
    this.mlService = new MLService({
      modelPath: '/models/grid_signal_anomaly.onnx',
      modelType: 'price',
      inputShape: [100, 5],
      outputShape: [1, 3],
      featureNames: ['value', 'rate_of_change', 'duration', 'priority_score', 'region_code']
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize ML service
      await this.mlService.initialize();
      
      // Subscribe to realtime updates
      this.setupRealtimeSubscription();
      
      this.isInitialized = true;
      console.log('Grid Signal service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Grid Signal service:', error);
      throw new Error(`Failed to initialize Grid Signal service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private setupRealtimeSubscription(): void {
    this.realtimeSubscription = supabase
      .channel('grid_signals')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'grid_signals' 
      }, (payload: any) => {
        const signal = this.convertToGridSignal(payload.new);
        this.processSignal(signal);
      })
      .subscribe();
  }

  private convertToGridSignal(data: any): GridSignal {
    return {
      id: data.id,
      type: data.type,
      timestamp: new Date(data.timestamp),
      value: data.value,
      unit: data.unit,
      region: data.region,
      duration: data.duration,
      priority: data.priority,
      source: data.source,
      metadata: data.metadata
    };
  }

  private processSignal(signal: GridSignal): void {
    // Store in history
    this.storeSignal(signal);
    
    // Notify subscribers
    this.notifySubscribers(signal);
    
    // Detect anomalies
    this.detectAnomalies(signal).catch(error => {
      console.error('Failed to detect anomalies:', error);
    });
  }

  private storeSignal(signal: GridSignal): void {
    const key = `${signal.region}_${signal.type}`;
    
    if (!this.signalHistory.has(key)) {
      this.signalHistory.set(key, []);
    }
    
    const history = this.signalHistory.get(key)!;
    history.push(signal);
    
    // Keep only the last MAX_HISTORY signals
    if (history.length > this.MAX_HISTORY) {
      history.shift();
    }
  }

  private notifySubscribers(signal: GridSignal): void {
    for (const subscription of this.subscriptions) {
      if (this.matchesConfig(signal, subscription.config)) {
        subscription.callback(signal);
      }
    }
  }

  private matchesConfig(signal: GridSignal, config: GridSignalConfig): boolean {
    // Check region
    if (config.region !== '*' && signal.region !== config.region) {
      return false;
    }
    
    // Check type
    if (config.types.length > 0 && !config.types.includes(signal.type)) {
      return false;
    }
    
    // Check priority
    const priorityLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const signalPriorityIndex = priorityLevels.indexOf(signal.priority);
    const configPriorityIndex = priorityLevels.indexOf(config.minPriority);
    
    if (signalPriorityIndex < configPriorityIndex) {
      return false;
    }
    
    // Check age
    const ageInMinutes = (Date.now() - signal.timestamp.getTime()) / (60 * 1000);
    if (ageInMinutes > config.maxAge) {
      return false;
    }
    
    return true;
  }

  async subscribe(config: GridSignalConfig, callback: (signal: GridSignal) => void): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Grid Signal service not initialized');
    }
    
    this.subscriptions.push({ config, callback });
    
    // Send historical signals that match the config
    const historicalSignals = await this.getSignals(config);
    for (const signal of historicalSignals) {
      callback(signal);
    }
  }

  async unsubscribe(config: GridSignalConfig, callback: (signal: GridSignal) => void): Promise<void> {
    this.subscriptions = this.subscriptions.filter(
      sub => sub.config !== config || sub.callback !== callback
    );
  }

  async getSignals(config: GridSignalConfig): Promise<GridSignal[]> {
    if (!this.isInitialized) {
      throw new Error('Grid Signal service not initialized');
    }
    
    try {
      let query = supabase
        .from('grid_signals')
        .select('*')
        .gte('timestamp', new Date(Date.now() - config.maxAge * 60 * 1000).toISOString());
      
      // Apply filters
      if (config.region !== '*') {
        query = query.eq('region', config.region);
      }
      
      if (config.types.length > 0) {
        query = query.in('type', config.types);
      }
      
      // Get priority levels to include
      const priorityLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
      const configPriorityIndex = priorityLevels.indexOf(config.minPriority);
      const includedPriorities = priorityLevels.slice(configPriorityIndex);
      
      query = query.in('priority', includedPriorities);
      
      // Execute query
      const { data, error } = await query.order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      return data.map(this.convertToGridSignal);
    } catch (error) {
      console.error('Failed to get signals:', error);
      throw new Error(`Failed to get signals: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async detectAnomalies(signal: GridSignal): Promise<void> {
    try {
      const key = `${signal.region}_${signal.type}`;
      const history = this.signalHistory.get(key) || [];
      
      if (history.length < 10) return;
      
      // Prepare data for anomaly detection
      const recentSignals = history.slice(-10);
      const features = recentSignals.map(s => ({
        value: s.value,
        rate_of_change: 0, // Will be calculated
        duration: s.duration,
        priority_score: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].indexOf(s.priority),
        region_code: s.region.charCodeAt(0)
      }));
      
      // Calculate rate of change
      for (let i = 1; i < features.length; i++) {
        features[i].rate_of_change = features[i].value - features[i-1].value;
      }
      
      // Detect anomaly
      const result = await this.mlService.detectAnomalies({
        data: features
      } as any);
      
      // If anomaly detected, log it
      if (result.anomalyScore > 0.7) {
        console.log(`Anomaly detected in grid signal: ${signal.id}, score: ${result.anomalyScore}`);
      }
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
    }
  }

  async dispose(): Promise<void> {
    if (this.realtimeSubscription) {
      await supabase.removeChannel(this.realtimeSubscription);
    }
    
    this.subscriptions = [];
    this.signalHistory.clear();
    this.isInitialized = false;
  }
} 