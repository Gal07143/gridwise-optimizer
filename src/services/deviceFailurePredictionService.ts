
import { Device, TelemetryData } from '@/types/device';

// Interface for failure prediction
export interface FailurePrediction {
  failureProbability: number;
  predictedFailureTime: Date | null;
  confidence: number;
  contributingFactors: {
    factor: string;
    impact: number;
  }[];
  recommendations: string[];
}

// Interface for device health metrics
export interface DeviceHealthMetrics {
  overallHealth: number;
  componentHealth: {
    [key: string]: number;
  };
  maintenanceNeeded: boolean;
  nextMaintenanceDate: Date | null;
  estimatedLifespan: {
    original: number;
    remaining: number;
    unit: string;
  };
}

// Device Failure Prediction Service
export class DeviceFailurePredictionService {
  // Initialize the service
  async initialize(): Promise<void> {
    console.log('Device Failure Prediction Service initialized');
    // In a real implementation, this would load ML models, etc.
  }
  
  // Predict potential device failures
  async predictDeviceFailure(device: Device, telemetryData: TelemetryData[]): Promise<FailurePrediction> {
    // This is a mock implementation that would be replaced with actual ML predictions
    
    // Simulate failure probability based on device age and telemetry patterns
    const deviceAge = this.calculateDeviceAge(device);
    const anomalyScore = this.detectAnomalies(telemetryData);
    
    // Calculate a failure probability (higher age and anomaly score increases probability)
    const baseProbability = Math.min(0.05 + deviceAge / 1000 + anomalyScore / 10, 0.95);
    
    // Add some randomness for simulation
    const failureProbability = Math.max(0, Math.min(1, baseProbability + (Math.random() * 0.1 - 0.05)));
    
    // Determine predicted failure time if probability is high enough
    let predictedFailureTime: Date | null = null;
    if (failureProbability > 0.6) {
      // Higher probability means sooner failure
      const daysUntilFailure = Math.floor((1 - failureProbability) * 90) + 5;
      predictedFailureTime = new Date();
      predictedFailureTime.setDate(predictedFailureTime.getDate() + daysUntilFailure);
    }
    
    // Generate contributing factors
    const contributingFactors = this.generateContributingFactors(device, telemetryData);
    
    // Generate recommendations based on the device and prediction
    const recommendations = this.generateRecommendations(device, failureProbability, contributingFactors);
    
    return {
      failureProbability,
      predictedFailureTime,
      confidence: 0.7 + Math.random() * 0.2, // Confidence between 70% and 90%
      contributingFactors,
      recommendations
    };
  }
  
  // Analyze device health
  async analyzeDeviceHealth(device: Device, telemetryData: TelemetryData[]): Promise<DeviceHealthMetrics> {
    // This is a mock implementation that would be replaced with actual health analysis
    
    // Calculate device age influence on health (newer devices are healthier)
    const deviceAge = this.calculateDeviceAge(device);
    const ageInfluence = Math.max(0, 1 - deviceAge / 1000);
    
    // Calculate telemetry influence on health
    const telemetryInfluence = this.calculateTelemetryHealth(telemetryData);
    
    // Combined health score
    const overallHealth = 0.4 * ageInfluence + 0.6 * telemetryInfluence;
    
    // Generate component health metrics
    const componentHealth = this.generateComponentHealth(device, telemetryData);
    
    // Determine if maintenance is needed
    const maintenanceNeeded = overallHealth < 0.7 || 
                              Object.values(componentHealth).some(health => health < 0.6);
    
    // Determine next maintenance date
    let nextMaintenanceDate: Date | null = null;
    if (maintenanceNeeded) {
      nextMaintenanceDate = new Date();
      // More urgent if health is lower
      const daysUntilMaintenance = Math.floor(overallHealth * 30) + 1;
      nextMaintenanceDate.setDate(nextMaintenanceDate.getDate() + daysUntilMaintenance);
    }
    
    return {
      overallHealth,
      componentHealth,
      maintenanceNeeded,
      nextMaintenanceDate,
      estimatedLifespan: {
        original: device.type === 'hvac' ? 180 : device.type === 'battery' ? 120 : 90,
        remaining: Math.floor(overallHealth * 100),
        unit: 'months'
      }
    };
  }
  
  // Calculate device age based on installation date
  private calculateDeviceAge(device: Device): number {
    if (!device.installed_at) return 365; // Default to 1 year if no date
    
    const installDate = new Date(device.installed_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - installDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Age in days
  }
  
  // Detect anomalies in telemetry data
  private detectAnomalies(telemetryData: TelemetryData[]): number {
    if (telemetryData.length < 2) return 0;
    
    let anomalyScore = 0;
    
    // Simple anomaly detection: check for sudden changes
    for (let i = 1; i < telemetryData.length; i++) {
      const prev = telemetryData[i - 1];
      const curr = telemetryData[i];
      
      if (prev.value && curr.value) {
        const change = Math.abs(curr.value - prev.value) / Math.max(0.1, prev.value);
        if (change > 0.5) anomalyScore += 0.1;
      }
    }
    
    return Math.min(1, anomalyScore);
  }
  
  // Calculate health based on telemetry patterns
  private calculateTelemetryHealth(telemetryData: TelemetryData[]): number {
    if (telemetryData.length === 0) return 0.8; // Default if no data
    
    let healthScore = 0.9; // Start with high health
    
    // Look for instability in readings
    let instabilityCount = 0;
    for (let i = 1; i < telemetryData.length; i++) {
      const prev = telemetryData[i - 1];
      const curr = telemetryData[i];
      
      if (prev.value && curr.value) {
        const change = Math.abs(curr.value - prev.value) / Math.max(0.1, prev.value);
        if (change > 0.3) instabilityCount++;
      }
    }
    
    // Reduce health based on instability
    healthScore -= instabilityCount * 0.02;
    
    // Add some randomness for simulation
    healthScore = Math.max(0.1, Math.min(0.99, healthScore + (Math.random() * 0.1 - 0.05)));
    
    return healthScore;
  }
  
  // Generate contributing factors for failure prediction
  private generateContributingFactors(device: Device, telemetryData: TelemetryData[]): { factor: string; impact: number }[] {
    const factors = [];
    
    // Age related factor
    const deviceAge = this.calculateDeviceAge(device);
    if (deviceAge > 365) {
      factors.push({
        factor: 'Device Age',
        impact: Math.min(0.8, deviceAge / 1825) // Max impact at 5 years
      });
    }
    
    // Usage pattern factor
    factors.push({
      factor: 'Usage Patterns',
      impact: 0.2 + Math.random() * 0.3
    });
    
    // Add factors based on device type
    if (device.type === 'hvac') {
      factors.push({
        factor: 'Temperature Fluctuations',
        impact: 0.3 + Math.random() * 0.2
      });
    } else if (device.type === 'battery') {
      factors.push({
        factor: 'Charge Cycles',
        impact: 0.4 + Math.random() * 0.3
      });
    } else if (device.type === 'inverter') {
      factors.push({
        factor: 'Power Quality',
        impact: 0.25 + Math.random() * 0.25
      });
    }
    
    // Environmental factor
    factors.push({
      factor: 'Environmental Conditions',
      impact: 0.1 + Math.random() * 0.2
    });
    
    // Maintenance history factor
    factors.push({
      factor: 'Maintenance History',
      impact: 0.15 + Math.random() * 0.25
    });
    
    // Sort by impact (highest first)
    return factors.sort((a, b) => b.impact - a.impact);
  }
  
  // Generate component health metrics
  private generateComponentHealth(device: Device, telemetryData: TelemetryData[]): { [key: string]: number } {
    const componentHealth: { [key: string]: number } = {};
    
    if (device.type === 'hvac') {
      componentHealth['Compressor'] = 0.7 + Math.random() * 0.2;
      componentHealth['Fan'] = 0.75 + Math.random() * 0.2;
      componentHealth['Thermostat'] = 0.8 + Math.random() * 0.15;
      componentHealth['Coils'] = 0.65 + Math.random() * 0.25;
    } else if (device.type === 'battery') {
      componentHealth['Cells'] = 0.6 + Math.random() * 0.3;
      componentHealth['Terminals'] = 0.8 + Math.random() * 0.15;
      componentHealth['BMS'] = 0.75 + Math.random() * 0.2;
      componentHealth['Cooling System'] = 0.7 + Math.random() * 0.2;
    } else {
      componentHealth['Main Board'] = 0.75 + Math.random() * 0.2;
      componentHealth['Power Supply'] = 0.7 + Math.random() * 0.25;
      componentHealth['Sensors'] = 0.8 + Math.random() * 0.15;
      componentHealth['Communication Module'] = 0.75 + Math.random() * 0.2;
    }
    
    return componentHealth;
  }
  
  // Generate recommendations based on prediction
  private generateRecommendations(
    device: Device, 
    failureProbability: number, 
    contributingFactors: { factor: string; impact: number }[]
  ): string[] {
    const recommendations = [];
    
    if (failureProbability > 0.7) {
      recommendations.push(`Schedule immediate maintenance for ${device.name}.`);
      recommendations.push('Consider replacing critical components.');
    } else if (failureProbability > 0.4) {
      recommendations.push(`Schedule maintenance for ${device.name} within the next 30 days.`);
      
      // Add specific recommendations based on top contributing factors
      const topFactor = contributingFactors[0]?.factor;
      if (topFactor === 'Device Age') {
        recommendations.push('Consider budgeting for replacement within the next year.');
      } else if (topFactor === 'Temperature Fluctuations') {
        recommendations.push('Check and clean air filters and cooling systems.');
      } else if (topFactor === 'Charge Cycles') {
        recommendations.push('Optimize charge/discharge cycles to extend battery life.');
      } else if (topFactor === 'Power Quality') {
        recommendations.push('Install power conditioning equipment for improved stability.');
      }
    } else {
      recommendations.push(`Maintain regular maintenance schedule for ${device.name}.`);
      recommendations.push('Monitor performance metrics for any significant changes.');
    }
    
    // Add general recommendations
    recommendations.push('Ensure proper environmental conditions are maintained.');
    
    return recommendations;
  }
  
  // Clean up resources
  dispose(): void {
    console.log('Device Failure Prediction Service disposed');
  }
}
