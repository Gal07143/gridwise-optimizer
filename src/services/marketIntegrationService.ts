import { supabase } from './supabase';
import { MLService } from './mlService';
import { GridSignalService, GridSignal } from './gridSignalService';
import { EnergyDataAggregationService, AggregatedData } from './energyDataAggregationService';

export interface MarketConfig {
  marketType: 'DAY_AHEAD' | 'REAL_TIME' | 'BALANCING';
  region: string;
  currency: string;
  minBidSize: number;
  maxBidSize: number;
  pricePrecision: number;
  volumePrecision: number;
  tradingHours: {
    start: string; // HH:MM format
    end: string; // HH:MM format
    timezone: string;
  };
}

export interface MarketOrder {
  id: string;
  type: 'BUY' | 'SELL';
  price: number;
  volume: number;
  timestamp: Date;
  status: 'PENDING' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELLED' | 'REJECTED';
  marketType: string;
  region: string;
  metadata?: Record<string, any>;
}

export interface MarketPrice {
  timestamp: Date;
  marketType: string;
  region: string;
  price: number;
  volume: number;
  currency: string;
}

export interface MarketPosition {
  marketType: string;
  region: string;
  netPosition: number; // Positive for long, negative for short
  averagePrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  currency: string;
}

export class MarketIntegrationService {
  private mlService: MLService;
  private gridSignalService: GridSignalService;
  private energyDataService: EnergyDataAggregationService;
  private isInitialized: boolean = false;
  private config: MarketConfig;
  private orderHistory: Map<string, MarketOrder[]> = new Map();
  private priceHistory: Map<string, MarketPrice[]> = new Map();
  private positions: Map<string, MarketPosition> = new Map();
  private readonly MAX_HISTORY = 1000;
  private realtimeSubscription: any = null;

  constructor(config: MarketConfig) {
    this.config = config;
    this.mlService = new MLService({
      modelPath: '/models/market_prediction.onnx',
      modelType: 'price',
      inputShape: [100, 7],
      outputShape: [1, 3],
      featureNames: ['price', 'volume', 'grid_signal', 'demand', 'generation', 'time_of_day', 'day_of_week']
    });
    this.gridSignalService = new GridSignalService();
    this.energyDataService = new EnergyDataAggregationService();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize services
      await this.mlService.initialize();
      await this.gridSignalService.initialize();
      await this.energyDataService.initialize();
      
      // Load positions
      await this.loadPositions();
      
      // Subscribe to realtime updates
      this.setupRealtimeSubscription();
      
      this.isInitialized = true;
      console.log('Market Integration service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Market Integration service:', error);
      throw new Error(`Failed to initialize Market Integration service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async loadPositions(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('market_positions')
        .select('*')
        .eq('market_type', this.config.marketType)
        .eq('region', this.config.region);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const position = data[0];
        this.positions.set(this.getPositionKey(), {
          marketType: position.market_type,
          region: position.region,
          netPosition: position.net_position,
          averagePrice: position.average_price,
          unrealizedPnL: position.unrealized_pnl,
          realizedPnL: position.realized_pnl,
          currency: position.currency
        });
      } else {
        // Initialize with zero position
        this.positions.set(this.getPositionKey(), {
          marketType: this.config.marketType,
          region: this.config.region,
          netPosition: 0,
          averagePrice: 0,
          unrealizedPnL: 0,
          realizedPnL: 0,
          currency: this.config.currency
        });
      }
    } catch (error) {
      console.error('Failed to load positions:', error);
      throw error;
    }
  }

  private setupRealtimeSubscription(): void {
    this.realtimeSubscription = supabase
      .channel('market_data')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'market_prices' 
      }, (payload: any) => {
        const price = this.convertToMarketPrice(payload.new);
        this.processPrice(price);
      })
      .subscribe();
  }

  private convertToMarketPrice(data: any): MarketPrice {
    return {
      timestamp: new Date(data.timestamp),
      marketType: data.market_type,
      region: data.region,
      price: data.price,
      volume: data.volume,
      currency: data.currency
    };
  }

  private processPrice(price: MarketPrice): void {
    // Store in history
    this.storePrice(price);
    
    // Update positions
    this.updatePositions(price);
  }

  private storePrice(price: MarketPrice): void {
    const key = `${price.marketType}_${price.region}`;
    
    if (!this.priceHistory.has(key)) {
      this.priceHistory.set(key, []);
    }
    
    const history = this.priceHistory.get(key)!;
    history.push(price);
    
    // Keep only the last MAX_HISTORY prices
    if (history.length > this.MAX_HISTORY) {
      history.shift();
    }
  }

  private updatePositions(price: MarketPrice): void {
    const positionKey = this.getPositionKey();
    const position = this.positions.get(positionKey);
    
    if (!position) return;
    
    // Calculate unrealized PnL
    const marketValue = position.netPosition * price.price;
    const costBasis = position.netPosition * position.averagePrice;
    position.unrealizedPnL = marketValue - costBasis;
    
    // Update position in database
    this.updatePositionInDatabase(position).catch(error => {
      console.error('Failed to update position in database:', error);
    });
  }

  private async updatePositionInDatabase(position: MarketPosition): Promise<void> {
    try {
      const { error } = await supabase
        .from('market_positions')
        .upsert({
          market_type: position.marketType,
          region: position.region,
          net_position: position.netPosition,
          average_price: position.averagePrice,
          unrealized_pnl: position.unrealizedPnL,
          realized_pnl: position.realizedPnL,
          currency: position.currency,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Failed to update position in database:', error);
      throw error;
    }
  }

  private getPositionKey(): string {
    return `${this.config.marketType}_${this.config.region}`;
  }

  async placeOrder(order: Omit<MarketOrder, 'id' | 'timestamp' | 'status'>): Promise<MarketOrder> {
    if (!this.isInitialized) {
      throw new Error('Market Integration service not initialized');
    }
    
    try {
      // Validate order
      this.validateOrder(order);
      
      // Create order object
      const newOrder: MarketOrder = {
        ...order,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        status: 'PENDING'
      };
      
      // Store order
      await this.storeOrder(newOrder);
      
      // Simulate order execution (in a real implementation, this would call a market API)
      await this.simulateOrderExecution(newOrder);
      
      return newOrder;
    } catch (error) {
      console.error('Failed to place order:', error);
      throw new Error(`Failed to place order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateOrder(order: Omit<MarketOrder, 'id' | 'timestamp' | 'status'>): void {
    // Check market type
    if (order.marketType !== this.config.marketType) {
      throw new Error(`Invalid market type: ${order.marketType}`);
    }
    
    // Check region
    if (order.region !== this.config.region) {
      throw new Error(`Invalid region: ${order.region}`);
    }
    
    // Check volume
    if (order.volume < this.config.minBidSize) {
      throw new Error(`Order volume ${order.volume} is below minimum ${this.config.minBidSize}`);
    }
    
    if (order.volume > this.config.maxBidSize) {
      throw new Error(`Order volume ${order.volume} is above maximum ${this.config.maxBidSize}`);
    }
    
    // Check if market is open
    if (!this.isMarketOpen()) {
      throw new Error('Market is closed');
    }
  }

  private isMarketOpen(): boolean {
    const now = new Date();
    const timezone = this.config.tradingHours.timezone;
    
    // Convert current time to market timezone
    const marketTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    
    // Get current time in HH:MM format
    const currentTime = marketTime.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Check if current time is within trading hours
    return currentTime >= this.config.tradingHours.start && currentTime <= this.config.tradingHours.end;
  }

  private async storeOrder(order: MarketOrder): Promise<void> {
    try {
      // Store in database
      const { error } = await supabase
        .from('market_orders')
        .insert({
          id: order.id,
          type: order.type,
          price: order.price,
          volume: order.volume,
          timestamp: order.timestamp.toISOString(),
          status: order.status,
          market_type: order.marketType,
          region: order.region,
          metadata: order.metadata
        });
      
      if (error) throw error;
      
      // Store in memory
      const key = `${order.marketType}_${order.region}`;
      
      if (!this.orderHistory.has(key)) {
        this.orderHistory.set(key, []);
      }
      
      this.orderHistory.get(key)!.push(order);
    } catch (error) {
      console.error('Failed to store order:', error);
      throw error;
    }
  }

  private async simulateOrderExecution(order: MarketOrder): Promise<void> {
    // In a real implementation, this would call a market API
    // For now, we'll simulate execution with a delay
    
    setTimeout(async () => {
      try {
        // Get current market price
        const key = `${order.marketType}_${order.region}`;
        const priceHistory = this.priceHistory.get(key) || [];
        
        if (priceHistory.length === 0) {
          // No price data, reject order
          await this.updateOrderStatus(order.id, 'REJECTED');
          return;
        }
        
        const currentPrice = priceHistory[priceHistory.length - 1].price;
        
        // Simulate execution
        const executedOrder = { ...order };
        
        // Check if order would be executed at current price
        if ((order.type === 'BUY' && order.price >= currentPrice) || 
            (order.type === 'SELL' && order.price <= currentPrice)) {
          // Order would be executed
          executedOrder.status = 'FILLED';
          
          // Update position
          await this.updatePosition(executedOrder);
        } else {
          // Order would not be executed at current price
          executedOrder.status = 'CANCELLED';
        }
        
        // Update order status
        await this.updateOrderStatus(executedOrder.id, executedOrder.status);
      } catch (error) {
        console.error('Failed to simulate order execution:', error);
      }
    }, 1000); // 1 second delay
  }

  private async updateOrderStatus(orderId: string, status: MarketOrder['status']): Promise<void> {
    try {
      // Update in database
      const { error } = await supabase
        .from('market_orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update in memory
      for (const [key, orders] of this.orderHistory.entries()) {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
          orders[orderIndex].status = status;
          break;
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  }

  private async updatePosition(order: MarketOrder): Promise<void> {
    const positionKey = this.getPositionKey();
    const position = this.positions.get(positionKey);
    
    if (!position) return;
    
    // Calculate position change
    const volumeChange = order.type === 'BUY' ? order.volume : -order.volume;
    
    // Update position
    const newPosition = position.netPosition + volumeChange;
    const newCost = (position.netPosition * position.averagePrice) + (volumeChange * order.price);
    
    position.netPosition = newPosition;
    position.averagePrice = newPosition !== 0 ? newCost / newPosition : 0;
    
    // Update position in database
    await this.updatePositionInDatabase(position);
  }

  async getOrders(status?: MarketOrder['status']): Promise<MarketOrder[]> {
    if (!this.isInitialized) {
      throw new Error('Market Integration service not initialized');
    }
    
    try {
      let query = supabase
        .from('market_orders')
        .select('*')
        .eq('market_type', this.config.marketType)
        .eq('region', this.config.region);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      return data.map((order: any) => ({
        id: order.id,
        type: order.type,
        price: order.price,
        volume: order.volume,
        timestamp: new Date(order.timestamp),
        status: order.status,
        marketType: order.market_type,
        region: order.region,
        metadata: order.metadata
      }));
    } catch (error) {
      console.error('Failed to get orders:', error);
      throw new Error(`Failed to get orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPrices(limit: number = 100): Promise<MarketPrice[]> {
    if (!this.isInitialized) {
      throw new Error('Market Integration service not initialized');
    }
    
    try {
      const { data, error } = await supabase
        .from('market_prices')
        .select('*')
        .eq('market_type', this.config.marketType)
        .eq('region', this.config.region)
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return data.map((price: any) => ({
        timestamp: new Date(price.timestamp),
        marketType: price.market_type,
        region: price.region,
        price: price.price,
        volume: price.volume,
        currency: price.currency
      }));
    } catch (error) {
      console.error('Failed to get prices:', error);
      throw new Error(`Failed to get prices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPosition(): Promise<MarketPosition | null> {
    if (!this.isInitialized) {
      throw new Error('Market Integration service not initialized');
    }
    
    return this.positions.get(this.getPositionKey()) || null;
  }

  async predictPrices(hours: number = 24): Promise<MarketPrice[]> {
    if (!this.isInitialized) {
      throw new Error('Market Integration service not initialized');
    }
    
    try {
      // Get historical data
      const prices = await this.getPrices(100);
      if (prices.length === 0) {
        throw new Error('No historical price data available');
      }
      
      // Get grid signals
      const gridSignals = await this.gridSignalService.getSignals({
        region: this.config.region,
        types: ['PRICING'],
        minPriority: 'LOW',
        maxAge: 24 * 60 // 24 hours
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
      
      // Prepare features for prediction
      const features = this.prepareFeatures(prices, gridSignals, energyData.data);
      
      // Predict prices
      const predictions: MarketPrice[] = [];
      const lastPrice = prices[0];
      
      for (let i = 1; i <= hours; i++) {
        const predictionTime = new Date(now.getTime() + i * 60 * 60 * 1000);
        
        // Predict price
        const result = await this.mlService.predict({
          data: features
        } as any);
        
        // Create prediction
        predictions.push({
          timestamp: predictionTime,
          marketType: this.config.marketType,
          region: this.config.region,
          price: result.predictions[0],
          volume: lastPrice.volume,
          currency: this.config.currency
        });
        
        // Update features for next prediction
        features.shift();
        features.push({
          price: result.predictions[0],
          volume: lastPrice.volume,
          grid_signal: features[features.length - 1].grid_signal,
          demand: features[features.length - 1].demand,
          generation: features[features.length - 1].generation,
          time_of_day: predictionTime.getHours() / 24,
          day_of_week: predictionTime.getDay() / 7
        });
      }
      
      return predictions;
    } catch (error) {
      console.error('Failed to predict prices:', error);
      throw new Error(`Failed to predict prices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private prepareFeatures(
    prices: MarketPrice[], 
    gridSignals: GridSignal[], 
    energyData: AggregatedData[]
  ): any[] {
    const features: any[] = [];
    
    // Sort data by timestamp
    const sortedPrices = [...prices].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const sortedSignals = [...gridSignals].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const sortedEnergyData = [...energyData].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Create features for each hour
    for (let i = 0; i < Math.min(100, sortedPrices.length); i++) {
      const price = sortedPrices[i];
      const timestamp = price.timestamp;
      
      // Find closest grid signal
      const signal = this.findClosestSignal(sortedSignals, timestamp);
      
      // Find energy data for this hour
      const energy = this.findEnergyData(sortedEnergyData, timestamp);
      
      features.push({
        price: price.price,
        volume: price.volume,
        grid_signal: signal ? signal.value : 0,
        demand: energy?.avg || 0,
        generation: energy?.avg || 0,
        time_of_day: timestamp.getHours() / 24,
        day_of_week: timestamp.getDay() / 7
      });
    }
    
    return features;
  }

  private findClosestSignal(signals: GridSignal[], timestamp: Date): GridSignal | null {
    if (signals.length === 0) return null;
    
    let closestSignal = signals[0];
    let minDiff = Math.abs(closestSignal.timestamp.getTime() - timestamp.getTime());
    
    for (const signal of signals) {
      const diff = Math.abs(signal.timestamp.getTime() - timestamp.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closestSignal = signal;
      }
    }
    
    return closestSignal;
  }

  private findEnergyData(energyData: AggregatedData[], timestamp: Date): AggregatedData | null {
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

  async dispose(): Promise<void> {
    if (this.realtimeSubscription) {
      await supabase.removeChannel(this.realtimeSubscription);
    }
    
    this.orderHistory.clear();
    this.priceHistory.clear();
    this.positions.clear();
    this.isInitialized = false;
  }
} 