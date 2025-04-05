
import axios, { AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Function to handle errors consistently
const handleError = (error: any, message = 'Error fetching telemetry data') => {
  console.error(message, error);
  toast.error(message);
  throw error;
};

// Get telemetry data for device
export const fetchDeviceTelemetry = async (deviceId: string) => {
  try {
    const apiResponse = await axios.get(`/api/devices/${deviceId}/telemetry`);
    return apiResponse.data;
  } catch (error) {
    handleError(error, `Failed to fetch telemetry for device ${deviceId}`);
  }
};

// Get real-time telemetry with historical context
export const fetchTelemetryWithHistory = async (deviceId: string, timeframe = '24h') => {
  try {
    const apiResponse = await axios.get(`/api/devices/${deviceId}/telemetry/history`, {
      params: { timeframe }
    });
    return apiResponse.data;
  } catch (error) {
    handleError(error, 'Failed to fetch historical telemetry data');
  }
};

// Subscribe to live telemetry updates
export const subscribeToLiveTelemetry = (deviceId: string, callback: (data: any) => void) => {
  let eventSource: EventSource | null = null;
  
  try {
    eventSource = new EventSource(`/api/devices/${deviceId}/telemetry/subscribe`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (err) {
        console.error('Error parsing telemetry SSE data:', err);
      }
    };
    
    eventSource.onerror = () => {
      console.error('Telemetry SSE connection error');
      if (eventSource) {
        eventSource.close();
      }
      
      // Attempt to reconnect after a delay
      setTimeout(() => {
        subscribeToLiveTelemetry(deviceId, callback);
      }, 5000);
    };
    
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  } catch (error) {
    console.error('Error setting up telemetry SSE:', error);
    return () => {};
  }
};

// Get aggregated telemetry statistics
export const fetchTelemetryStats = async (deviceId: string, timeframe = '24h') => {
  try {
    const apiResponse = await axios.get(`/api/devices/${deviceId}/telemetry/stats`, {
      params: { timeframe }
    });
    return apiResponse.data;
  } catch (error) {
    handleError(error, 'Failed to fetch telemetry statistics');
  }
};

export default {
  fetchDeviceTelemetry,
  fetchTelemetryWithHistory,
  subscribeToLiveTelemetry,
  fetchTelemetryStats
};
