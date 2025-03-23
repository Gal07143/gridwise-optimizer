import ModbusRTU from 'modbus-serial';

/**
 * Default environment-based config (single device fallback).
 */
const DEFAULT_DEVICE_CONFIG = {
  host: process.env.MODBUS_HOST || '127.0.0.1',
  port: parseInt(process.env.MODBUS_PORT || '502', 10),
  id: parseInt(process.env.MODBUS_ID || '1', 10),
  timeout: 2000,
  device_id: process.env.DEVICE_ID || 'modbus-device-001',
};

/**
 * Register addresses for different metrics (customize for your device).
 */
const REGISTERS = {
  voltage:       { address: 0, length: 2, scaling: 0.1 },
  current:       { address: 2, length: 2, scaling: 0.01 },
  power:         { address: 4, length: 2, scaling: 0.001 },
  energy:        { address: 6, length: 2, scaling: 0.1 },
  temperature:   { address: 8, length: 1, scaling: 0.1 },
  state_of_charge: { address: 9, length: 1, scaling: 1 },
};

/**
 * Create a new Modbus client (shared, or create per call).
 */
const client = new ModbusRTU();

/**
 * Attempt to connect to a Modbus device.
 * @param {string} host - Modbus device IP or hostname
 * @param {number} port - Modbus port (usually 502)
 * @param {number} unitId - Modbus slave ID
 * @param {number} timeout - Connection/read timeout in ms
 * @returns {Promise<boolean>} True if connected, false if failed.
 */
async function connectToDevice(host, port, unitId, timeout) {
  try {
    // Close any existing connection
    if (client.isOpen) {
      await client.close();
    }
    await client.connectTCP(host, { port });
    client.setID(unitId);
    client.setTimeout(timeout);
    console.log(`Connected to Modbus at ${host}:${port} (Unit ${unitId})`);
    return true;
  } catch (err) {
    console.error('Failed to connect to Modbus server:', err.message);
    return false;
  }
}

/**
 * Reads a specific register from the connected Modbus device.
 * @param {Object} register - { address, length, scaling }
 * @returns {Promise<number|null>} The scaled value or null on error.
 */
async function readRegister(register) {
  try {
    const result = await client.readHoldingRegisters(register.address, register.length);
    // Example uses the first word only. If length=2 for 32-bit data, you might combine two words.
    const rawValue = result.data[0];
    const scaledValue = rawValue * register.scaling;
    return scaledValue;
  } catch (err) {
    console.error(`Failed to read register at address ${register.address}:`, err.message);
    return null;
  }
}

/**
 * Generates simulated data (fallback if connection fails).
 */
function generateSimulatedData(deviceId = 'simulated-device') {
  const now = new Date();
  // Some time-based variation
  const timeVariation = Math.sin(now.getHours() * 15 * Math.PI / 180) * 0.2 + 1;

  return {
    device_id: deviceId,
    timestamp: now.toISOString(),
    voltage: parseFloat((220 + Math.random() * 5 * timeVariation).toFixed(2)),
    current: parseFloat((10 + Math.random() * 2 * timeVariation).toFixed(2)),
    power_kw: parseFloat((2 + Math.random() * timeVariation).toFixed(2)),
    energy_kwh: parseFloat((100 + Math.random() * 10 * timeVariation).toFixed(2)),
    temperature: parseFloat((35 + Math.random() * 3).toFixed(1)),
    state_of_charge: parseFloat((75 + Math.random() * 15).toFixed(0)),
  };
}

/**
 * Reads data from a Modbus device or returns simulated data on failure.
 * @param {Object} [config] - { host, port, id, timeout, device_id }
 * @returns {Promise<Object>} An object with all measured or simulated values.
 */
export async function readFromModbus(config = {}) {
  // Merge provided config with environment-based defaults
  const finalConfig = {
    ...DEFAULT_DEVICE_CONFIG,
    ...config,
  };
  const { host, port, id, timeout, device_id } = finalConfig;

  let useSimulation = false;

  // Try connecting
  const connected = await connectToDevice(host, port, id, timeout);
  if (!connected) {
    useSimulation = true;
  }

  if (useSimulation) {
    console.log('Using simulated Modbus data.');
    return generateSimulatedData(device_id);
  }

  // Connected successfully, read registers
  try {
    const voltage = await readRegister(REGISTERS.voltage);
    const current = await readRegister(REGISTERS.current);
    const power = await readRegister(REGISTERS.power);
    const energy = await readRegister(REGISTERS.energy);
    const temperature = await readRegister(REGISTERS.temperature);
    const stateOfCharge = await readRegister(REGISTERS.state_of_charge);

    return {
      device_id,
      timestamp: new Date().toISOString(),
      voltage,
      current,
      power_kw: power,
      energy_kwh: energy,
      temperature,
      state_of_charge: stateOfCharge,
    };
  } catch (err) {
    console.error('Error reading from Modbus:', err.message);
    console.log('Falling back to simulated data.');
    return generateSimulatedData(device_id);
  } finally {
    // Close the connection
    try {
      if (client.isOpen) {
        await client.close();
      }
    } catch (err) {
      console.error('Error closing Modbus connection:', err.message);
    }
  }
}
