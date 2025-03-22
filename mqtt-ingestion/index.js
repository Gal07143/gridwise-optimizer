import mqtt from 'mqtt';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

if (!MQTT_BROKER_URL || !SUPABASE_URL || !SUPABASE_API_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Connect to Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

// Connect to MQTT broker
const client = mqtt.connect(MQTT_BROKER_URL);

client.on('connect', () => {
  console.log('✅ Connected to MQTT broker');
  client.subscribe('telemetry/#', (err) => {
    if (err) {
      console.error('❌ MQTT Subscription error:', err.message);
    } else {
      console.log('📡 Subscribed to topic: telemetry/#');
    }
  });
});

// On message received
client.on('message', async (topic, payload) => {
  try {
    const message = payload.toString();
    const data = JSON.parse(message);

    const deviceId = data.device_id || null;
    const severity = determineSeverity(data); // Optional logic
    const source = 'mqtt';

    const { error } = await supabase.from('telemetry_log').insert([
      {
        device_id: deviceId,
        topic,
        message: data,
        severity,
        source,
      },
    ]);

    if (error) {
      console.error('❌ Error inserting log into Supabase:', error.message);
    } else {
      console.log(`✅ Logged message from ${deviceId || 'unknown'} at ${new Date().toISOString()}`);
    }
  } catch (err) {
    console.error('❌ Failed to process MQTT message:', err.message);
  }
});

// Optional: Severity rule engine
function determineSeverity(data) {
  if (data?.voltage && (data.voltage < 180 || data.voltage > 260)) {
    return 'warning';
  }
  if (data?.error || data?.status === 'error') {
    return 'error';
  }
  return 'info';
}
