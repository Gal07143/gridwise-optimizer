
import mqtt from 'mqtt';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Supabase client init
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// MQTT configuration
const mqttBroker = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const clientId = `ems_mqtt_client_${Math.random().toString(16).slice(2, 8)}`;
const topics = [
  'devices/+/telemetry',
  'ems/#',
  'energy/consumption',
  'energy/production'
];

// Connect to MQTT broker
const client = mqtt.connect(mqttBroker, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

// Connection callback
client.on('connect', () => {
  console.log('Connected to MQTT broker:', mqttBroker);
  
  // Subscribe to all topics
  topics.forEach(topic => {
    client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic}`);
      } else {
        console.error(`Error subscribing to ${topic}:`, err);
      }
    });
  });
});

// Message handler
client.on('message', async (topic, payload) => {
  try {
    console.log(`Received message on ${topic}`);
    const message = JSON.parse(payload.toString());
    
    // Extract device ID from topic if available
    let deviceId = null;
    if (topic.includes('/devices/')) {
      const parts = topic.split('/');
      const deviceIndex = parts.indexOf('devices') + 1;
      if (deviceIndex > 0 && deviceIndex < parts.length) {
        deviceId = parts[deviceIndex];
      }
    } else if (message.device_id) {
      deviceId = message.device_id;
    }
    
    // Log to telemetry_log table
    const { error } = await supabase.from('telemetry_log').insert({
      device_id: deviceId,
      message: message,
      topic: topic,
      severity: message.severity || 'info',
      source: 'mqtt'
    });
    
    if (error) {
      console.error('Error inserting telemetry data:', error);
    } else {
      console.log('Successfully logged telemetry data');
    }
    
    // Process specific message types for different topics
    if (topic.includes('/telemetry')) {
      // Store in appropriate tables based on device type
      processTelemetryData(deviceId, message);
    } else if (topic.startsWith('ems/')) {
      // Handle EMS specific messages
      processEmsMessage(topic, message);
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

// Process telemetry data based on content
async function processTelemetryData(deviceId, data) {
  try {
    // If the data contains energy readings
    if (data.power !== undefined || data.energy !== undefined || data.voltage !== undefined) {
      await supabase.from('energy_readings').insert({
        device_id: deviceId,
        power: data.power || 0,
        energy: data.energy || 0,
        voltage: data.voltage,
        current: data.current,
        frequency: data.frequency,
        temperature: data.temperature,
        state_of_charge: data.state_of_charge
      });
    }
    
    // Update device status if provided
    if (data.status) {
      await supabase.from('devices')
        .update({ status: data.status, last_seen: new Date().toISOString() })
        .eq('id', deviceId);
    }
    
    // Log faults if detected
    if (data.fault) {
      await supabase.from('faults').insert({
        device_id: deviceId,
        description: data.fault.description || 'Unknown fault',
        severity: data.fault.severity || 'low',
        status: 'open'
      });
    }
  } catch (error) {
    console.error('Error processing telemetry data:', error);
  }
}

// Process EMS messages
async function processEmsMessage(topic, message) {
  try {
    const topicParts = topic.split('/');
    const messageType = topicParts[1]; // e.g., 'ems/status' -> 'status'
    
    switch (messageType) {
      case 'status':
        // Update system status
        await supabase.from('system_status').upsert({
          category: message.category,
          status: message.status,
          details: message.details,
          updated_at: new Date().toISOString()
        }, { onConflict: 'category' });
        break;
      
      case 'alert':
        // Create new alert
        await supabase.from('alerts').insert({
          message: message.message,
          severity: message.severity || 'info',
          source: message.source || 'ems',
          device_id: message.device_id
        });
        break;
      
      case 'optimization':
        // Log optimization results
        console.log('Received optimization result:', message);
        break;
        
      default:
        // Just log other messages
        console.log(`Received ${messageType} message:`, message);
    }
  } catch (error) {
    console.error('Error processing EMS message:', error);
  }
}

// Error handling
client.on('error', (error) => {
  console.error('MQTT client error:', error);
});

client.on('reconnect', () => {
  console.log('Reconnecting to MQTT broker...');
});

client.on('close', () => {
  console.log('Disconnected from MQTT broker');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down MQTT client...');
  client.end(true, {}, () => {
    console.log('MQTT client disconnected');
    process.exit(0);
  });
});

console.log('MQTT ingestion service started');
