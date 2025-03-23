import dotenv from 'dotenv';
dotenv.config();

import { readFromModbus } from './modbusReader.js';
import { getActiveDevices, insertReading } from './supabaseClient.js';

const INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '5000', 10);

async function runAgent() {
  console.log('⚡ Starting Modbus Agent...');
  console.log(`Supabase URL: ${process.env.SUPABASE_URL}`);

  setInterval(async () => {
    try {
      // 1. Fetch all active devices from Supabase
      const devices = await getActiveDevices();
      if (!devices || devices.length === 0) {
        console.log('No active devices found.');
        return;
      }

      // 2. For each device, read Modbus data
      for (const device of devices) {
        console.log(`📊 Reading from device [${device.id}] (${device.ip}:${device.port}, unit ${device.unit_id})`);
        const reading = await readFromModbus(device.ip, device.port, device.unit_id);

        console.log('📥 Reading:', reading);

        // 3. Insert the reading into 'modbus_normalized'
        await insertReading(device.id, reading);
        console.log(`✅ Uploaded reading for device ${device.id}`);
      }
    } catch (err) {
      console.error('❌ Error in agent loop:', err);
    }
  }, INTERVAL_MS);
}

runAgent();
