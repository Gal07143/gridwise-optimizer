import { supabase } from './supabase';
import { MLService } from './mlService';
import { GridSignalService, GridSignal } from './gridSignalService';
import { EnergyDataAggregationService, AggregatedData } from './energyDataAggregationService';
import { MarketIntegrationService, MarketPrice } from './marketIntegrationService';

export interface FlexibilityAsset {
  id: string;
  name: string;
  type: 'BATTERY' | 'HEAT_PUMP' | 'EV' | 'HVAC' | 'WATER_HEATER' | 'INDUSTRIAL_LOAD';
  capacity: number; // kW
  maxCapacity: number; // kW
  minCapacity: number; // kW
  stateOfCharge?: number; // percentage for batteries
  currentPower?: number; // kW
  status: 'IDLE' | 'CHARGING' | 'DISCHARGING' | 'ERROR';
  location: string;
  metadata?: Record<string, any>;
}

export interface FlexibilityRequest {
  id: string;
  assetId: string;
  type: 'INCREASE' | 'DECREASE' | 'SHIFT';
  targetPower: number; // kW
  startTime: Date;
  endTime: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  reason: string;
  metadata?: Record<string, any>;
}

export interface FlexibilityResponse {
  requestId: string;
  assetId: string;
  actualPower: number; // kW
  startTime: Date;
  endTime: Date;
  energyImpact: number; // kWh
  costImpact: number;
  currency: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  metadata?: Record<string, any>;
}

export interface FlexibilityConfig {
  optimizationHorizon: number; // hours
  minResponseTime: number; // minutes
  maxResponseTime: number; // minutes
  priceThreshold: number;
  carbonThreshold: number; // gCO2/kWh
  comfortThreshold: number; // 0-1 scale
}

export class FlexibilityManagementService {
  private mlService: MLService;
  private gridSignalService: GridSignalService;
  private energyDataService: EnergyDataAggregationService;
  private marketService: MarketIntegrationService;
  private isInitialized: boolean = false;
  private config: FlexibilityConfig;
  private assets: Map<string, FlexibilityAsset> = new Map();
  private requests: Map<string, FlexibilityRequest> = new Map();
  private responses: Map<string, FlexibilityResponse[]> = new Map();
  private readonly MAX_HISTORY = 1000;
  private realtimeSubscription: any = null;

  constructor(config: FlexibilityConfig) {
    this.config = config;
    this.mlService = new MLService({
      modelPath: '/models/flexibility_optimization.onnx',
      modelType: 'load',
      inputShape: [100, 8],
      outputShape: [1, 5],
      featureNames: ['asset_capacity', 'current_power', 'target_power', 'price', 'carbon', 'time_of_day', 'day_of_week', 'comfort_score']
    });
    this.gridSignalService = new GridSignalService();
    this.energyDataService = new EnergyDataAggregationService();
    this.marketService = new MarketIntegrationService({
      marketType: 'BALANCING',
      region: 'DEFAULT',
      currency: 'EUR',
      minBidSize: 0.1,
      maxBidSize: 1000,
      pricePrecision: 2,
      volumePrecision: 2,
      tradingHours: {
        start: '00:00',
        end: '23:59',
        timezone: 'UTC'
      }
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize services
      await this.mlService.initialize();
      await this.gridSignalService.initialize();
      await this.energyDataService.initialize();
      await this.marketService.initialize();
      
      // Load assets
      await this.loadAssets();
      
      // Subscribe to realtime updates
      this.setupRealtimeSubscription();
      
      this.isInitialized = true;
      console.log('Flexibility Management service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Flexibility Management service:', error);
      throw new Error(`Failed to initialize Flexibility Management service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async loadAssets(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('flexibility_assets')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        this.assets.clear();
        data.forEach(asset => {
          this.assets.set(asset.id, {
            id: asset.id,
            name: asset.name,
            type: asset.type,
            capacity: asset.capacity,
            maxCapacity: asset.max_capacity,
            minCapacity: asset.min_capacity,
            stateOfCharge: asset.state_of_charge,
            currentPower: asset.current_power,
            status: asset.status,
            location: asset.location,
            metadata: asset.metadata
          });
        });
      }
    } catch (error) {
      console.error('Failed to load assets:', error);
      throw error;
    }
  }

  private setupRealtimeSubscription(): void {
    this.realtimeSubscription = supabase
      .channel('flexibility_assets')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'flexibility_assets' 
      }, (payload: any) => {
        const asset = this.convertToFlexibilityAsset(payload.new);
        this.updateAsset(asset);
      })
      .subscribe();
  }

  private convertToFlexibilityAsset(data: any): FlexibilityAsset {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      capacity: data.capacity,
      maxCapacity: data.max_capacity,
      minCapacity: data.min_capacity,
      stateOfCharge: data.state_of_charge,
      currentPower: data.current_power,
      status: data.status,
      location: data.location,
      metadata: data.metadata
    };
  }

  private updateAsset(asset: FlexibilityAsset): void {
    this.assets.set(asset.id, asset);
  }

  async getAssets(): Promise<FlexibilityAsset[]> {
    if (!this.isInitialized) {
      throw new Error('Flexibility Management service not initialized');
    }
    
    return Array.from(this.assets.values());
  }

  async getAsset(assetId: string): Promise<FlexibilityAsset | null> {
    if (!this.isInitialized) {
      throw new Error('Flexibility Management service not initialized');
    }
    
    return this.assets.get(assetId) || null;
  }

  async requestFlexibility(request: Omit<FlexibilityRequest, 'id' | 'status'>): Promise<FlexibilityRequest> {
    if (!this.isInitialized) {
      throw new Error('Flexibility Management service not initialized');
    }
    
    try {
      // Validate request
      this.validateRequest(request);
      
      // Create request object
      const newRequest: FlexibilityRequest = {
        ...request,
        id: crypto.randomUUID(),
        status: 'PENDING'
      };
      
      // Store request
      await this.storeRequest(newRequest);
      
      // Evaluate request
      await this.evaluateRequest(newRequest);
      
      return newRequest;
    } catch (error) {
      console.error('Failed to request flexibility:', error);
      throw new Error(`Failed to request flexibility: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateRequest(request: Omit<FlexibilityRequest, 'id' | 'status'>): void {
    // Check if asset exists
    if (!this.assets.has(request.assetId)) {
      throw new Error(`Asset not found: ${request.assetId}`);
    }
    
    const asset = this.assets.get(request.assetId)!;
    
    // Check if target power is within asset limits
    if (request.targetPower > asset.maxCapacity) {
      throw new Error(`Target power ${request.targetPower} kW exceeds asset maximum capacity ${asset.maxCapacity} kW`);
    }
    
    if (request.targetPower < asset.minCapacity) {
      throw new Error(`Target power ${request.targetPower} kW is below asset minimum capacity ${asset.minCapacity} kW`);
    }
    
    // Check if start time is in the future
    if (request.startTime <= new Date()) {
      throw new Error('Start time must be in the future');
    }
    
    // Check if end time is after start time
    if (request.endTime <= request.startTime) {
      throw new Error('End time must be after start time');
    }
    
    // Check if response time is within limits
    const responseTimeMinutes = (request.startTime.getTime() - new Date().getTime()) / (60 * 1000);
    if (responseTimeMinutes < this.config.minResponseTime) {
      throw new Error(`Response time ${responseTimeMinutes} minutes is below minimum ${this.config.minResponseTime} minutes`);
    }
    
    if (responseTimeMinutes > this.config.maxResponseTime) {
      throw new Error(`Response time ${responseTimeMinutes} minutes is above maximum ${this.config.maxResponseTime} minutes`);
    }
  }

  private async storeRequest(request: FlexibilityRequest): Promise<void> {
    try {
      // Store in database
      const { error } = await supabase
        .from('flexibility_requests')
        .insert({
          id: request.id,
          asset_id: request.assetId,
          type: request.type,
          target_power: request.targetPower,
          start_time: request.startTime.toISOString(),
          end_time: request.endTime.toISOString(),
          priority: request.priority,
          status: request.status,
          reason: request.reason,
          metadata: request.metadata
        });
      
      if (error) throw error;
      
      // Store in memory
      this.requests.set(request.id, request);
    } catch (error) {
      console.error('Failed to store request:', error);
      throw error;
    }
  }

  private async evaluateRequest(request: FlexibilityRequest): Promise<void> {
    try {
      // Get asset
      const asset = this.assets.get(request.assetId)!;
      
      // Get current market price
      const prices = await this.marketService.getPrices(1);
      const currentPrice = prices.length > 0 ? prices[0].price : 0;
      
      // Get grid signals
      const gridSignals = await this.gridSignalService.getSignals({
        region: '*',
        types: ['PRICING', 'CAPACITY'],
        minPriority: 'LOW',
        maxAge: 60 // 1 hour
      });
      
      // Get energy data
      const now = new Date();
      const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
      
      const energyData = await this.energyDataService.aggregateData({
        interval: 'hour',
        metrics: ['demand', 'generation'],
        devices: ['*'],
        startTime,
        endTime: now
      });
      
      // Prepare features for optimization
      const features = this.prepareFeatures(asset, request, currentPrice, gridSignals, energyData.data);
      
      // Optimize response
      const result = await this.mlService.predict({
        data: features
      } as any);
      
      // Evaluate optimization result
      const optimizationScore = result[0].predicted;
      
      // Decide whether to accept or reject the request
      if (optimizationScore > 0.7) {
        // Accept request
        await this.updateRequestStatus(request.id, 'ACCEPTED');
        
        // Schedule execution
        this.scheduleExecution(request).catch(error => {
          console.error('Failed to schedule execution:', error);
        });
      } else {
        // Reject request
        await this.updateRequestStatus(request.id, 'REJECTED');
      }
    } catch (error) {
      console.error('Failed to evaluate request:', error);
      // Reject request on error
      await this.updateRequestStatus(request.id, 'REJECTED');
    }
  }

  private prepareFeatures(
    asset: FlexibilityAsset,
    request: FlexibilityRequest,
    currentPrice: number,
    gridSignals: GridSignal[],
    energyData: AggregatedData[]
  ): any[] {
    // Calculate power difference
    const currentPower = asset.currentPower || 0;
    const powerDifference = request.targetPower - currentPower;
    
    // Calculate time features
    const now = new Date();
    const timeToStart = (request.startTime.getTime() - now.getTime()) / (60 * 60 * 1000); // hours
    const duration = (request.endTime.getTime() - request.startTime.getTime()) / (60 * 60 * 1000); // hours
    
    // Find relevant grid signals
    const pricingSignals = gridSignals.filter(s => s.type === 'PRICING');
    const capacitySignals = gridSignals.filter(s => s.type === 'CAPACITY');
    
    // Calculate average signal values
    const avgPricingSignal = pricingSignals.length > 0 
      ? pricingSignals.reduce((sum, s) => sum + s.value, 0) / pricingSignals.length 
      : 0;
    
    const avgCapacitySignal = capacitySignals.length > 0 
      ? capacitySignals.reduce((sum, s) => sum + s.value, 0) / capacitySignals.length 
      : 0;
    
    // Find energy data for current hour
    const currentHourData = this.findEnergyDataForHour(energyData, now);
    
    // Calculate comfort score based on asset type and request
    const comfortScore = this.calculateComfortScore(asset, request);
    
    // Create feature vector
    return [{
      asset_capacity: asset.capacity,
      current_power: currentPower,
      target_power: request.targetPower,
      price: currentPrice,
      carbon: avgCapacitySignal,
      time_of_day: now.getHours() / 24,
      day_of_week: now.getDay() / 7,
      comfort_score: comfortScore,
      power_difference: powerDifference,
      time_to_start: timeToStart,
      duration: duration,
      pricing_signal: avgPricingSignal
    }];
  }

  private findEnergyDataForHour(energyData: AggregatedData[], timestamp: Date): AggregatedData | null {
    if (energyData.length === 0) return null;
    
    // Find data point with closest timestamp
    let closestData = energyData[0];
    let minDiff = Math.abs(closestData.timestamp.getTime() - timestamp.getTime());
    
    for (const data of energyData) {
      const diff = Math.abs(data.timestamp.getTime() - timestamp.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closestData = data;
      }
    }
    
    return closestData;
  }

  private calculateComfortScore(asset: FlexibilityAsset, request: FlexibilityRequest): number {
    // Different comfort calculations based on asset type
    switch (asset.type) {
      case 'BATTERY':
        // For batteries, comfort is based on state of charge
        const stateOfCharge = asset.stateOfCharge || 0;
        return stateOfCharge / 100;
      
      case 'HEAT_PUMP':
      case 'HVAC':
        // For heating/cooling, comfort is based on time of day
        const hour = new Date().getHours();
        // Assume comfort is lower during typical sleeping hours (22:00-06:00)
        return (hour >= 22 || hour < 6) ? 0.3 : 0.8;
      
      case 'EV':
        // For EVs, comfort is based on typical charging patterns
        const dayOfWeek = new Date().getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        return isWeekend ? 0.9 : 0.5;
      
      case 'WATER_HEATER':
        // For water heaters, comfort is based on typical usage patterns
        const currentHour = new Date().getHours();
        // Assume comfort is lower during typical shower times (07:00-09:00 and 18:00-20:00)
        return (currentHour >= 7 && currentHour < 9) || (currentHour >= 18 && currentHour < 20) ? 0.2 : 0.8;
      
      case 'INDUSTRIAL_LOAD':
        // For industrial loads, comfort is based on request priority
        const priorityScores = { 'LOW': 0.3, 'MEDIUM': 0.5, 'HIGH': 0.7, 'CRITICAL': 0.9 };
        return priorityScores[request.priority];
      
      default:
        return 0.5; // Default comfort score
    }
  }

  private async updateRequestStatus(requestId: string, status: FlexibilityRequest['status']): Promise<void> {
    try {
      // Update in database
      const { error } = await supabase
        .from('flexibility_requests')
        .update({ status })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Update in memory
      const request = this.requests.get(requestId);
      if (request) {
        request.status = status;
      }
    } catch (error) {
      console.error('Failed to update request status:', error);
      throw error;
    }
  }

  private async scheduleExecution(request: FlexibilityRequest): Promise<void> {
    // Calculate delay until start time
    const now = new Date();
    const delayMs = request.startTime.getTime() - now.getTime();
    
    // Schedule execution
    setTimeout(async () => {
      try {
        // Update status to in progress
        await this.updateRequestStatus(request.id, 'IN_PROGRESS');
        
        // Execute request
        await this.executeRequest(request);
      } catch (error) {
        console.error('Failed to execute request:', error);
        await this.updateRequestStatus(request.id, 'CANCELLED');
      }
    }, delayMs);
  }

  private async executeRequest(request: FlexibilityRequest): Promise<void> {
    try {
      // Get asset
      const asset = this.assets.get(request.assetId)!;
      
      // Calculate energy impact
      const durationHours = (request.endTime.getTime() - request.startTime.getTime()) / (60 * 60 * 1000);
      const currentPower = asset.currentPower || 0;
      const powerDifference = request.targetPower - currentPower;
      const energyImpact = Math.abs(powerDifference) * durationHours;
      
      // Get current market price
      const prices = await this.marketService.getPrices(1);
      const currentPrice = prices.length > 0 ? prices[0].price : 0;
      
      // Calculate cost impact
      const costImpact = energyImpact * currentPrice;
      
      // Create response
      const response: FlexibilityResponse = {
        requestId: request.id,
        assetId: request.assetId,
        actualPower: request.targetPower,
        startTime: request.startTime,
        endTime: request.endTime,
        energyImpact,
        costImpact,
        currency: 'EUR',
        status: 'SUCCESS',
        metadata: {
          originalPower: currentPower,
          powerDifference,
          marketPrice: currentPrice
        }
      };
      
      // Store response
      await this.storeResponse(response);
      
      // Update asset
      await this.updateAssetPower(request.assetId, request.targetPower);
      
      // Schedule completion
      const durationMs = request.endTime.getTime() - request.startTime.getTime();
      setTimeout(async () => {
        try {
          // Update status to completed
          await this.updateRequestStatus(request.id, 'COMPLETED');
          
          // Restore asset to original state
          await this.updateAssetPower(request.assetId, currentPower);
        } catch (error) {
          console.error('Failed to complete request:', error);
        }
      }, durationMs);
    } catch (error) {
      console.error('Failed to execute request:', error);
      throw error;
    }
  }

  private async storeResponse(response: FlexibilityResponse): Promise<void> {
    try {
      // Store in database
      const { error } = await supabase
        .from('flexibility_responses')
        .insert({
          request_id: response.requestId,
          asset_id: response.assetId,
          actual_power: response.actualPower,
          start_time: response.startTime.toISOString(),
          end_time: response.endTime.toISOString(),
          energy_impact: response.energyImpact,
          cost_impact: response.costImpact,
          currency: response.currency,
          status: response.status,
          metadata: response.metadata
        });
      
      if (error) throw error;
      
      // Store in memory
      if (!this.responses.has(response.requestId)) {
        this.responses.set(response.requestId, []);
      }
      
      this.responses.get(response.requestId)!.push(response);
    } catch (error) {
      console.error('Failed to store response:', error);
      throw error;
    }
  }

  private async updateAssetPower(assetId: string, power: number): Promise<void> {
    try {
      // Update in database
      const { error } = await supabase
        .from('flexibility_assets')
        .update({ current_power: power })
        .eq('id', assetId);
      
      if (error) throw error;
      
      // Update in memory
      const asset = this.assets.get(assetId);
      if (asset) {
        asset.currentPower = power;
        
        // Update status based on power
        if (power > 0) {
          asset.status = 'CHARGING';
        } else if (power < 0) {
          asset.status = 'DISCHARGING';
        } else {
          asset.status = 'IDLE';
        }
      }
    } catch (error) {
      console.error('Failed to update asset power:', error);
      throw error;
    }
  }

  async getRequests(status?: FlexibilityRequest['status']): Promise<FlexibilityRequest[]> {
    if (!this.isInitialized) {
      throw new Error('Flexibility Management service not initialized');
    }
    
    try {
      let query = supabase
        .from('flexibility_requests')
        .select('*');
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('start_time', { ascending: false });
      
      if (error) throw error;
      
      return data.map((request: any) => ({
        id: request.id,
        assetId: request.asset_id,
        type: request.type,
        targetPower: request.target_power,
        startTime: new Date(request.start_time),
        endTime: new Date(request.end_time),
        priority: request.priority,
        status: request.status,
        reason: request.reason,
        metadata: request.metadata
      }));
    } catch (error) {
      console.error('Failed to get requests:', error);
      throw new Error(`Failed to get requests: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getResponses(requestId: string): Promise<FlexibilityResponse[]> {
    if (!this.isInitialized) {
      throw new Error('Flexibility Management service not initialized');
    }
    
    try {
      const { data, error } = await supabase
        .from('flexibility_responses')
        .select('*')
        .eq('request_id', requestId)
        .order('start_time', { ascending: false });
      
      if (error) throw error;
      
      return data.map((response: any) => ({
        requestId: response.request_id,
        assetId: response.asset_id,
        actualPower: response.actual_power,
        startTime: new Date(response.start_time),
        endTime: new Date(response.end_time),
        energyImpact: response.energy_impact,
        costImpact: response.cost_impact,
        currency: response.currency,
        status: response.status,
        metadata: response.metadata
      }));
    } catch (error) {
      console.error('Failed to get responses:', error);
      throw new Error(`Failed to get responses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async optimizeFlexibility(assetIds: string[], horizon: number = 24): Promise<FlexibilityRequest[]> {
    if (!this.isInitialized) {
      throw new Error('Flexibility Management service not initialized');
    }
    
    try {
      // Get assets
      const assets = assetIds.map(id => this.assets.get(id)).filter(Boolean) as FlexibilityAsset[];
      
      if (assets.length === 0) {
        throw new Error('No valid assets provided');
      }
      
      // Get market prices
      const prices = await this.marketService.predictPrices(horizon);
      
      // Get grid signals
      const gridSignals = await this.gridSignalService.getSignals({
        region: '*',
        types: ['PRICING', 'CAPACITY'],
        minPriority: 'LOW',
        maxAge: horizon * 60 // Convert hours to minutes
      });
      
      // Get energy data
      const now = new Date();
      const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
      
      const energyData = await this.energyDataService.aggregateData({
        interval: 'hour',
        metrics: ['demand', 'generation'],
        devices: ['*'],
        startTime,
        endTime: now
      });
      
      // Generate optimization requests
      const requests: FlexibilityRequest[] = [];
      
      for (const asset of assets) {
        // Skip assets that are not available
        if (asset.status === 'ERROR') continue;
        
        // Generate requests for each hour in the horizon
        for (let i = 1; i <= horizon; i++) {
          const hourStart = new Date(now.getTime() + i * 60 * 60 * 1000);
          const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
          
          // Find price for this hour
          const price = this.findPriceForTime(prices, hourStart);
          
          // Find grid signals for this hour
          const signals = this.findSignalsForTime(gridSignals, hourStart);
          
          // Determine optimal power level
          const optimalPower = this.calculateOptimalPower(asset, price, signals);
          
          // Skip if no change needed
          if (Math.abs(optimalPower - (asset.currentPower || 0)) < 0.1) continue;
          
          // Create request
          const request: Omit<FlexibilityRequest, 'id' | 'status'> = {
            assetId: asset.id,
            type: optimalPower > (asset.currentPower || 0) ? 'INCREASE' : 'DECREASE',
            targetPower: optimalPower,
            startTime: hourStart,
            endTime: hourEnd,
            priority: this.determinePriority(price, signals),
            reason: `Optimization based on price (${price}) and grid signals`,
            metadata: {
              price,
              signals: signals.map(s => ({ type: s.type, value: s.value }))
            }
          };
          
          // Add to requests
          requests.push({
            ...request,
            id: crypto.randomUUID(),
            status: 'PENDING'
          });
        }
      }
      
      // Store requests
      for (const request of requests) {
        await this.storeRequest(request);
      }
      
      return requests;
    } catch (error) {
      console.error('Failed to optimize flexibility:', error);
      throw new Error(`Failed to optimize flexibility: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private findPriceForTime(prices: MarketPrice[], time: Date): number {
    // Find closest price to the given time
    if (prices.length === 0) return 0;
    
    let closestPrice = prices[0];
    let minDiff = Math.abs(closestPrice.timestamp.getTime() - time.getTime());
    
    for (const price of prices) {
      const diff = Math.abs(price.timestamp.getTime() - time.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closestPrice = price;
      }
    }
    
    return closestPrice.price;
  }

  private findSignalsForTime(signals: GridSignal[], time: Date): GridSignal[] {
    // Find signals closest to the given time
    if (signals.length === 0) return [];
    
    const timeWindow = 60 * 60 * 1000; // 1 hour window
    return signals.filter(signal => {
      const diff = Math.abs(signal.timestamp.getTime() - time.getTime());
      return diff <= timeWindow;
    });
  }

  private calculateOptimalPower(
    asset: FlexibilityAsset,
    price: number,
    signals: GridSignal[]
  ): number {
    // Different optimization strategies based on asset type
    switch (asset.type) {
      case 'BATTERY':
        return this.optimizeBattery(asset, price, signals);
      
      case 'HEAT_PUMP':
      case 'HVAC':
        return this.optimizeHeatingCooling(asset, price, signals);
      
      case 'EV':
        return this.optimizeEV(asset, price, signals);
      
      case 'WATER_HEATER':
        return this.optimizeWaterHeater(asset, price, signals);
      
      case 'INDUSTRIAL_LOAD':
        return this.optimizeIndustrialLoad(asset, price, signals);
      
      default:
        return asset.currentPower || 0;
    }
  }

  private optimizeBattery(
    asset: FlexibilityAsset,
    price: number,
    signals: GridSignal[]
  ): number {
    const currentPower = asset.currentPower || 0;
    const stateOfCharge = asset.stateOfCharge || 0;
    
    // Find capacity signals
    const capacitySignals = signals.filter(s => s.type === 'CAPACITY');
    const avgCapacitySignal = capacitySignals.length > 0 
      ? capacitySignals.reduce((sum, s) => sum + s.value, 0) / capacitySignals.length 
      : 0;
    
    // Determine if we should charge or discharge
    if (price > this.config.priceThreshold || avgCapacitySignal > this.config.carbonThreshold) {
      // High price or high carbon - discharge if possible
      if (stateOfCharge > 20) {
        return Math.max(asset.minCapacity, -asset.capacity);
      }
    } else {
      // Low price or low carbon - charge if possible
      if (stateOfCharge < 80) {
        return Math.min(asset.maxCapacity, asset.capacity);
      }
    }
    
    return 0; // No action
  }

  private optimizeHeatingCooling(
    asset: FlexibilityAsset,
    price: number,
    signals: GridSignal[]
  ): number {
    const currentPower = asset.currentPower || 0;
    
    // Determine if we should adjust based on price
    if (price > this.config.priceThreshold * 1.5) {
      // Very high price - reduce usage
      return Math.max(asset.minCapacity, currentPower * 0.7);
    } else if (price < this.config.priceThreshold * 0.5) {
      // Very low price - increase usage
      return Math.min(asset.maxCapacity, currentPower * 1.3);
    }
    
    return currentPower; // No significant change
  }

  private optimizeEV(
    asset: FlexibilityAsset,
    price: number,
    signals: GridSignal[]
  ): number {
    const currentPower = asset.currentPower || 0;
    const hour = new Date().getHours();
    
    // Determine if we should adjust based on price and time
    if (price > this.config.priceThreshold && hour >= 18 && hour < 22) {
      // High price during evening peak - reduce charging
      return Math.max(asset.minCapacity, currentPower * 0.5);
    } else if (price < this.config.priceThreshold * 0.5 && hour >= 0 && hour < 6) {
      // Low price during night - increase charging
      return Math.min(asset.maxCapacity, asset.capacity);
    }
    
    return currentPower; // No significant change
  }

  private optimizeWaterHeater(
    asset: FlexibilityAsset,
    price: number,
    signals: GridSignal[]
  ): number {
    const currentPower = asset.currentPower || 0;
    const hour = new Date().getHours();
    
    // Determine if we should adjust based on price and time
    if (price > this.config.priceThreshold && (hour >= 7 && hour < 9) || (hour >= 18 && hour < 20)) {
      // High price during typical shower times - reduce heating
      return Math.max(asset.minCapacity, currentPower * 0.6);
    } else if (price < this.config.priceThreshold * 0.5 && hour >= 0 && hour < 5) {
      // Low price during night - increase heating
      return Math.min(asset.maxCapacity, asset.capacity);
    }
    
    return currentPower; // No significant change
  }

  private optimizeIndustrialLoad(
    asset: FlexibilityAsset,
    price: number,
    signals: GridSignal[]
  ): number {
    const currentPower = asset.currentPower || 0;
    
    // Determine if we should adjust based on price
    if (price > this.config.priceThreshold * 2) {
      // Very high price - significant reduction
      return Math.max(asset.minCapacity, currentPower * 0.5);
    } else if (price > this.config.priceThreshold) {
      // High price - moderate reduction
      return Math.max(asset.minCapacity, currentPower * 0.8);
    } else if (price < this.config.priceThreshold * 0.3) {
      // Very low price - increase usage
      return Math.min(asset.maxCapacity, currentPower * 1.2);
    }
    
    return currentPower; // No significant change
  }

  private determinePriority(
    price: number,
    signals: GridSignal[]
  ): FlexibilityRequest['priority'] {
    // Find capacity signals
    const capacitySignals = signals.filter(s => s.type === 'CAPACITY');
    const avgCapacitySignal = capacitySignals.length > 0 
      ? capacitySignals.reduce((sum, s) => sum + s.value, 0) / capacitySignals.length 
      : 0;
    
    // Determine priority based on price and signals
    if (price > this.config.priceThreshold * 2 || avgCapacitySignal > this.config.carbonThreshold * 1.5) {
      return 'CRITICAL';
    } else if (price > this.config.priceThreshold * 1.5 || avgCapacitySignal > this.config.carbonThreshold) {
      return 'HIGH';
    } else if (price > this.config.priceThreshold || avgCapacitySignal > this.config.carbonThreshold * 0.5) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  async dispose(): Promise<void> {
    if (this.realtimeSubscription) {
      await supabase.removeChannel(this.realtimeSubscription);
    }
    
    this.assets.clear();
    this.requests.clear();
    this.responses.clear();
    this.isInitialized = false;
  }
} 