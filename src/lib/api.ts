
// Mock API functions for device data

export const getLatestReadingForDevice = async (deviceId: string) => {
  // In a real implementation, this would make an API call
  return {
    voltage: 230 + Math.random() * 10,
    current: 10 + Math.random() * 5,
    power: 2300 + Math.random() * 500,
    frequency: 49.9 + Math.random() * 0.3,
    energy: 150 + Math.random() * 10,
    timestamp: new Date().toISOString()
  };
};

export const getDeviceById = async (deviceId: string) => {
  // Mock implementation
  return {
    id: deviceId,
    name: `Device ${deviceId}`,
    type: 'solar',
    status: 'active'
  };
};

export const getDeviceHistory = async (deviceId: string, period: string) => {
  // Generate some random history data
  const dataPoints = [];
  const now = Date.now();
  
  for (let i = 0; i < 24; i++) {
    dataPoints.push({
      timestamp: new Date(now - i * 3600000).toISOString(),
      value: Math.random() * 100
    });
  }
  
  return dataPoints.reverse();
};
