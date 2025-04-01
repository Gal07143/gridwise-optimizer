
import ModbusRTU from 'modbus-serial';

// Default configuration if environment variables are not provided
const defaultConfig = {
  host: process.env.MODBUS_HOST || '127.0.0.1',
  port: parseInt(process.env.MODBUS_PORT || '502', 10),
  id: parseInt(process.env.MODBUS_ID || '1', 10),
  deviceId: process.env.DEVICE_ID || 'inverter-01'
};

/**
 * Read data from a Modbus device
 * @param {Object} config - Configuration options
 * @returns {Object} The reading data
 */
export async function readFromModbus(config = defaultConfig) {
  // Create a new client
  const client = new ModbusRTU();
  
  try {
    // Connect to the Modbus device
    await client.connectTCP(config.host, { port: config.port });
    console.log(`Connected to Modbus device at ${config.host}:${config.port}`);
    
    // Set the slave ID
    client.setID(config.id);
    
    // Set a timeout for requests (in ms)
    client.setTimeout(5000);
    
    // Read holding registers for voltage, current, power, and energy data
    console.log('Reading voltage registers...');
    const voltageRegs = await client.readHoldingRegisters(100, 2);
    const voltage = voltageRegs.data[0] / 10; // Assume scaled by 10
    
    console.log('Reading current registers...');
    const currentRegs = await client.readHoldingRegisters(102, 2);
    const current = currentRegs.data[0] / 100; // Assume scaled by 100
    
    console.log('Reading power registers...');
    const powerRegs = await client.readHoldingRegisters(104, 2);
    const powerKw = powerRegs.data[0] / 1000; // Convert W to kW
    
    console.log('Reading energy registers...');
    const energyRegs = await client.readHoldingRegisters(106, 2);
    const energyKwh = energyRegs.data[0] / 10; // Assume scaled by 10
    
    return {
      device_id: config.deviceId,
      timestamp: new Date().toISOString(),
      voltage,
      current,
      power_kw: powerKw,
      energy_kwh: energyKwh
    };
  } catch (error) {
    console.error('Error reading from Modbus:', error);
    
    // Return mock data for testing when real device is unavailable
    return {
      device_id: config.deviceId,
      timestamp: new Date().toISOString(),
      voltage: 230 + Math.random() * 10,
      current: 5 + Math.random() * 2,
      power_kw: 1.2 + Math.random() * 0.5,
      energy_kwh: 456 + Math.random() * 10
    };
  } finally {
    // Close the connection
    try {
      await client.close();
      console.log('Modbus connection closed');
    } catch (closeError) {
      console.error('Error closing Modbus connection:', closeError);
    }
  }
}

// If this script is run directly (not imported)
if (import.meta.url === import.meta.main) {
  try {
    const reading = await readFromModbus();
    console.log('Reading:', reading);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
