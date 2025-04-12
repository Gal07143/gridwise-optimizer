
import { EnergyForecast } from '@/types/energy-forecast';
import { WeatherForecast } from '@/types/forecast';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates mock energy forecast data
 */
export function generateMockForecasts(siteId: string, hours = 24): EnergyForecast[] {
  const now = new Date();
  const forecasts: EnergyForecast[] = [];
  
  // Solar peak hours are typically 10am to 4pm
  const peakStartHour = 10;
  const peakEndHour = 16;
  
  // Evening consumption peak is typically 6pm to 10pm
  const consumptionPeakStartHour = 18;
  const consumptionPeakEndHour = 22;
  
  for (let i = 0; i < hours; i++) {
    const forecastTime = new Date(now);
    forecastTime.setHours(now.getHours() + i);
    
    const hour = forecastTime.getHours();
    
    // Generate solar data with a bell curve during daylight hours
    let solarOutput = 0;
    if (hour >= 6 && hour <= 20) {
      // Daylight hours
      if (hour >= peakStartHour && hour <= peakEndHour) {
        // Peak generation hours
        solarOutput = 8 + Math.random() * 4; // 8-12 kW during peak
      } else if (hour > 6 && hour < peakStartHour) {
        // Morning ramp-up
        const rampFactor = (hour - 6) / (peakStartHour - 6);
        solarOutput = rampFactor * 8 + Math.random() * 2;
      } else if (hour > peakEndHour && hour < 20) {
        // Afternoon ramp-down
        const rampFactor = 1 - (hour - peakEndHour) / (20 - peakEndHour);
        solarOutput = rampFactor * 8 + Math.random() * 2;
      } else {
        // Early morning or late evening
        solarOutput = Math.random() * 1.5;
      }
    }
    
    // Generate consumption data with peaks in the morning and evening
    let consumption = 2 + Math.random() * 1; // Base load is 2-3 kW
    if (hour >= 6 && hour <= 9) {
      // Morning peak
      consumption += 3 + Math.random() * 2;
    } else if (hour >= consumptionPeakStartHour && hour <= consumptionPeakEndHour) {
      // Evening peak
      consumption += 5 + Math.random() * 3;
    }
    
    const weatherCondition = getWeatherCondition(hour);
    
    const forecast: EnergyForecast = {
      id: uuidv4(),
      site_id: siteId,
      timestamp: forecastTime.toISOString(),
      forecast_time: forecastTime.toISOString(),
      generation_forecast: parseFloat(solarOutput.toFixed(2)),
      consumption_forecast: parseFloat(consumption.toFixed(2)),
      forecasted_production: parseFloat(solarOutput.toFixed(2)),
      forecasted_consumption: parseFloat(consumption.toFixed(2)),
      temperature: getTemperatureForHour(hour),
      cloud_cover: getCloudCoverForHour(hour, weatherCondition),
      wind_speed: 5 + Math.random() * 10,
      confidence: 85 + Math.random() * 10,
      created_at: new Date().toISOString(),
      source: 'simulation',
      weather_condition: weatherCondition
    };
    
    forecasts.push(forecast);
  }
  
  return forecasts;
}

export function generateWeatherForecasts(siteId: string, hours = 24): WeatherForecast[] {
  const now = new Date();
  const forecasts: WeatherForecast[] = [];
  
  for (let i = 0; i < hours; i++) {
    const forecastTime = new Date(now);
    forecastTime.setHours(now.getHours() + i);
    
    const hour = forecastTime.getHours();
    const weatherCondition = getWeatherCondition(hour);
    
    const forecast: WeatherForecast = {
      id: uuidv4(),
      site_id: siteId,
      timestamp: forecastTime.toISOString(),
      forecast_time: forecastTime.toISOString(),
      temperature: getTemperatureForHour(hour),
      humidity: getHumidityForHour(hour),
      cloud_cover: getCloudCoverForHour(hour, weatherCondition),
      wind_speed: 5 + Math.random() * 10,
      wind_direction: getWindDirection(),
      precipitation: 0,
      weather_condition: weatherCondition,
      created_at: new Date().toISOString()
    };
    
    // Add some precipitation for rainy conditions
    if (forecast.weather_condition.includes('Rain')) {
      forecast.precipitation = Math.random() * 5;
    }
    
    forecasts.push(forecast);
  }
  
  return forecasts;
}

// Helper functions for weather simulation
function getTemperatureForHour(hour: number): number {
  // Temperature curve with low in early morning, peak in afternoon
  const baseTemp = 15; // Base temperature
  
  if (hour >= 0 && hour < 6) {
    // Coolest in early morning (15-18°C)
    return baseTemp + Math.random() * 3;
  } else if (hour >= 6 && hour < 12) {
    // Rising in morning (18-24°C)
    const rampFactor = (hour - 6) / 6;
    return baseTemp + 3 + rampFactor * 6 + Math.random() * 2;
  } else if (hour >= 12 && hour < 18) {
    // Warmest in afternoon (24-28°C)
    return baseTemp + 9 + Math.random() * 4;
  } else {
    // Cooling in evening (18-22°C)
    const rampFactor = 1 - (hour - 18) / 6;
    return baseTemp + 3 + rampFactor * 4 + Math.random() * 2;
  }
}

function getHumidityForHour(hour: number): number {
  // Humidity is higher in morning and evening, lower during the day
  if (hour >= 5 && hour < 10) {
    // Morning humidity
    return 70 + Math.random() * 15;
  } else if (hour >= 10 && hour < 18) {
    // Daytime humidity
    return 50 + Math.random() * 15;
  } else {
    // Evening/night humidity
    return 60 + Math.random() * 20;
  }
}

function getCloudCoverForHour(hour: number, weatherCondition: string): number {
  // Cloud cover depends on the weather condition
  if (weatherCondition.includes('Clear')) {
    return Math.random() * 10;
  } else if (weatherCondition.includes('Partly')) {
    return 30 + Math.random() * 30;
  } else if (weatherCondition.includes('Cloudy')) {
    return 70 + Math.random() * 30;
  } else {
    return 80 + Math.random() * 20;
  }
}

function getWindDirection(): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.floor(Math.random() * directions.length)];
}

function getWeatherCondition(hour: number): string {
  // Simple weather patterns based on time of day and randomness
  const rand = Math.random();
  
  // Clear skies more likely during afternoon
  if (hour >= 10 && hour <= 16) {
    if (rand < 0.6) return 'Clear';
    if (rand < 0.8) return 'Partly Cloudy';
    return 'Cloudy';
  }
  
  // More clouds in morning and evening
  if ((hour >= 6 && hour < 10) || (hour > 16 && hour <= 20)) {
    if (rand < 0.3) return 'Clear';
    if (rand < 0.6) return 'Partly Cloudy';
    if (rand < 0.8) return 'Cloudy';
    return 'Light Rain';
  }
  
  // Night has more varied conditions
  if (rand < 0.4) return 'Clear';
  if (rand < 0.6) return 'Partly Cloudy';
  if (rand < 0.8) return 'Cloudy';
  if (rand < 0.9) return 'Light Rain';
  return 'Rain';
}
