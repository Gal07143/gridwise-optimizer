import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetch all active modbus devices from Supabase.
 * @returns {Promise<Array>} Array of device objects (ip, port, unit_id, etc.)
 */
export async function getActiveDevices() {
  const { data, error } = await supabase
    .from('modbus_devices')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching active devices:', error.message);
    return [];
  }
  return data || [];
}

/**
 * Insert a Modbus reading into the 'modbus_normalized' table.
 * @param {string} deviceId - The UUID of the device from modbus_devices table
 * @param {Object} reading - Key/value pairs of measured data
 */
export async function insertReading(deviceId, reading) {
  const payload = {
    device_id: deviceId,
    ...reading,
    timestamp: new Date().toISOString()
  };

  const { error } = await supabase
    .from('modbus_normalized')
    .insert([payload]);

  if (error) {
    console.error('Error inserting reading:', error.message);
    throw error;
  }
}
