
// Energy consumption data
export const weeklyEnergyData = [
  { time: 'Mon', value: 320, comparison: 290 },
  { time: 'Tue', value: 350, comparison: 310 },
  { time: 'Wed', value: 410, comparison: 380 },
  { time: 'Thu', value: 390, comparison: 410 },
  { time: 'Fri', value: 450, comparison: 420 },
  { time: 'Sat', value: 380, comparison: 370 },
  { time: 'Sun', value: 290, comparison: 280 },
];

// Energy generation data
export const monthlyGenerationData = [
  { time: 'Jan', value: 4200, comparison: 3800 },
  { time: 'Feb', value: 4500, comparison: 4100 },
  { time: 'Mar', value: 5100, comparison: 4700 },
  { time: 'Apr', value: 5400, comparison: 4900 },
  { time: 'May', value: 6200, comparison: 5400 },
  { time: 'Jun', value: 6800, comparison: 5900 },
  { time: 'Jul', value: 7100, comparison: 6200 },
  { time: 'Aug', value: 7000, comparison: 6300 },
  { time: 'Sep', value: 6300, comparison: 5700 },
  { time: 'Oct', value: 5600, comparison: 5100 },
  { time: 'Nov', value: 4900, comparison: 4400 },
  { time: 'Dec', value: 4100, comparison: 3900 },
];

// Peak demand data
export const peakDemandData = [
  { time: '00:00', value: 86, comparison: 82 },
  { time: '03:00', value: 72, comparison: 70 },
  { time: '06:00', value: 91, comparison: 85 },
  { time: '09:00', value: 132, comparison: 120 },
  { time: '12:00', value: 145, comparison: 138 },
  { time: '15:00', value: 156, comparison: 145 },
  { time: '18:00', value: 168, comparison: 152 },
  { time: '21:00', value: 120, comparison: 115 },
  { time: '24:00', value: 94, comparison: 90 },
];

// Energy sources data
export const energySourcesData = [
  { name: 'Solar', value: 45 },
  { name: 'Wind', value: 30 },
  { name: 'Grid', value: 15 },
  { name: 'Battery', value: 10 },
];

// Top consumers data
export const topConsumersData = [
  { device: 'Heat Pump', consumption: 1240, change: '+5%' },
  { device: 'EV Charger', consumption: 950, change: '+12%' },
  { device: 'Air Conditioning', consumption: 820, change: '-3%' },
  { device: 'Kitchen Appliances', consumption: 480, change: '+1%' },
  { device: 'Lighting', consumption: 320, change: '-8%' },
];

// Cost breakdown data
export const costBreakdownData = [
  { category: 'Peak Hours', cost: 182.50, percentage: 45 },
  { category: 'Off-Peak Hours', cost: 78.30, percentage: 20 },
  { category: 'Shoulder Hours', cost: 142.20, percentage: 35 },
];
