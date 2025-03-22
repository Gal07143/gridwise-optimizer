import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

export async function insertReading(reading) {
  const { error } = await supabase.from('modbus_readings').insert([reading]);

  if (error) {
    throw new Error('Failed to insert reading: ' + error.message);
  }
}
