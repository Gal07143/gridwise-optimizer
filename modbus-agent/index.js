import dotenv from 'dotenv';
dotenv.config();

import { readFromModbus } from './modbusReader.js';
import { insertReading } from './supabaseClient.js';

const INTERVAL_MS = 5000; // every 5 seconds

async function runAgent() {
  console.log('⚡ Starting Modbus Agent...');

  setInterval(async () => {
    try {
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
