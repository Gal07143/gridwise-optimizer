// mqtt-ingestion/index.js
import mqtt from 'mqtt';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
const client = mqtt.connect(MQTT_BROKER_URL);

client.on('connect', () => {
  console.log('MQTT Connected');
  client.subscribe('telemetry/devices/+');
});

client.on('message', async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());

    const { device_id, timestamp, metrics } = payload;

    if (!device_id || !metrics) {
      console.warn('Missing device_id or metrics in message:', payload);
      return;
    }

    // Optional: verify device exists
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('id')
      .eq('id', device_id)
      .single();

    if (deviceError || !device) {
      console.warn(`Device not found: ${device_id}`);
      return;
    }

    const reading = {
      device_id,
      timestamp: timestamp || new Date().toISOString(),
      voltage: metrics.voltage || null,
      current: metrics.current || null,
      power: metrics.power || null,
      temperature: metrics.temperature || null,
      energy: metrics.energy || null,
      state_of_charge: metrics.state_of_charge || null,
      reading_type: 'mqtt',
      unit: 'auto',
      quality: 1
    };

    const { error: insertError } = await supabase
      .from('modbus_readings')
      .insert([reading]);

    if (insertError) {
      console.error('Error inserting device data:', insertError.message);
    } else {
      console.log(`Inserted reading for device ${device_id}`);
    }
  } catch (error) {
    console.error('Error handling MQTT message:', error);
  }
});
