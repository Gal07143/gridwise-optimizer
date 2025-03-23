
import dotenv from 'dotenv';
dotenv.config();

import { readFromModbus } from './modbusReader.js';
import { insertReading } from './supabaseClient.js';

const INTERVAL_MS = 5000; // every 5 seconds

async function runAgent() {
  console.log('⚡ Starting Modbus Agent...');
  console.log(`Configuration:
  - Modbus Host: ${process.env.MODBUS_HOST || '127.0.0.1'}
  - Modbus Port: ${process.env.MODBUS_PORT || '502'}
  - Device ID: ${process.env.DEVICE_ID || 'modbus-device-001'}
  - Supabase URL: ${process.env.SUPABASE_URL}
  `);

  setInterval(async () => {
    try {
      console.log('📊 Reading modbus data...');
      const reading = await readFromModbus();
      console.log('📥 Reading:', reading);

      await insertReading(reading);
      console.log('✅ Uploaded to Supabase');
    } catch (err) {
      console.error('❌ Error in agent loop:', err);
    }
  }, INTERVAL_MS);
}

runAgent();
