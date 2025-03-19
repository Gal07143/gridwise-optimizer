
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Interface for anomaly detection results
 */
export interface AnomalyDetection {
  deviceId: string;
  timestamp: string;
  metric: string;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  recommendations: string[];
}

/**
 * Interface for maintenance recommendation
 */
export interface MaintenanceRecommendation {
  deviceId: string;
  deviceType: string;
  recommendationType: 'routine' | 'preventive' | 'corrective';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  dueDate: string;
  estimatedDowntime: string;
  estimatedCost: number;
  parts?: {
    name: string;
    quantity: number;
    inStock: boolean;
  }[];
  steps?: string[];
}

/**
 * Interface for system health prediction
 */
export interface SystemHealthPrediction {
  deviceId: string;
  deviceType: string;
  healthScore: number; // 0-100
  efficiency: number; // 0-100
  remainingLifespan: {
    hours: number;
    percentage: number;
  };
  metrics: {
    name: string;
    current: number;
    optimal: number;
    trend: 'improving' | 'stable' | 'degrading';
  }[];
  failureProbability: number; // 0-1
  nextMaintenanceDate: string;
}

/**
 * Get anomaly detection results for a device
 */
export const getAnomalies = async (deviceId: string, lookbackDays = 7): Promise<AnomalyDetection[]> => {
  try {
    // In a real implementation, this would call a machine learning service
    // For now, we'll simulate some anomalies
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate some simulated anomalies
    const anomalies: AnomalyDetection[] = [];
    
    // Random number of anomalies (0-3)
    const anomalyCount = Math.floor(Math.random() * 4);
    
    for (let i = 0; i < anomalyCount; i++) {
      const metrics = ['temperature', 'vibration', 'voltage', 'current', 'power'];
      const severities: AnomalyDetection['severity'][] = ['low', 'medium', 'high'];
      
      const metric = metrics[Math.floor(Math.random() * metrics.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const value = Math.round(Math.random() * 100);
      const expectedValue = Math.round(value * (Math.random() * 0.4 + 0.8)); // 80-120% of value
      
      const anomaly: AnomalyDetection = {
        deviceId,
        timestamp: new Date(Date.now() - Math.random() * lookbackDays * 24 * 60 * 60 * 1000).toISOString(),
        metric,
        value,
        expectedValue,
        deviation: Math.abs(((value - expectedValue) / expectedValue) * 100),
        severity,
        confidence: Math.round(Math.random() * 40 + 60) / 100, // 0.6-1.0
        recommendations: [
          `Check ${metric} sensor calibration`,
          `Inspect ${metric} related components`,
          `Schedule diagnostic test if issue persists`
        ]
      };
      
      anomalies.push(anomaly);
    }
    
    return anomalies.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
  } catch (error) {
    console.error(`Error fetching anomalies for device ${deviceId}:`, error);
    toast.error("Failed to fetch anomaly data");
    return [];
  }
};

/**
 * Get maintenance recommendations for a device
 */
export const getMaintenanceRecommendations = async (deviceId: string): Promise<MaintenanceRecommendation[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would call a machine learning model
    // We'll simulate recommendations based on device type
    
    // Get device information
    const { data: deviceData, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', deviceId)
      .single();
    
    if (error) throw error;
    
    if (!deviceData) {
      return [];
    }
    
    const recommendations: MaintenanceRecommendation[] = [];
    const deviceType = deviceData.type;
    const installationDate = deviceData.installation_date;
    
    // Calculate device age in days
    const installDate = new Date(installationDate || Date.now());
    const ageInDays = Math.floor((Date.now() - installDate.getTime()) / (24 * 60 * 60 * 1000));
    
    // Generate routine maintenance based on device type and age
    if (deviceType === 'solar') {
      // For solar panels, recommend cleaning every 90 days
      if (ageInDays % 90 < 14) {
        recommendations.push({
          deviceId,
          deviceType,
          recommendationType: 'routine',
          priority: 'medium',
          description: 'Panel cleaning and inspection',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDowntime: '2 hours',
          estimatedCost: 150,
          steps: [
            'Clean solar panels with appropriate solution',
            'Check for physical damage or debris',
            'Inspect mounting hardware and tighten if necessary',
            'Check wiring connections'
          ]
        });
      }
      
      // For older solar installations, recommend inverter check
      if (ageInDays > 730) { // > 2 years
        recommendations.push({
          deviceId,
          deviceType,
          recommendationType: 'preventive',
          priority: 'medium',
          description: 'Inverter diagnostic inspection',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDowntime: '3 hours',
          estimatedCost: 250,
          steps: [
            'Run diagnostic test on inverter',
            'Check cooling fans and vents',
            'Inspect capacitors for signs of bulging or leakage',
            'Update firmware if available'
          ]
        });
      }
    } else if (deviceType === 'battery') {
      // For batteries, recommend cell balancing
      if (ageInDays % 180 < 30) { // Every 6 months
        recommendations.push({
          deviceId,
          deviceType,
          recommendationType: 'routine',
          priority: 'high',
          description: 'Battery cell balancing and health check',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDowntime: '4 hours',
          estimatedCost: 300,
          steps: [
            'Run battery diagnostics',
            'Balance cell charges',
            'Check for thermal issues',
            'Inspect battery management system'
          ]
        });
      }
      
      // If battery is older, suggest more in-depth testing
      if (ageInDays > 1095) { // > 3 years
        recommendations.push({
          deviceId,
          deviceType,
          recommendationType: 'preventive',
          priority: 'high',
          description: 'Deep cycle test and capacity analysis',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDowntime: '8 hours',
          estimatedCost: 450,
          parts: [
            {
              name: 'Battery management system sensor',
              quantity: 1,
              inStock: true
            }
          ],
          steps: [
            'Perform deep cycle test to measure actual capacity',
            'Replace BMS sensors if needed',
            'Update battery management firmware',
            'Calibrate temperature sensors'
          ]
        });
      }
    } else if (deviceType === 'wind') {
      // For wind turbines
      if (ageInDays % 90 < 14) { // Every 3 months
        recommendations.push({
          deviceId,
          deviceType,
          recommendationType: 'routine',
          priority: 'high',
          description: 'Turbine blade inspection and bearing lubrication',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDowntime: '4 hours',
          estimatedCost: 350,
          parts: [
            {
              name: 'Bearing grease',
              quantity: 2,
              inStock: true
            }
          ],
          steps: [
            'Inspect blades for damage or wear',
            'Lubricate main bearings',
            'Check blade pitch mechanism',
            'Inspect tower attachment points'
          ]
        });
      }
    }
    
    // Random chance to add corrective maintenance recommendation based on simulated detection
    if (Math.random() > 0.7) {
      const issues = [
        {
          type: 'solar',
          description: 'Micro-inverter efficiency degradation detected',
          priority: 'medium' as const,
          parts: [{ name: 'Micro-inverter', quantity: 1, inStock: false }]
        },
        {
          type: 'battery',
          description: 'Cell balancing issues detected',
          priority: 'high' as const,
          parts: [{ name: 'Balance controller', quantity: 1, inStock: true }]
        },
        {
          type: 'wind',
          description: 'Abnormal vibration patterns detected',
          priority: 'critical' as const,
          parts: [{ name: 'Dampening mount', quantity: 2, inStock: true }]
        },
        {
          type: 'ev_charger',
          description: 'Communication module intermittent failure',
          priority: 'medium' as const,
          parts: [{ name: 'Communication PCB', quantity: 1, inStock: false }]
        }
      ];
      
      const relevantIssues = issues.filter(issue => issue.type === deviceType);
      
      if (relevantIssues.length > 0) {
        const selectedIssue = relevantIssues[Math.floor(Math.random() * relevantIssues.length)];
        
        recommendations.push({
          deviceId,
          deviceType,
          recommendationType: 'corrective',
          priority: selectedIssue.priority,
          description: selectedIssue.description,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDowntime: '6 hours',
          estimatedCost: Math.round(Math.random() * 400 + 300),
          parts: selectedIssue.parts
        });
      }
    }
    
    return recommendations;
    
  } catch (error) {
    console.error(`Error fetching maintenance recommendations for device ${deviceId}:`, error);
    toast.error("Failed to fetch maintenance recommendations");
    return [];
  }
};

/**
 * Get system health prediction for a device
 */
export const getSystemHealthPrediction = async (deviceId: string): Promise<SystemHealthPrediction | null> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Get device information
    const { data: deviceData, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', deviceId)
      .single();
    
    if (error) throw error;
    
    if (!deviceData) {
      return null;
    }
    
    // In a real implementation, this would call a machine learning model
    // We'll simulate health prediction based on device type and age
    
    const deviceType = deviceData.type;
    const installationDate = deviceData.installation_date;
    
    // Calculate device age in days
    const installDate = new Date(installationDate || Date.now());
    const ageInDays = Math.floor((Date.now() - installDate.getTime()) / (24 * 60 * 60 * 1000));
    
    // Generate health score based on age (newer devices have higher scores)
    // This simulates health score decreasing over time
    const baseHealthScore = Math.max(60, 100 - (ageInDays / 365) * 5);
    // Add some random variation
    const healthScore = Math.min(100, Math.max(0, baseHealthScore + (Math.random() * 10 - 5)));
    
    // Calculate efficiency (correlated with health but not identical)
    const efficiency = Math.min(100, Math.max(0, healthScore - (Math.random() * 8)));
    
    // Expected lifespan in hours based on device type
    const expectedLifespan = {
      solar: 175200, // ~20 years
      battery: 43800, // ~5 years
      wind: 131400, // ~15 years
      grid: 262800, // ~30 years
      ev_charger: 43800, // ~5 years
      load: 87600 // ~10 years
    }[deviceType] || 87600;
    
    // Hours used (from age in days)
    const hoursUsed = ageInDays * 24;
    
    // Remaining hours (adjusted by health score)
    const remainingHours = Math.max(0, (expectedLifespan - hoursUsed) * (healthScore / 100));
    
    // Calculate metrics relevant to the device type
    const metrics = [];
    
    if (deviceType === 'solar') {
      metrics.push(
        {
          name: 'Panel efficiency',
          current: efficiency,
          optimal: 95,
          trend: efficiency > 90 ? 'stable' : efficiency > 80 ? 'degrading' : 'degrading'
        },
        {
          name: 'Inverter temperature',
          current: 55 + (Math.random() * 10 - 5),
          optimal: 50,
          trend: 'stable'
        }
      );
    } else if (deviceType === 'battery') {
      metrics.push(
        {
          name: 'Charge cycles',
          current: Math.round(ageInDays / 2 + Math.random() * 100),
          optimal: 2000,
          trend: 'stable'
        },
        {
          name: 'Discharge efficiency',
          current: efficiency - (Math.random() * 5),
          optimal: 95,
          trend: efficiency > 85 ? 'stable' : 'degrading'
        }
      );
    } else if (deviceType === 'wind') {
      metrics.push(
        {
          name: 'Bearing wear',
          current: Math.min(100, Math.max(0, (ageInDays / 180) * 5)),
          optimal: 0,
          trend: ageInDays > 730 ? 'degrading' : 'stable'
        },
        {
          name: 'Generator efficiency',
          current: efficiency,
          optimal: 90,
          trend: efficiency > 85 ? 'stable' : 'degrading'
        }
      );
    }
    
    // Calculate failure probability (inverse relationship with health score)
    const failureProbability = (100 - healthScore) / 100 * 0.3;
    
    // Next maintenance date (sooner for lower health scores)
    const daysToMaintenance = Math.max(7, Math.round((healthScore / 100) * 90));
    const nextMaintenanceDate = new Date(Date.now() + daysToMaintenance * 24 * 60 * 60 * 1000).toISOString();
    
    return {
      deviceId,
      deviceType,
      healthScore,
      efficiency,
      remainingLifespan: {
        hours: Math.round(remainingHours),
        percentage: Math.round((remainingHours / expectedLifespan) * 100)
      },
      metrics,
      failureProbability,
      nextMaintenanceDate
    };
    
  } catch (error) {
    console.error(`Error fetching health prediction for device ${deviceId}:`, error);
    toast.error("Failed to fetch device health prediction");
    return null;
  }
};
