
import { DateRange } from '@/types/site';
import { format, eachDayOfInterval, addDays, addHours } from 'date-fns';

// Mock energy data with realistic patterns
export const getEnergyConsumptionData = async (siteId: string, dateRange: DateRange) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      // Generate realistic consumption data with daily patterns
      const days = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to
      });

      const data = [];
      for (const day of days) {
        // Generate 24 hours of data for each day
        for (let hour = 0; hour < 24; hour++) {
          const time = addHours(day, hour);
          // Morning peak around 7-9 AM
          // Evening peak around 6-10 PM
          // Lower usage overnight
          let baseValue = 1 + Math.random() * 0.5;
          
          // Morning peak
          if (hour >= 7 && hour <= 9) {
            baseValue = 3 + Math.random() * 1;
          }
          // Evening peak - higher
          else if (hour >= 18 && hour <= 22) {
            baseValue = 4 + Math.random() * 1.5;
          }
          // Mid-day moderate
          else if (hour >= 10 && hour <= 17) {
            baseValue = 2 + Math.random() * 0.8;
          }
          
          // Add some randomness
          const value = baseValue + (Math.random() - 0.5) * 0.7;
          
          data.push({
            time: format(time, 'yyyy-MM-dd HH:mm'),
            value: Number(value.toFixed(2)),
            hour,
            day: format(time, 'EEE')
          });
        }
      }

      resolve(data);
    }, 800);
  });
};

export const getEnergyProductionData = async (siteId: string, dateRange: DateRange) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      // Generate realistic production data - primarily dependent on sunlight
      const days = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to
      });

      const data = [];
      for (const day of days) {
        // Generate hourly data for a day
        for (let hour = 0; hour < 24; hour++) {
          const time = addHours(day, hour);
          
          // Solar production follows the sun - peak around noon
          let baseValue = 0;
          
          // Daylight hours with bell curve distribution
          if (hour >= 6 && hour <= 19) {
            // Create bell curve for solar production
            // Peak at noon (hour 12)
            const distFromNoon = Math.abs(hour - 12);
            const maxDist = 6; // Distance from 6 AM to noon
            
            // Normalize to 0-1 range and invert (0 at edges, 1 at noon)
            const normalizedValue = 1 - (distFromNoon / maxDist);
            
            // Apply bell curve transformation and scale
            baseValue = (normalizedValue * normalizedValue) * 5;
            
            // Add some weather variability
            // Some days have less production (cloudy)
            const dayFactor = 0.7 + (Math.random() * 0.6); // 70-130% of expected
            baseValue *= dayFactor;
          }
          
          // Add small random variation
          const value = baseValue + (Math.random() - 0.5) * 0.3;
          
          data.push({
            time: format(time, 'yyyy-MM-dd HH:mm'),
            value: Number(Math.max(0, value).toFixed(2)),
            hour,
            day: format(time, 'EEE')
          });
        }
      }

      resolve(data);
    }, 800);
  });
};

export const getEnergyEfficiencyData = async (siteId: string, dateRange: DateRange) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      // Calculate system efficiency over time
      const days = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to
      });

      const data = [];
      for (const day of days) {
        // Generate daily efficiency records
        const timestamp = format(day, 'yyyy-MM-dd');
        
        // Base efficiency around 80-95%
        const baseEfficiency = 80 + Math.random() * 15;
        
        // Different system components have different efficiencies
        const solarEfficiency = baseEfficiency + (Math.random() - 0.5) * 5;
        const batteryEfficiency = baseEfficiency - 5 + (Math.random() - 0.5) * 3;
        const inverterEfficiency = baseEfficiency + 5 + (Math.random() - 0.5) * 2;
        
        // Overall system efficiency (weighted average)
        const efficiency = (solarEfficiency * 0.4 + batteryEfficiency * 0.3 + inverterEfficiency * 0.3);
        
        data.push({
          timestamp,
          efficiency: Number(efficiency.toFixed(1)),
          solarEfficiency: Number(solarEfficiency.toFixed(1)),
          batteryEfficiency: Number(batteryEfficiency.toFixed(1)),
          inverterEfficiency: Number(inverterEfficiency.toFixed(1)),
          day: format(day, 'EEE'),
          date: day
        });
      }

      resolve(data);
    }, 800);
  });
};

export const getDeviceEnergyData = async (deviceId: string, dateRange: DateRange) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      // Generate device-specific energy data
      const days = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to
      });

      const data = [];
      const deviceType = deviceId.includes('solar') ? 'solar' : 
                        deviceId.includes('battery') ? 'battery' : 
                        deviceId.includes('ev') ? 'ev' : 'load';
      
      for (const day of days) {
        // Generate hourly data for each day
        for (let hour = 0; hour < 24; hour++) {
          const time = addHours(day, hour);
          
          // Different patterns based on device type
          let power = 0;
          let energy = 0;
          let efficiency = 0;
          let temperature = 20 + (Math.random() * 10);
          let stateOfCharge = null;
          
          switch (deviceType) {
            case 'solar':
              // Solar follows daylight pattern
              if (hour >= 6 && hour <= 19) {
                const distFromNoon = Math.abs(hour - 12);
                const normalizedValue = 1 - (distFromNoon / 6);
                power = (normalizedValue * normalizedValue) * 5 + (Math.random() - 0.5) * 0.5;
                energy = power * (0.9 + Math.random() * 0.2);
                efficiency = 85 + Math.random() * 10;
                temperature = 25 + power * 2 + (Math.random() * 5);
              }
              break;
              
            case 'battery':
              // Battery charges during day, discharges at night
              if (hour >= 9 && hour <= 16) {
                // Charging
                power = 2 + Math.random() * 1;
                energy = power * (0.9 + Math.random() * 0.1);
              } else if (hour >= 18 || hour <= 2) {
                // Discharging
                power = -1 * (1 + Math.random() * 2);
                energy = Math.abs(power) * (0.9 + Math.random() * 0.1);
              }
              stateOfCharge = 40 + Math.random() * 50;
              temperature = 20 + Math.abs(power) + (Math.random() * 3);
              efficiency = 90 + Math.random() * 5;
              break;
              
            case 'ev':
              // EV charging pattern - evening/overnight
              if (hour >= 19 || hour <= 2) {
                power = 6 + Math.random() * 2;
                energy = power * (0.95 + Math.random() * 0.05);
                stateOfCharge = 20 + (hour >= 21 ? (hour - 19) * 15 : 0) + Math.random() * 5;
              }
              break;
              
            default: // home load
              // Home load - morning and evening peaks
              if (hour >= 6 && hour <= 9) {
                power = 2 + Math.random() * 1;
              } else if (hour >= 17 && hour <= 22) {
                power = 3 + Math.random() * 1.5;
              } else {
                power = 0.5 + Math.random() * 1;
              }
              energy = power * (0.95 + Math.random() * 0.05);
          }
          
          data.push({
            timestamp: format(time, 'yyyy-MM-dd HH:mm'),
            power: Number(power.toFixed(2)),
            energy: Number(energy.toFixed(2)),
            efficiency: Number(efficiency.toFixed(1)),
            temperature: Number(temperature.toFixed(1)),
            stateOfCharge: stateOfCharge ? Number(stateOfCharge.toFixed(0)) : null,
            hour,
            day: format(time, 'EEE')
          });
        }
      }

      resolve(data);
    }, 800);
  });
};

export const getSystemAlerts = async (siteId: string, count: number = 5) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const alerts = [
        {
          id: '1',
          title: 'Low Battery Warning',
          message: 'Battery storage below 20% capacity',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          severity: 'warning',
          deviceId: 'battery-01',
          deviceName: 'Main Battery Storage',
          acknowledged: false
        },
        {
          id: '2',
          title: 'Peak Demand Alert',
          message: 'Grid demand approaching peak rate threshold',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          severity: 'info',
          deviceId: 'meter-01',
          deviceName: 'Main Grid Meter',
          acknowledged: true
        },
        {
          id: '3',
          title: 'Solar Production Drop',
          message: 'Solar production 30% below expected levels',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          severity: 'warning',
          deviceId: 'solar-01',
          deviceName: 'Solar Inverter',
          acknowledged: false
        },
        {
          id: '4',
          title: 'Device Offline',
          message: 'Smart thermostat disconnected from system',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          severity: 'error',
          deviceId: 'hvac-02',
          deviceName: 'Second Floor Thermostat',
          acknowledged: true
        },
        {
          id: '5',
          title: 'Firmware Update Available',
          message: 'New firmware available for Battery Management System',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          severity: 'info',
          deviceId: 'battery-01',
          deviceName: 'Main Battery Storage',
          acknowledged: false
        },
        {
          id: '6',
          title: 'Grid Connection Issue',
          message: 'Abnormal voltage fluctuation detected at grid connection point',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
          severity: 'warning',
          deviceId: 'meter-01',
          deviceName: 'Main Grid Meter',
          acknowledged: true
        },
        {
          id: '7',
          title: 'Optimization Opportunity',
          message: 'Shifting HVAC schedule could save 15% in energy costs',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          severity: 'info',
          deviceId: 'system',
          deviceName: 'Energy Management System',
          acknowledged: false
        }
      ];
      
      resolve(alerts.slice(0, count));
    }, 500);
  });
};

export const getEnergyPredictions = async (siteId: string, days: number = 7) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const predictions = [];
      const today = new Date();
      
      for (let i = 0; i < days; i++) {
        const date = addDays(today, i);
        const dayOfWeek = date.getDay();
        
        // Base consumption - higher on weekends
        let baseConsumption = 15 + (Math.random() * 3);
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          baseConsumption += 5;
        }
        
        // Base production - varies with simulated weather
        const weatherFactor = 0.6 + (Math.random() * 0.4);
        let baseProduction = 25 * weatherFactor;
        
        // Add some day-to-day variation
        const consumption = baseConsumption + (Math.random() - 0.5) * 4;
        const production = baseProduction + (Math.random() - 0.5) * 5;
        const cost = consumption * 0.15 - production * 0.1;
        const co2Saved = production * 0.5;
        
        predictions.push({
          date: format(date, 'yyyy-MM-dd'),
          dayName: format(date, 'EEEE'),
          consumption: Number(consumption.toFixed(1)),
          production: Number(production.toFixed(1)),
          netUsage: Number((consumption - production).toFixed(1)),
          estimatedCost: Number(Math.max(0, cost).toFixed(2)),
          co2Saved: Number(co2Saved.toFixed(1)),
          weatherForecast: weatherFactor > 0.8 ? 'Sunny' : weatherFactor > 0.65 ? 'Partly Cloudy' : 'Cloudy',
          confidence: Number((70 + Math.random() * 20).toFixed(0))
        });
      }
      
      resolve(predictions);
    }, 700);
  });
};
