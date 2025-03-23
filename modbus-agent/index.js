import dotenv from 'dotenv';
dotenv.config();

import { readFromModbus } from './modbusReader.js';
import { insertReading } from './supabaseClient.js';

const INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '5000', 10);

async function runAgent() {
  console.log('⚡ Starting Modbus Agent...');
  console.log(`Using environment-based config:
    - MODBUS_HOST: ${process.env.MODBUS_HOST}
    - MODBUS_PORT: ${process.env.MODBUS_PORT}
    - MODBUS_ID:   ${process.env.MODBUS_ID}
    - DEVICE_ID:   ${process.env.DEVICE_ID}
  `);

  setInterval(async () => {
    try {
      console.log('📊 Reading modbus data...');
      const reading = await readFromModbus(); // no config passed => uses defaults
      console.log('📥 Reading:', reading);

      await insertReading(reading.device_id, reading);
      console.log('✅ Uploaded to Supabase');
    } catch (err) {
      console.error('❌ Error in agent loop:', err);
    }
  }, INTERVAL_MS);
}

runAgent();
