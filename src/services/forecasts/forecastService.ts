
import { generateMockForecasts } from './sampleGenerator';

// Get forecast data for a site
export const fetchForecasts = async (timeframe: string = '24h', siteId?: string) => {
  try {
    // In a real app, this would be an API call
    const siteForecast = generateMockForecasts(siteId, timeframeToHours(timeframe));
    return siteForecast;
  } catch (error) {
    console.error('Error fetching forecasts:', error);
    throw error;
  }
};

// Helper to convert timeframe string to hours
function timeframeToHours(timeframe: string): number {
  switch (timeframe) {
    case '24h':
      return 24;
    case '48h':
      return 48;
    case '7d':
      return 168; // 7 * 24
    case '1h':
      return 1;
    default:
      return 24;
  }
}
