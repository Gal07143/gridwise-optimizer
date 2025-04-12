import { MLService } from './mlService';
import { Device, TelemetryData } from '@/types/device';

export interface FailurePrediction {
  deviceId: string;
  timestamp: Date;
  failureProbability: number;
  confidence: number;
  predictedFailureTime?: Date;
  contributingFactors: {
    factor: string;
    impact: number;
  }[];
  recommendations: string[];
}

export interface DeviceHealthMetrics {
  overallHealth: number;
  componentHealth: {
    [component: string]: number;
  };
  degradationRate: number;
  estimatedLifetime: number;
  maintenanceNeeded: boolean;
  nextMaintenanceDate?: Date;
}

export class DeviceFailurePredictionService {
  private mlService: MLService;
  private historicalData: Map<string, TelemetryData[]> = new Map();
  private readonly MAX_HISTORICAL_DATA_POINTS = 1000;

  constructor() {
    this.mlService = new MLService({
      modelPath: '/models/device_failure_prediction.onnx',
      inputShape: [720, 10], // 30 days of hourly data, 10 features
      outputShape: [1, 5], // Failure probability, confidence, and contributing factors
      featureNames: [
        'temperature',
        'voltage',
        'current',
        'power_factor',
        'frequency',
        'vibration',
        'noise_level',
        'error_count',
        'uptime',
        'load_factor'
      ]
    });
  }

  async initialize(): Promise<void> {
    await this.mlService.initialize();
  }

  async predictDeviceFailure(
    device: Device,
    telemetryData: TelemetryData[]
  ): Promise<FailurePrediction> {
    try {
      // Update historical data
      this.updateHistoricalData(device.id, telemetryData);
      
      // Prepare data for prediction
      const historicalData = this.historicalData.get(device.id) || [];
      const processedData = this.preprocessData(historicalData);
      
      // Get prediction from ML model
      const prediction = await this.mlService.detectAnomalies({
        data: processedData
      } as any);
      
      // Calculate contributing factors
      const contributingFactors = this.analyzeContributingFactors(processedData, prediction);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(prediction, contributingFactors);
      
      // Calculate predicted failure time if probability is high
      const predictedFailureTime = this.calculatePredictedFailureTime(prediction, contributingFactors);
      
      return {
        deviceId: device.id,
        timestamp: new Date(),
        failureProbability: prediction.prediction,
        confidence: prediction.confidence,
        predictedFailureTime,
        contributingFactors,
        recommendations
      };
    } catch (error) {
      console.error('Error predicting device failure:', error);
      throw new Error('Failed to predict device failure');
    }
  }

  async analyzeDeviceHealth(
    device: Device,
    telemetryData: TelemetryData[]
  ): Promise<DeviceHealthMetrics> {
    try {
      // Update historical data
      this.updateHistoricalData(device.id, telemetryData);
      
      // Prepare data for analysis
      const historicalData = this.historicalData.get(device.id) || [];
      const processedData = this.preprocessData(historicalData);
      
      // Get health analysis from ML model
      const analysis = await this.mlService.detectAnomalies({
        data: processedData
      } as any);
      
      // Calculate component health
      const componentHealth = this.calculateComponentHealth(processedData);
      
      // Calculate degradation rate
      const degradationRate = this.calculateDegradationRate(historicalData);
      
      // Estimate lifetime
      const estimatedLifetime = this.estimateLifetime(componentHealth, degradationRate);
      
      // Determine if maintenance is needed
      const maintenanceNeeded = this.determineMaintenanceNeeded(componentHealth, degradationRate);
      
      // Calculate next maintenance date if needed
      const nextMaintenanceDate = maintenanceNeeded 
        ? this.calculateNextMaintenanceDate(componentHealth, degradationRate)
        : undefined;
      
      return {
        overallHealth: analysis.prediction,
        componentHealth,
        degradationRate,
        estimatedLifetime,
        maintenanceNeeded,
        nextMaintenanceDate
      };
    } catch (error) {
      console.error('Error analyzing device health:', error);
      throw new Error('Failed to analyze device health');
    }
  }

  private updateHistoricalData(deviceId: string, newData: TelemetryData[]): void {
    const existingData = this.historicalData.get(deviceId) || [];
    const combinedData = [...existingData, ...newData];
    
    // Keep only the most recent data points
    if (combinedData.length > this.MAX_HISTORICAL_DATA_POINTS) {
      combinedData.splice(0, combinedData.length - this.MAX_HISTORICAL_DATA_POINTS);
    }
    
    this.historicalData.set(deviceId, combinedData);
  }

  private preprocessData(data: TelemetryData[]): any[] {
    // Implementation would normalize and prepare data for ML model
    return data.map(d => ({
      temperature: d.temperature || 0,
      voltage: d.voltage || 0,
      current: d.current || 0,
      power_factor: d.powerFactor || 0,
      frequency: d.frequency || 0,
      vibration: d.vibration || 0,
      noise_level: d.noiseLevel || 0,
      error_count: d.errorCount || 0,
      uptime: d.uptime || 0,
      load_factor: d.loadFactor || 0
    }));
  }

  private analyzeContributingFactors(data: any[], prediction: any): { factor: string; impact: number }[] {
    // Implementation would analyze which factors contribute most to failure risk
    return [
      { factor: 'Temperature', impact: 0.3 },
      { factor: 'Voltage Fluctuations', impact: 0.25 },
      { factor: 'High Load', impact: 0.2 },
      { factor: 'Age', impact: 0.15 },
      { factor: 'Error Rate', impact: 0.1 }
    ];
  }

  private generateRecommendations(prediction: any, factors: { factor: string; impact: number }[]): string[] {
    const recommendations: string[] = [];
    
    if (prediction.prediction > 0.7) {
      recommendations.push('Immediate maintenance recommended');
    } else if (prediction.prediction > 0.5) {
      recommendations.push('Schedule maintenance within the next week');
    } else if (prediction.prediction > 0.3) {
      recommendations.push('Monitor device closely and plan maintenance');
    }
    
    // Add specific recommendations based on contributing factors
    factors.forEach(factor => {
      if (factor.impact > 0.2) {
        recommendations.push(`Address ${factor.factor} issues to reduce failure risk`);
      }
    });
    
    return recommendations;
  }

  private calculatePredictedFailureTime(
    prediction: any,
    factors: { factor: string; impact: number }[]
  ): Date | undefined {
    if (prediction.prediction < 0.5) {
      return undefined;
    }
    
    // Simple calculation based on failure probability and factor impacts
    const totalImpact = factors.reduce((sum, f) => sum + f.impact, 0);
    const daysUntilFailure = Math.round(30 * (1 - prediction.prediction) / totalImpact);
    
    const failureDate = new Date();
    failureDate.setDate(failureDate.getDate() + daysUntilFailure);
    
    return failureDate;
  }

  private calculateComponentHealth(data: any[]): { [component: string]: number } {
    // Implementation would calculate health scores for different components
    return {
      'Power Supply': 0.85,
      'Processor': 0.92,
      'Memory': 0.78,
      'Storage': 0.95,
      'Network': 0.88
    };
  }

  private calculateDegradationRate(data: TelemetryData[]): number {
    // Implementation would calculate how quickly the device is degrading
    return 0.05; // 5% degradation per month
  }

  private estimateLifetime(
    componentHealth: { [component: string]: number },
    degradationRate: number
  ): number {
    // Find the component with the lowest health
    const lowestHealth = Math.min(...Object.values(componentHealth));
    
    // Estimate lifetime in months
    return Math.round((1 - lowestHealth) / degradationRate);
  }

  private determineMaintenanceNeeded(
    componentHealth: { [component: string]: number },
    degradationRate: number
  ): boolean {
    // Check if any component has health below threshold
    const hasUnhealthyComponent = Object.values(componentHealth).some(health => health < 0.7);
    
    // Check if degradation rate is too high
    const hasHighDegradation = degradationRate > 0.1;
    
    return hasUnhealthyComponent || hasHighDegradation;
  }

  private calculateNextMaintenanceDate(
    componentHealth: { [component: string]: number },
    degradationRate: number
  ): Date {
    // Find the component with the lowest health
    const lowestHealth = Math.min(...Object.values(componentHealth));
    
    // Calculate days until maintenance needed
    const daysUntilMaintenance = Math.round((0.7 - lowestHealth) / (degradationRate / 30) * 30);
    
    const maintenanceDate = new Date();
    maintenanceDate.setDate(maintenanceDate.getDate() + daysUntilMaintenance);
    
    return maintenanceDate;
  }

  async dispose(): Promise<void> {
    await this.mlService.dispose();
  }
} 