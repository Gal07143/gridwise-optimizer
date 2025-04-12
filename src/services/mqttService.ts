import { Device, TelemetryData } from '@/types/device';
import { supabase } from './supabase';
import { MLService } from './mlService';

export interface MQTTConfig {
  brokerUrl: string;
  port: number;
  username: string;
  password: string;
  clientId: string;
  keepAlive: number;
  reconnectPeriod: number;
  qos: 0 | 1 | 2;
}

export interface MQTTMessage {
  topic: string;
  payload: string;
  timestamp: Date;
  qos: number;
  retain: boolean;
}

export interface MQTTSubscription {
  topic: string;
  callback: (message: MQTTMessage) => void;
  qos: 0 | 1 | 2;
}

export class MQTTService {
  private config: MQTTConfig;
  private mlService: MLService;
  private isInitialized: boolean = false;
  private isConnected: boolean = false;
  private subscriptions: Map<string, MQTTSubscription[]> = new Map();
  private messageHistory: Map<string, MQTTMessage[]> = new Map();
  private readonly MAX_HISTORY = 1000;
  private client: any = null; // In a real implementation, this would be an MQTT client

  constructor(config: MQTTConfig) {
    this.config = config;
    this.mlService = new MLService({
      modelPath: '/models/mqtt_anomaly.onnx',
      modelType: 'fault',
      inputShape: [100, 5],
      outputShape: [1, 3],
      featureNames: ['payload_size', 'message_rate', 'topic_complexity', 'qos_level', 'retain_flag']
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize ML service
      await this.mlService.initialize();
      
      // Connect to MQTT broker
      await this.connect();
      
      this.isInitialized = true;
      console.log('MQTT service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MQTT service:', error);
      throw new Error(`Failed to initialize MQTT service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async connect(): Promise<void> {
    // This is a simulation - in a real implementation, this would use an MQTT library
    console.log(`Connecting to MQTT broker at ${this.config.brokerUrl}:${this.config.port}`);
    
    // Simulate connection
    setTimeout(() => {
      this.isConnected = true;
      console.log('Connected to MQTT broker');
      
      // Simulate receiving messages
      this.startMessageSimulation();
    }, 1000);
  }

  private startMessageSimulation(): void {
    // Simulate receiving messages every second
    setInterval(() => {
      if (!this.isConnected) return;
      
      // Generate random messages for subscribed topics
      for (const [topic, subs] of this.subscriptions.entries()) {
        if (subs.length === 0) continue;
        
        // Generate a random payload
        const payload = JSON.stringify({
          timestamp: new Date().toISOString(),
          value: Math.random() * 100,
          unit: 'kW',
          device_id: `device_${Math.floor(Math.random() * 10)}`
        });
        
        // Create message
        const message: MQTTMessage = {
          topic,
          payload,
          timestamp: new Date(),
          qos: this.config.qos,
          retain: false
        };
        
        // Store in history
        this.storeMessage(topic, message);
        
        // Call callbacks
        for (const sub of subs) {
          sub.callback(message);
        }
      }
    }, 1000);
  }

  private storeMessage(topic: string, message: MQTTMessage): void {
    if (!this.messageHistory.has(topic)) {
      this.messageHistory.set(topic, []);
    }
    
    const history = this.messageHistory.get(topic)!;
    history.push(message);
    
    // Keep only the last MAX_HISTORY messages
    if (history.length > this.MAX_HISTORY) {
      history.shift();
    }
  }

  async subscribe(topic: string, callback: (message: MQTTMessage) => void, qos: 0 | 1 | 2 = 0): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('MQTT service not initialized');
    }
    
    // Add to subscriptions
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, []);
    }
    
    this.subscriptions.get(topic)!.push({ topic, callback, qos });
    
    console.log(`Subscribed to topic: ${topic} with QoS ${qos}`);
  }

  async unsubscribe(topic: string, callback?: (message: MQTTMessage) => void): Promise<void> {
    if (!this.subscriptions.has(topic)) return;
    
    if (callback) {
      // Remove specific callback
      const subs = this.subscriptions.get(topic)!;
      const index = subs.findIndex(sub => sub.callback === callback);
      if (index !== -1) {
        subs.splice(index, 1);
      }
      
      // Remove topic if no more callbacks
      if (subs.length === 0) {
        this.subscriptions.delete(topic);
      }
    } else {
      // Remove all callbacks for topic
      this.subscriptions.delete(topic);
    }
    
    console.log(`Unsubscribed from topic: ${topic}`);
  }

  async publish(topic: string, payload: string, qos: 0 | 1 | 2 = 0, retain: boolean = false): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('MQTT service not initialized');
    }
    
    // Create message
    const message: MQTTMessage = {
      topic,
      payload,
      timestamp: new Date(),
      qos,
      retain
    };
    
    // Store in history
    this.storeMessage(topic, message);
    
    console.log(`Published to topic: ${topic} with QoS ${qos}`);
  }

  async getMessageHistory(topic: string, limit: number = 100): Promise<MQTTMessage[]> {
    return this.messageHistory.get(topic)?.slice(-limit) || [];
  }

  async processTelemetryData(message: MQTTMessage): Promise<void> {
    try {
      // Parse payload
      const data = JSON.parse(message.payload);
      
      // Convert to telemetry data format
      const telemetryData: TelemetryData = {
        id: `${data.device_id}_${new Date(data.timestamp).getTime()}`,
        deviceId: data.device_id,
        timestamp: new Date(data.timestamp),
        value: data.value,
        quality: 'good',
        metadata: {
          unit: data.unit || 'unknown',
          source: 'mqtt'
        }
      };
      
      // Store in database
      const { error } = await supabase
        .from('telemetry_data')
        .insert(telemetryData);
      
      if (error) throw error;
    } catch (error) {
      console.error('Failed to process telemetry data:', error);
    }
  }

  async detectAnomalies(message: MQTTMessage): Promise<void> {
    try {
      // Get message history for this topic
      const history = this.messageHistory.get(message.topic) || [];
      
      if (history.length < 10) return;
      
      // Calculate message rate
      const recentMessages = history.slice(-10);
      const timeSpan = recentMessages[recentMessages.length - 1].timestamp.getTime() - 
                       recentMessages[0].timestamp.getTime();
      const messageRate = timeSpan > 0 ? 10000 / timeSpan : 0;
      
      // Calculate payload size
      const payloadSize = message.payload.length;
      
      // Calculate topic complexity (number of segments)
      const topicComplexity = message.topic.split('/').length;
      
      // Detect anomaly
      const result = await this.mlService.detectAnomalies({
        data: [{
          payload_size: payloadSize,
          message_rate: messageRate,
          topic_complexity: topicComplexity,
          qos_level: message.qos,
          retain_flag: message.retain ? 1 : 0
        }]
      } as any);
      
      // If anomaly detected, log it
      if (result.anomalyScore > 0.7) {
        console.log(`Anomaly detected for topic ${message.topic}: ${result.anomalyScore}`);
      }
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    console.log('Disconnected from MQTT broker');
  }

  async dispose(): Promise<void> {
    await this.disconnect();
    this.subscriptions.clear();
    this.messageHistory.clear();
    this.isInitialized = false;
  }
} 