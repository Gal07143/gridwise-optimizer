import { MLService } from './mlService';
import { EnergyManagementService } from './energyManagementService';
import { deviceService } from './deviceService';
import { Device, TelemetryData } from '@/types/device';
import { supabase } from './supabase';

// Define interfaces for the AI agent
export interface AgentDecision {
  id: string;
  timestamp: Date;
  action: string;
  deviceId: string;
  confidence: number;
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';
  details: string;
  impact: {
    energySavings?: number;
    costSavings?: number;
    healthImprovement?: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  requiresApproval: boolean;
}

export interface AgentConfig {
  automationLevel: number; // 0-100
  confidenceThreshold: number; // 0-1
  enableAutonomousActions: boolean;
  enablePredictiveMaintenance: boolean;
  enableCostOptimization: boolean;
  enableUserBehaviorLearning: boolean;
}

export interface AgentPerformance {
  decisionsMade: number;
  successfulDecisions: number;
  failedDecisions: number;
  averageConfidence: number;
  energySavings: number;
  costSavings: number;
  lastUpdated: Date;
}

/**
 * AIAgentService class for making intelligent decisions based on ML predictions
 */
export class AIAgentService {
  private mlService: MLService;
  private energyService: EnergyManagementService;
  private config: AgentConfig;
  private performance: AgentPerformance;
  private isInitialized: boolean = false;
  private decisionLog: AgentDecision[] = [];

  constructor(config: AgentConfig) {
    this.config = config;
    this.mlService = new MLService({
      modelPath: '/models/device_model.onnx',
      modelType: 'consumption',
      inputShape: [10, 5],
      outputShape: [1, 3],
      featureNames: ['temperature', 'humidity', 'pressure', 'voltage', 'current']
    });
    this.energyService = new EnergyManagementService();
    this.performance = {
      decisionsMade: 0,
      successfulDecisions: 0,
      failedDecisions: 0,
      averageConfidence: 0,
      energySavings: 0,
      costSavings: 0,
      lastUpdated: new Date()
    };
  }

  /**
   * Initialize the AI agent
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing AI Agent...');
      
      // Initialize ML service
      await this.mlService.initialize();
      
      // Initialize energy management service
      await this.energyService.initialize();
      
      // Load decision log from database
      await this.loadDecisionLog();
      
      this.isInitialized = true;
      console.log('AI Agent initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI Agent:', error);
      throw new Error(`Failed to initialize AI Agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load decision log from database
   */
  private async loadDecisionLog(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('agent_decisions')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;

      this.decisionLog = data.map(decision => ({
        ...decision,
        timestamp: new Date(decision.timestamp)
      }));
    } catch (error) {
      console.error('Failed to load decision log:', error);
      // Continue with empty decision log
    }
  }

  /**
   * Update agent configuration
   */
  updateConfig(config: Partial<AgentConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
    console.log('AI Agent configuration updated:', this.config);
  }

  /**
   * Analyze device data and make decisions
   */
  async analyzeDevice(deviceId: string): Promise<AgentDecision[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Fetch device data
      const device = await deviceService.fetchDevice(deviceId);
      const telemetry = await deviceService.fetchDeviceTelemetry(deviceId);
      
      if (!device || !telemetry.length) {
        throw new Error('Device data not available');
      }

      // Generate decisions based on device type
      const decisions: AgentDecision[] = [];
      
      // Analyze battery health
      if (device.type === 'battery' || device.type === 'solar_battery') {
        const batteryDecision = await this.analyzeBatteryHealth(device, telemetry);
        if (batteryDecision) decisions.push(batteryDecision);
      }
      
      // Analyze energy consumption
      const consumptionDecision = await this.analyzeEnergyConsumption(device, telemetry);
      if (consumptionDecision) decisions.push(consumptionDecision);
      
      // Analyze system health
      const healthDecision = await this.analyzeSystemHealth(device, telemetry);
      if (healthDecision) decisions.push(healthDecision);
      
      // Save decisions to database
      for (const decision of decisions) {
        await this.saveDecision(decision);
      }
      
      return decisions;
    } catch (error) {
      console.error('Error analyzing device:', error);
      throw new Error(`Failed to analyze device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Analyze battery health and make decisions
   */
  private async analyzeBatteryHealth(device: Device, telemetry: TelemetryData[]): Promise<AgentDecision | null> {
    try {
      // Get battery health analysis
      const batteryHealth = await this.energyService.analyzeBatteryHealth(device.id, telemetry);
      
      // Determine if action is needed
      if (batteryHealth.health_status === 'critical' || batteryHealth.health_status === 'warning') {
        const decision: AgentDecision = {
          id: `battery-${device.id}-${Date.now()}`,
          timestamp: new Date(),
          action: 'Schedule maintenance',
          deviceId: device.id,
          confidence: 0.85,
          status: 'pending',
          details: `Battery health is ${batteryHealth.health_status}. State of health: ${batteryHealth.state_of_health.toFixed(2)}%, remaining life: ${batteryHealth.remaining_life} days.`,
          impact: {
            healthImprovement: 0.15,
            riskLevel: batteryHealth.health_status === 'critical' ? 'high' : 'medium'
          },
          requiresApproval: this.config.enableAutonomousActions && this.config.automationLevel > 70
        };
        
        return decision;
      }
      
      return null;
    } catch (error) {
      console.error('Error analyzing battery health:', error);
      return null;
    }
  }

  /**
   * Analyze energy consumption and make decisions
   */
  private async analyzeEnergyConsumption(device: Device, telemetry: TelemetryData[]): Promise<AgentDecision | null> {
    try {
      // Get energy profile prediction
      const energyProfile = await this.energyService.predictEnergyProfile(device.id, telemetry, 24);
      
      // Get cost optimization
      const costOptimization = await this.energyService.optimizeEnergyCosts(device.id, telemetry);
      
      // Determine if action is needed
      if (costOptimization.savings > 10) {
        const decision: AgentDecision = {
          id: `energy-${device.id}-${Date.now()}`,
          timestamp: new Date(),
          action: 'Optimize energy usage',
          deviceId: device.id,
          confidence: 0.8,
          status: 'pending',
          details: `Potential savings of $${costOptimization.savings.toFixed(2)} by optimizing energy usage patterns.`,
          impact: {
            energySavings: costOptimization.savings / 100,
            costSavings: costOptimization.savings,
            riskLevel: 'low'
          },
          requiresApproval: this.config.enableAutonomousActions && this.config.automationLevel > 50
        };
        
        return decision;
      }
      
      return null;
    } catch (error) {
      console.error('Error analyzing energy consumption:', error);
      return null;
    }
  }

  /**
   * Analyze system health and make decisions
   */
  private async analyzeSystemHealth(device: Device, telemetry: TelemetryData[]): Promise<AgentDecision | null> {
    try {
      // Get system fault prediction
      const systemFaults = await this.energyService.predictSystemFaults(device.id, telemetry);
      
      // Check for high severity faults
      const highSeverityFaults = systemFaults.potentialFaults.filter(fault => fault.severity === 'high');
      
      if (highSeverityFaults.length > 0) {
        const decision: AgentDecision = {
          id: `health-${device.id}-${Date.now()}`,
          timestamp: new Date(),
          action: 'Address system faults',
          deviceId: device.id,
          confidence: 0.9,
          status: 'pending',
          details: `Detected ${highSeverityFaults.length} high severity potential faults. ${systemFaults.maintenanceRecommendations[0]}`,
          impact: {
            healthImprovement: 0.2,
            riskLevel: 'high'
          },
          requiresApproval: false // Always require approval for high-risk actions
        };
        
        return decision;
      }
      
      return null;
    } catch (error) {
      console.error('Error analyzing system health:', error);
      return null;
    }
  }

  /**
   * Save decision to database
   */
  private async saveDecision(decision: AgentDecision): Promise<void> {
    try {
      const { error } = await supabase
        .from('agent_decisions')
        .insert({
          id: decision.id,
          timestamp: decision.timestamp.toISOString(),
          action: decision.action,
          device_id: decision.deviceId,
          confidence: decision.confidence,
          status: decision.status,
          details: decision.details,
          impact: decision.impact,
          requires_approval: decision.requiresApproval
        });

      if (error) throw error;
      
      // Update local decision log
      this.decisionLog.unshift(decision);
      if (this.decisionLog.length > 100) {
        this.decisionLog.pop();
      }
      
      // Update performance metrics
      this.updatePerformanceMetrics(decision);
    } catch (error) {
      console.error('Failed to save decision:', error);
    }
  }

  /**
   * Update performance metrics based on decision
   */
  private updatePerformanceMetrics(decision: AgentDecision): void {
    this.performance.decisionsMade++;
    
    if (decision.status === 'executed') {
      this.performance.successfulDecisions++;
      
      if (decision.impact.energySavings) {
        this.performance.energySavings += decision.impact.energySavings;
      }
      
      if (decision.impact.costSavings) {
        this.performance.costSavings += decision.impact.costSavings;
      }
    } else if (decision.status === 'failed') {
      this.performance.failedDecisions++;
    }
    
    // Update average confidence
    this.performance.averageConfidence = 
      (this.performance.averageConfidence * (this.performance.decisionsMade - 1) + decision.confidence) / 
      this.performance.decisionsMade;
    
    this.performance.lastUpdated = new Date();
  }

  /**
   * Execute a decision
   */
  async executeDecision(decisionId: string): Promise<boolean> {
    try {
      // Find the decision
      const decision = this.decisionLog.find(d => d.id === decisionId);
      if (!decision) {
        throw new Error('Decision not found');
      }
      
      // Check if decision requires approval
      if (decision.requiresApproval && decision.status !== 'approved') {
        throw new Error('Decision requires approval');
      }
      
      // Execute the decision based on action type
      let success = false;
      
      if (decision.action.includes('maintenance')) {
        success = await this.executeMaintenanceAction(decision);
      } else if (decision.action.includes('Optimize')) {
        success = await this.executeOptimizationAction(decision);
      } else if (decision.action.includes('Address')) {
        success = await this.executeFaultAction(decision);
      } else {
        // Default action
        success = await this.executeDefaultAction(decision);
      }
      
      // Update decision status
      if (success) {
        decision.status = 'executed';
      } else {
        decision.status = 'failed';
      }
      
      // Save updated decision
      await this.saveDecision(decision);
      
      return success;
    } catch (error) {
      console.error('Error executing decision:', error);
      return false;
    }
  }

  /**
   * Execute maintenance action
   */
  private async executeMaintenanceAction(decision: AgentDecision): Promise<boolean> {
    try {
      // In a real implementation, this would schedule maintenance
      console.log(`Scheduling maintenance for device ${decision.deviceId}`);
      
      // Simulate success
      return true;
    } catch (error) {
      console.error('Error executing maintenance action:', error);
      return false;
    }
  }

  /**
   * Execute optimization action
   */
  private async executeOptimizationAction(decision: AgentDecision): Promise<boolean> {
    try {
      // In a real implementation, this would optimize energy usage
      console.log(`Optimizing energy usage for device ${decision.deviceId}`);
      
      // Simulate success
      return true;
    } catch (error) {
      console.error('Error executing optimization action:', error);
      return false;
    }
  }

  /**
   * Execute fault action
   */
  private async executeFaultAction(decision: AgentDecision): Promise<boolean> {
    try {
      // In a real implementation, this would address system faults
      console.log(`Addressing system faults for device ${decision.deviceId}`);
      
      // Simulate success
      return true;
    } catch (error) {
      console.error('Error executing fault action:', error);
      return false;
    }
  }

  /**
   * Execute default action
   */
  private async executeDefaultAction(decision: AgentDecision): Promise<boolean> {
    try {
      // Default implementation
      console.log(`Executing action "${decision.action}" for device ${decision.deviceId}`);
      
      // Simulate success
      return true;
    } catch (error) {
      console.error('Error executing default action:', error);
      return false;
    }
  }

  /**
   * Get decision log
   */
  getDecisionLog(): AgentDecision[] {
    return this.decisionLog;
  }

  /**
   * Get agent performance
   */
  getPerformance(): AgentPerformance {
    return this.performance;
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.mlService.dispose();
    this.energyService.dispose();
    this.isInitialized = false;
  }
} 