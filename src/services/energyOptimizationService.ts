
import { OptimizationSettings, OptimizationResult } from '@/types/optimization';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Run optimization with the provided settings
 */
export const runOptimization = async (settings: OptimizationSettings): Promise<OptimizationResult> => {
  try {
    console.log('Running optimization with settings:', settings);
    
    // In a real app, this would call an API
    // For demo purposes, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock optimization result
    const mockResult = generateOptimizationResult(settings);
    
    console.log('Optimization result:', mockResult);
    return mockResult;
  } catch (error) {
    console.error('Optimization error:', error);
    toast.error('Optimization failed');
    throw error;
  }
};

/**
 * Generate a mock optimization result
 */
const generateOptimizationResult = (settings: OptimizationSettings): OptimizationResult => {
  const now = new Date();
  const hours = 24;
  
  // Generate mock power values for the schedule
  const batteryPower: number[] = [];
  const gridPower: number[] = [];
  const pvPower: number[] = [];
  const loadPower: number[] = [];
  const batterySoc: number[] = [];
  
  let currentSoc = settings.min_soc;
  
  for (let i = 0; i < hours; i++) {
    const hour = (now.getHours() + i) % 24;
    
    // Solar generation follows a bell curve during daylight
    let pv = 0;
    if (hour >= 6 && hour <= 20) {
      // Peak generation around noon
      const peakFactor = 1 - Math.abs(13 - hour) / 7;
      pv = 8 * peakFactor + Math.random() * 2;
    }
    pvPower.push(parseFloat(pv.toFixed(2)));
    
    // Load has morning and evening peaks
    let load = 2 + Math.random();  // Base load
    if ((hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 22)) {
      load += 4 + Math.random() * 2;  // Peak load
    }
    loadPower.push(parseFloat(load.toFixed(2)));
    
    // Battery charges from excess PV or discharges based on strategy
    let battery = 0;
    if (settings.battery_strategy === 'charge_from_solar' && pv > load && currentSoc < settings.max_soc) {
      // Charge from excess solar
      battery = Math.min(pv - load, 5, (settings.max_soc - currentSoc) * 0.5);
      currentSoc += battery * 0.2;  // Approximate SoC increase
    } else if (hour >= 18 && hour <= 22 && currentSoc > settings.min_soc) {
      // Discharge during evening peak
      battery = -Math.min(3, (currentSoc - settings.min_soc) * 0.3);
      currentSoc += battery * 0.2;  // Approximate SoC decrease
    } else if (settings.battery_strategy === 'time_of_use' && hour >= 1 && hour <= 5 && currentSoc < settings.max_soc) {
      // Charge during off-peak hours
      battery = Math.min(3, (settings.max_soc - currentSoc) * 0.3);
      currentSoc += battery * 0.2;
    }
    
    batteryPower.push(parseFloat(battery.toFixed(2)));
    batterySoc.push(parseFloat(currentSoc.toFixed(1)));
    
    // Grid is the balancing factor
    const grid = load - pv - battery;
    gridPower.push(parseFloat(grid.toFixed(2)));
  }
  
  // Calculate savings
  const selfConsumption = calculateSelfConsumption(pvPower, loadPower, batteryPower);
  const costSavings = calculateCostSavings(gridPower, pvPower);
  const co2Reduction = costSavings * 0.5;  // Simplified CO2 calculation
  
  return {
    id: uuidv4(),
    site_id: settings.site_id,
    timestamp: now.toISOString(),
    battery_power: batteryPower,
    grid_power: gridPower,
    pv_power: pvPower,
    load_power: loadPower,
    battery_soc: batterySoc,
    total_savings: costSavings,
    co2_reduction: co2Reduction,
    self_consumption_rate: selfConsumption,
    created_at: now.toISOString()
  };
};

/**
 * Calculate self-consumption rate based on generation and usage
 */
const calculateSelfConsumption = (pvPower: number[], loadPower: number[], batteryPower: number[]): number => {
  let totalGeneration = 0;
  let usedSolar = 0;
  
  for (let i = 0; i < pvPower.length; i++) {
    const pv = pvPower[i];
    const load = loadPower[i];
    const battery = batteryPower[i];
    
    totalGeneration += pv;
    
    // Solar used directly + solar stored in battery (positive battery power)
    const directUse = Math.min(pv, load);
    const stored = battery > 0 ? Math.min(pv - directUse, battery) : 0;
    
    usedSolar += directUse + stored;
  }
  
  return totalGeneration > 0 ? (usedSolar / totalGeneration) * 100 : 0;
};

/**
 * Calculate cost savings
 */
const calculateCostSavings = (gridPower: number[], pvPower: number[]): number => {
  // Simplified cost calculation
  // Peak hours (higher cost): 7-9, 17-21
  // Off-peak: rest of the day
  const peakRate = 0.35;  // $/kWh
  const offPeakRate = 0.15;  // $/kWh
  const feedInTariff = 0.08;  // $/kWh for excess solar
  
  let savings = 0;
  const now = new Date();
  
  for (let i = 0; i < gridPower.length; i++) {
    const hour = (now.getHours() + i) % 24;
    const grid = gridPower[i];
    const pv = pvPower[i];
    
    // Determine if this is a peak hour
    const isPeak = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 21);
    const rate = isPeak ? peakRate : offPeakRate;
    
    if (grid < 0) {
      // Exporting to grid
      savings += -grid * feedInTariff;
    } else {
      // Avoiding grid import
      savings += Math.min(pv, grid) * rate;
    }
  }
  
  return parseFloat(savings.toFixed(2));
};

/**
 * Get previous optimization results
 */
export const getOptimizationHistory = async (siteId: string, limit = 10): Promise<OptimizationResult[]> => {
  try {
    // In a real app, this would fetch from an API
    // For now, generate some mock history
    const history: OptimizationResult[] = [];
    const now = new Date();
    
    for (let i = 0; i < limit; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      history.push({
        id: `hist-${i}`,
        site_id: siteId,
        timestamp: date.toISOString(),
        battery_power: Array(24).fill(0).map(() => Math.random() * 5 - 2.5),
        grid_power: Array(24).fill(0).map(() => Math.random() * 8 - 2),
        pv_power: Array(24).fill(0).map(() => Math.max(0, Math.random() * 10)),
        load_power: Array(24).fill(0).map(() => Math.max(1, Math.random() * 8)),
        battery_soc: Array(24).fill(0).map((_, i) => 30 + i * 2 + Math.random() * 5),
        total_savings: 3 + Math.random() * 4,
        co2_reduction: 5 + Math.random() * 10,
        self_consumption_rate: 50 + Math.random() * 30,
        created_at: date.toISOString()
      });
    }
    
    return history;
  } catch (error) {
    console.error('Error fetching optimization history:', error);
    toast.error('Failed to fetch optimization history');
    return [];
  }
};
