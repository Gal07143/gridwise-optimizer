import { Device, TelemetryData } from '@/types/device';
import { MLService } from './mlService';
import { deviceService } from './deviceService';
import { supabase } from './supabase';

export interface ConnectivityStatus {
  deviceId: string;
  isConnected: boolean;
  latency: number;
  signalStrength: number;
  lastPing: Date;
  protocol: string;
  errorCount: number;
  lastError?: string;
  status: 'healthy' | 'degraded' | 'critical' | 'offline';
}

export interface ConnectivityIssue {
  deviceId: string;
  type: 'latency' | 'signal' | 'protocol' | 'hardware' | 'network';
  severity: 'low' | 'medium' | 'high';
  description: string;
  possibleCauses: string[];
  recommendedActions: string[];
  autoFixAvailable: boolean;
}

export interface ConnectivityMetrics {
  uptime: number;
  averageLatency: number;
  packetLoss: number;
  reconnectAttempts: number;
  lastReconnectTime?: Date;
}

export class DeviceConnectivityService {
  private mlService: MLService;
  private deviceStatuses: Map<string, ConnectivityStatus>;
  private metricsHistory: Map<string, ConnectivityMetrics[]>;
  private initialized: boolean = false;

  constructor() {
    this.mlService = new MLService({
      modelPath: '/models/connectivity_model.onnx',
      modelType: 'fault',
      inputShape: [100, 8], // Historical connectivity metrics
      outputShape: [5], // Issue type probabilities
      featureNames: ['latency', 'signal_strength', 'packet_loss', 'error_count', 'uptime', 'reconnects', 'protocol_errors', 'hardware_errors']
    });
    this.deviceStatuses = new Map();
    this.metricsHistory = new Map();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.mlService.initialize();
      await this.loadDeviceStatuses();
      this.startMonitoring();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize device connectivity service:', error);
      throw error;
    }
  }

  private async loadDeviceStatuses(): Promise<void> {
    try {
      const devices = await deviceService.fetchDevices();
      
      for (const device of devices) {
        this.deviceStatuses.set(device.id, {
          deviceId: device.id,
          isConnected: false,
          latency: 0,
          signalStrength: 0,
          lastPing: new Date(),
          protocol: device.protocol,
          errorCount: 0,
          status: 'offline'
        });
      }
    } catch (error) {
      console.error('Failed to load device statuses:', error);
      throw error;
    }
  }

  private startMonitoring(): void {
    // Monitor devices every 30 seconds
    setInterval(() => this.monitorDevices(), 30000);
    
    // Run deep analysis every 5 minutes
    setInterval(() => this.analyzeConnectivity(), 300000);
    
    // Clean up old metrics every hour
    setInterval(() => this.cleanupOldMetrics(), 3600000);
  }

  private async monitorDevices(): Promise<void> {
    for (const [deviceId, status] of this.deviceStatuses) {
      try {
        const metrics = await this.checkDeviceConnectivity(deviceId);
        await this.updateDeviceStatus(deviceId, metrics);
        await this.storeMetrics(deviceId, metrics);
      } catch (error) {
        console.error(`Error monitoring device ${deviceId}:`, error);
        this.updateDeviceError(deviceId, error);
      }
    }
  }

  private async checkDeviceConnectivity(deviceId: string): Promise<ConnectivityMetrics> {
    const status = this.deviceStatuses.get(deviceId);
    if (!status) throw new Error('Device status not found');

    try {
      const startTime = Date.now();
      await deviceService.pingDevice(deviceId);
      const latency = Date.now() - startTime;

      return {
        uptime: this.calculateUptime(deviceId),
        averageLatency: latency,
        packetLoss: this.calculatePacketLoss(deviceId),
        reconnectAttempts: status.errorCount,
        lastReconnectTime: status.lastPing
      };
    } catch (error) {
      throw new Error(`Failed to check device connectivity: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async updateDeviceStatus(deviceId: string, metrics: ConnectivityMetrics): Promise<void> {
    const status = this.deviceStatuses.get(deviceId);
    if (!status) return;

    const newStatus: ConnectivityStatus = {
      ...status,
      isConnected: true,
      latency: metrics.averageLatency,
      lastPing: new Date(),
      status: this.determineHealthStatus(metrics)
    };

    this.deviceStatuses.set(deviceId, newStatus);
    await this.saveStatusToDatabase(deviceId, newStatus);
  }

  private determineHealthStatus(metrics: ConnectivityMetrics): 'healthy' | 'degraded' | 'critical' | 'offline' {
    if (metrics.averageLatency > 1000 || metrics.packetLoss > 20) {
      return 'critical';
    } else if (metrics.averageLatency > 500 || metrics.packetLoss > 10) {
      return 'degraded';
    } else {
      return 'healthy';
    }
  }

  private async analyzeConnectivity(): Promise<void> {
    for (const [deviceId, status] of this.deviceStatuses) {
      try {
        const metrics = this.metricsHistory.get(deviceId) || [];
        const issues = await this.detectConnectivityIssues(deviceId, metrics);
        
        for (const issue of issues) {
          if (issue.autoFixAvailable) {
            await this.attemptAutoFix(deviceId, issue);
          }
        }
      } catch (error) {
        console.error(`Error analyzing connectivity for device ${deviceId}:`, error);
      }
    }
  }

  private async detectConnectivityIssues(deviceId: string, metrics: ConnectivityMetrics[]): Promise<ConnectivityIssue[]> {
    const issues: ConnectivityIssue[] = [];
    const status = this.deviceStatuses.get(deviceId);
    if (!status) return issues;

    // Use ML model to predict potential issues
    try {
      const prediction = await this.mlService.predictFaults(metrics);
      
      for (const fault of prediction.potentialFaults) {
        if (fault.probability > 0.7) {
          issues.push({
            deviceId,
            type: this.mapFaultTypeToIssueType(fault.component),
            severity: fault.severity,
            description: this.generateIssueDescription(fault),
            possibleCauses: prediction.rootCauses.map(rc => rc.cause),
            recommendedActions: prediction.maintenanceRecommendations,
            autoFixAvailable: this.isAutoFixAvailable(fault.component)
          });
        }
      }
    } catch (error) {
      console.error('Error detecting connectivity issues:', error);
    }

    return issues;
  }

  private async attemptAutoFix(deviceId: string, issue: ConnectivityIssue): Promise<boolean> {
    try {
      console.log(`Attempting to auto-fix ${issue.type} issue for device ${deviceId}`);
      
      switch (issue.type) {
        case 'protocol':
          return await this.resetProtocol(deviceId);
        case 'network':
          return await this.reconnectDevice(deviceId);
        case 'signal':
          return await this.optimizeSignal(deviceId);
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error attempting auto-fix for device ${deviceId}:`, error);
      return false;
    }
  }

  private async resetProtocol(deviceId: string): Promise<boolean> {
    try {
      await deviceService.resetDeviceProtocol(deviceId);
      return true;
    } catch (error) {
      console.error(`Failed to reset protocol for device ${deviceId}:`, error);
      return false;
    }
  }

  private async reconnectDevice(deviceId: string): Promise<boolean> {
    try {
      await deviceService.reconnectDevice(deviceId);
      return true;
    } catch (error) {
      console.error(`Failed to reconnect device ${deviceId}:`, error);
      return false;
    }
  }

  private async optimizeSignal(deviceId: string): Promise<boolean> {
    try {
      await deviceService.optimizeDeviceSignal(deviceId);
      return true;
    } catch (error) {
      console.error(`Failed to optimize signal for device ${deviceId}:`, error);
      return false;
    }
  }

  private calculateUptime(deviceId: string): number {
    const status = this.deviceStatuses.get(deviceId);
    if (!status) return 0;

    const metrics = this.metricsHistory.get(deviceId) || [];
    if (metrics.length === 0) return 0;

    const totalTime = metrics.length * 30; // 30-second intervals
    const downtime = metrics.filter(m => m.packetLoss > 50).length * 30;
    return ((totalTime - downtime) / totalTime) * 100;
  }

  private calculatePacketLoss(deviceId: string): number {
    const metrics = this.metricsHistory.get(deviceId) || [];
    if (metrics.length === 0) return 0;

    const recentMetrics = metrics.slice(-10); // Last 10 measurements
    return recentMetrics.reduce((sum, m) => sum + (m.packetLoss || 0), 0) / recentMetrics.length;
  }

  private async storeMetrics(deviceId: string, metrics: ConnectivityMetrics): Promise<void> {
    let history = this.metricsHistory.get(deviceId) || [];
    history.push(metrics);
    
    // Keep last 24 hours of metrics (2880 points at 30-second intervals)
    if (history.length > 2880) {
      history = history.slice(-2880);
    }
    
    this.metricsHistory.set(deviceId, history);
  }

  private async saveStatusToDatabase(deviceId: string, status: ConnectivityStatus): Promise<void> {
    try {
      const { error } = await supabase
        .from('device_connectivity')
        .upsert({
          device_id: deviceId,
          is_connected: status.isConnected,
          latency: status.latency,
          signal_strength: status.signalStrength,
          last_ping: status.lastPing.toISOString(),
          protocol: status.protocol,
          error_count: status.errorCount,
          last_error: status.lastError,
          status: status.status,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save device status to database:', error);
    }
  }

  private updateDeviceError(deviceId: string, error: unknown): void {
    const status = this.deviceStatuses.get(deviceId);
    if (!status) return;

    const newStatus: ConnectivityStatus = {
      ...status,
      isConnected: false,
      errorCount: status.errorCount + 1,
      lastError: error instanceof Error ? error.message : 'Unknown error',
      status: 'offline'
    };

    this.deviceStatuses.set(deviceId, newStatus);
    this.saveStatusToDatabase(deviceId, newStatus).catch(console.error);
  }

  private cleanupOldMetrics(): void {
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    for (const [deviceId, metrics] of this.metricsHistory) {
      const filteredMetrics = metrics.filter(m => 
        m.lastReconnectTime && m.lastReconnectTime.getTime() > twentyFourHoursAgo
      );
      this.metricsHistory.set(deviceId, filteredMetrics);
    }
  }

  private mapFaultTypeToIssueType(component: string): 'latency' | 'signal' | 'protocol' | 'hardware' | 'network' {
    switch (component) {
      case 'network':
        return 'network';
      case 'signal':
        return 'signal';
      case 'protocol':
        return 'protocol';
      case 'hardware':
        return 'hardware';
      default:
        return 'latency';
    }
  }

  private generateIssueDescription(fault: { component: string; probability: number; severity: string }): string {
    return `${fault.severity.charAt(0).toUpperCase() + fault.severity.slice(1)} ${fault.component} issue detected with ${(fault.probability * 100).toFixed(1)}% confidence`;
  }

  private isAutoFixAvailable(component: string): boolean {
    return ['network', 'protocol', 'signal'].includes(component);
  }

  // Public methods for external use
  async getDeviceStatus(deviceId: string): Promise<ConnectivityStatus | null> {
    return this.deviceStatuses.get(deviceId) || null;
  }

  async getDeviceMetrics(deviceId: string): Promise<ConnectivityMetrics[]> {
    return this.metricsHistory.get(deviceId) || [];
  }

  async runDiagnostics(deviceId: string): Promise<ConnectivityIssue[]> {
    const metrics = this.metricsHistory.get(deviceId) || [];
    return this.detectConnectivityIssues(deviceId, metrics);
  }

  async attemptRepair(deviceId: string): Promise<boolean> {
    const issues = await this.runDiagnostics(deviceId);
    let repaired = false;

    for (const issue of issues) {
      if (issue.autoFixAvailable) {
        const success = await this.attemptAutoFix(deviceId, issue);
        repaired = repaired || success;
      }
    }

    return repaired;
  }
} 