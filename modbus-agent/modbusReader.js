
import ModbusRTU from 'modbus-serial';

// Configure your Modbus device details
const DEVICE_CONFIG = {
  host: process.env.MODBUS_HOST || '127.0.0.1',
  port: parseInt(process.env.MODBUS_PORT || '502'),
  id: parseInt(process.env.MODBUS_ID || '1'),
  timeout: 2000,
};

// Register addresses for different metrics (customize based on your device)
const REGISTERS = {
  voltage: { address: 0, length: 2, scaling: 0.1 },
  current: { address: 2, length: 2, scaling: 0.01 },
  power: { address: 4, length: 2, scaling: 0.001 },
  energy: { address: 6, length: 2, scaling: 0.1 },
  temperature: { address: 8, length: 1, scaling: 0.1 },
  state_of_charge: { address: 9, length: 1, scaling: 1 },
};

// Create a new Modbus client
const client = new ModbusRTU();

// Function to create a connection to the Modbus server
async function connect() {
  try {
    // Close any existing connection
    if (client.isOpen) {
      await client.close();
    }
    
    // Connect TCP
    await client.connectTCP(DEVICE_CONFIG.host, { port: DEVICE_CONFIG.port });
    client.setID(DEVICE_CONFIG.id);
    client.setTimeout(DEVICE_CONFIG.timeout);
    
    console.log(`Connected to Modbus TCP at ${DEVICE_CONFIG.host}:${DEVICE_CONFIG.port}`);
    return true;
  } catch (err) {
    console.error('Failed to connect to Modbus server:', err.message);
    
    // Fall back to simulation if connection fails
    return false;
  }
}

// Function to read a specific register
async function readRegister(register) {
  try {
    const result = await client.readHoldingRegisters(
      register.address,
      register.length
    );
    
    // Apply scaling factor
    const value = result.data[0] * register.scaling;
    return value;
  } catch (err) {
    console.error(`Failed to read register at address ${register.address}:`, err.message);
    return null;
  }
}

// Main function to read all registers
export async function readFromModbus() {
  const timestamp = new Date();
  let useSimulation = false;
  
  // Try to connect to real Modbus device
  try {
    const connected = await connect();
    if (!connected) {
      useSimulation = true;
    }
  } catch (err) {
    console.warn('Connection error, falling back to simulation:', err.message);
    useSimulation = true;
  }
  
  // If we're simulating, return simulated data
  if (useSimulation) {
    console.log('Using simulated Modbus data');
    return generateSimulatedData();
  }
  
  // Read all registers
  try {
    const voltage = await readRegister(REGISTERS.voltage);
    const current = await readRegister(REGISTERS.current);
    const power = await readRegister(REGISTERS.power);
    const energy = await readRegister(REGISTERS.energy);
    const temperature = await readRegister(REGISTERS.temperature);
    const stateOfCharge = await readRegister(REGISTERS.state_of_charge);
    
    return {
      device_id: process.env.DEVICE_ID || 'modbus-device-001',
      timestamp: timestamp.toISOString(),
      voltage: voltage,
      current: current,
      power_kw: power,
      energy_kwh: energy,
      temperature: temperature,
      state_of_charge: stateOfCharge,
    };
  } catch (err) {
    console.error('Error reading from Modbus:', err.message);
    console.log('Falling back to simulated data');
    return generateSimulatedData();
  } finally {
    // Close the connection after reading
    try {
      if (client.isOpen) {
        await client.close();
      }
    } catch (err) {
      console.error('Error closing Modbus connection:', err.message);
    }
  }
}

// Function to generate simulated data for testing
function generateSimulatedData() {
  const now = new Date();
  // Create some variation in the values for realistic data
  const timeVariation = Math.sin(now.getHours() * 15 * Math.PI / 180) * 0.2 + 1;
  
  return {
    device_id: process.env.DEVICE_ID || 'modbus-device-001',
    timestamp: now.toISOString(),
    voltage: parseFloat((220 + Math.random() * 5 * timeVariation).toFixed(2)),
    current: parseFloat((10 + Math.random() * 2 * timeVariation).toFixed(2)),
    power_kw: parseFloat((2 + Math.random() * timeVariation).toFixed(2)),
    energy_kwh: parseFloat((100 + Math.random() * 10 * timeVariation).toFixed(2)),
    temperature: parseFloat((35 + Math.random() * 3).toFixed(1)),
    state_of_charge: parseFloat((75 + Math.random() * 15).toFixed(0)),
  };
}
