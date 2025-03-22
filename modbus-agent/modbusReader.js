export async function readFromModbus() {
  const now = new Date();
  return {
    device_id: 'simulated-device-001',
    timestamp: now.toISOString(),
    voltage: parseFloat((220 + Math.random() * 5).toFixed(2)),
    current: parseFloat((10 + Math.random() * 2).toFixed(2)),
    power_kw: parseFloat((2 + Math.random()).toFixed(2)),
    energy_kwh: parseFloat((100 + Math.random() * 10).toFixed(2)),
  };
}
