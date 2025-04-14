
// Simple forecast service for development and testing purposes

// Fetch energy forecasts (generation & consumption)
export async function fetchForecasts(timeframe = '24h', siteId?: string): Promise<any[]> {
  // Mock forecast data
  const now = new Date();
  const forecastPoints = [];
  let pointCount = getTimeframeHours(timeframe);
  
  for (let i = 0; i < pointCount; i++) {
    const timestamp = new Date(now.getTime() + (i * 60 * 60 * 1000));
    const hour = timestamp.getHours();

    // Simulate realistic generation/consumption patterns
    const isDay = hour >= 7 && hour <= 19;
    const isPeak = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);

    // Solar generation peaks during midday
    let generationBase = isDay ? 5 + (Math.sin((hour - 7) / 12 * Math.PI) * 15) : 0;
    
    // Add some randomness
    generationBase = Math.max(0, generationBase + (Math.random() * 3 - 1.5));
    
    // Consumption pattern with morning/evening peaks
    let consumptionBase = 3 + (isPeak ? 7 : 0) + (Math.random() * 2);

    forecastPoints.push({
      timestamp: timestamp.toISOString(),
      generation_forecast: generationBase,
      consumption_forecast: consumptionBase,
      net_forecast: generationBase - consumptionBase,
      confidence: 0.8 - (i * 0.01) // Confidence decreases over time
    });
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return forecastPoints;
}

// Helper function to determine number of data points based on timeframe
function getTimeframeHours(timeframe: string): number {
  switch (timeframe) {
    case '6h': return 6;
    case '12h': return 12;
    case '24h': return 24;
    case '48h': return 48;
    case '7d': return 168;
    case '30d': return 720;
    default: return 24;
  }
}

// Weather impact on energy generation/consumption
export async function getWeatherImpact(siteId: string): Promise<Record<string, any>> {
  // Mock weather impact data
  return {
    current: {
      temperature: 22,
      cloud_cover: 30,
      irradiance: 800,
      humidity: 55,
      wind_speed: 12
    },
    forecast: [
      {
        timestamp: new Date(Date.now() + 3600000).toISOString(),
        temperature: 23,
        cloud_cover: 25,
        irradiance: 850,
        humidity: 50,
        wind_speed: 10
      },
      {
        timestamp: new Date(Date.now() + 7200000).toISOString(),
        temperature: 24,
        cloud_cover: 40,
        irradiance: 700,
        humidity: 45,
        wind_speed: 8
      }
    ],
    impact: {
      solar_generation: -15, // percent impact
      consumption: 8, // percent impact
      description: "Cloud cover reducing solar generation; higher temperatures increasing cooling load"
    }
  };
}
