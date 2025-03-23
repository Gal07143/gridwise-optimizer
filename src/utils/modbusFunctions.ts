import ModbusRTU from 'modbus-serial';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client – adjust to match your environment/secrets.
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

/**
 * Reads raw data from a Modbus device.
 * @param deviceIp The IP address of the Modbus device.
 * @param devicePort The port number for the Modbus connection.
 * @param unitId The Modbus unit ID.
 * @returns A promise that resolves to an array of raw register values.
 */
async function readRawData(deviceIp: string, devicePort: number, unitId: number): Promise<number[]> {
  const client = new ModbusRTU();
  try {
    await client.connectTCP(deviceIp, { port: devicePort });
    client.setID(unitId);
    // Example: reading 10 registers starting at address 0. Adjust as needed.
    const response = await client.readHoldingRegisters(0, 10);
    client.close();
    return response.data;
  } catch (error) {
    console.error("Error reading Modbus data:", error);
    client.close();
    throw error;
  }
}

/**
 * Cleans raw Modbus data by filtering out any unexpected values.
 * @param rawData Array of raw register values.
 * @returns Cleaned array of numbers.
 */
function cleanModbusData(rawData: number[]): number[] {
  // Example: filter out values that are negative or implausibly high.
  return rawData.filter(value => value >= 0 && value <= 10000);
}

/**
 * Normalizes cleaned Modbus data into a structured format.
 * @param cleanedData Array of cleaned register values.
 * @returns An object with normalized parameters.
 */
function normalizeModbusData(cleanedData: number[]): Record<string, number> {
  // Example mapping: assuming registers map to voltage, current, and power.
  return {
    voltage: cleanedData[0] / 10, // e.g., converting tenths to actual voltage
    current: cleanedData[1] / 100, // e.g., scaling factor for current
    power: cleanedData[2],         // raw power value, adjust if needed
  };
}

/**
 * Stores the normalized Modbus data into Supabase.
 * @param deviceId The ID of the device.
 * @param normalizedData Object containing normalized parameters.
 */
async function storeModbusData(deviceId: string, normalizedData: Record<string, number>) {
  const { error } = await supabase.from('modbus_normalized').insert([{
    device_id: deviceId,
    ...normalizedData,
    timestamp: new Date().toISOString(),
  }]);
  if (error) {
    console.error("Error storing normalized Modbus data:", error);
    throw error;
  }
}

/**
 * Processes a Modbus device: reads, cleans, normalizes, and stores data.
 * @param deviceId The unique ID of the device.
 * @param deviceIp The IP address of the Modbus device.
 * @param devicePort The port number of the device.
 * @param unitId The Modbus unit ID.
 */
export async function processModbusDevice(deviceId: string, deviceIp: string, devicePort: number, unitId: number) {
  try {
    // 1. Read raw Modbus data
    const rawData = await readRawData(deviceIp, devicePort, unitId);
    
    // 2. Clean the raw data
    const cleanedData = cleanModbusData(rawData);
    
    // 3. Normalize the cleaned data
    const normalizedData = normalizeModbusData(cleanedData);
    
    // 4. Store the normalized data in Supabase
    await storeModbusData(deviceId, normalizedData);
    console.log("Modbus data processed and stored successfully for device", deviceId);
  } catch (error) {
    console.error("Error processing Modbus device:", error);
  }
}
