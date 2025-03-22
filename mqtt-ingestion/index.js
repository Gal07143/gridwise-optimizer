import mqtt from 'mqtt';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Init Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

// Connect to MQTT
const client = mqtt.connect(process.env.MQTT_BROKER_URL);

client.on('connect', () => {
  console.log('✅ Connected to MQTT broker');
  client.subscribe('telemetry/#'); // Adjust topic as needed
});

client.on('message', async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    const device_id = payload.device_id || 'unknown';

    const { error } = await supabase.from('modbus_raw').insert([
      {
        device_id,
        timestamp: new Date().toISOString(),
        voltage: payload.voltage,
        current: payload.current,
        power: payload.power,
        energy: payload.energy,
        frequency: payload.frequency,
        state_of_charge: payload.state_of_charge,
      },
    ]);

    if (error) {
      console.error('❌ Supabase insert error:', error.message);
    } else {
      console.log(`✅ Inserted telemetry for ${device_id}`);
    }
  } catch (err) {
    console.error('❌ Message error:', err);
  }
});
