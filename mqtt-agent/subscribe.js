import dotenv from 'dotenv';
dotenv.config();

import * as mqtt from 'mqtt';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// MQTT connection options
const mqttOptions = {
  clientId: `grid-ems-subscriber-${Math.random().toString(16).substring(2, 8)}`,
  clean: true,
  connectTimeout: 4000,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  reconnectPeriod: 1000,
};

// Connect to your MQTT broker
console.log(`Connecting to MQTT broker at ${process.env.MQTT_BROKER_URL}`);
const client = mqtt.connect(process.env.MQTT_BROKER_URL, mqttOptions);

// Define topics to subscribe to
const topicPrefix = process.env.MQTT_TOPIC_PREFIX || 'energy/grid';
const telemetryTopic = 'telemetry/devices/+'; // + is a wildcard for any device ID

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Subscribe to the telemetry topic
  client.subscribe(telemetryTopic, { qos: 1 }, (err) => {
    if (!err) {
      console.log(`Subscribed to ${telemetryTopic}`);
    } else {
      console.error('Subscription error:', err);
    }
  });
  
  // Also subscribe to control messages
  client.subscribe(`${topicPrefix}/control/#`, { qos: 1 }, (err) => {
    if (!err) {
      console.log(`Subscribed to ${topicPrefix}/control/#`);
    } else {
      console.error('Subscription error:', err);
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    console.log(`Message received on topic: ${topic}`);
    const payload = JSON.parse(message.toString());
    
    // Extract the device ID from the topic
    let deviceId = '';
    
    if (topic.startsWith('telemetry/devices/')) {
      deviceId = topic.split('/')[2];
      console.log(`Processing telemetry for device ${deviceId}`);
      
      // Process telemetry data
      if (!payload.metrics) {
        console.warn('Missing metrics in message:', payload);
        return;
      }
      
      // Save to Supabase
      await saveTelemetryToSupabase(deviceId, payload);
    }
    // Handle control messages
    else if (topic.startsWith(`${topicPrefix}/control/`)) {
      console.log('Processing control message:', payload);
      // You would implement control logic here
    }
  } catch (error) {
    console.error('Error handling MQTT message:', error);
  }
});

client.on('error', (err) => {
  console.error('MQTT client error:', err);
});

async function saveTelemetryToSupabase(deviceId, payload) {
  try {
    // Verify device exists
    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('id')
      .eq('id', deviceId)
      .single();

    if (deviceError) {
      console.warn(`Device not found: ${deviceId}. Error: ${deviceError.message}`);
      // Continue anyway, but log the warning
    }

    // Extract metrics from payload
    const { metrics } = payload;
    
    // Create telemetry record
    const telemetryData = {
      device_id: deviceId,
      timestamp: payload.timestamp || new Date().toISOString(),
      message: metrics, // Store the entire metrics object
      source: 'mqtt',
      topic: topic,
      severity: 'info'
    };

    // Insert into telemetry_log
    const { error: insertError } = await supabase
      .from('telemetry_log')
      .insert([telemetryData]);

    if (insertError) {
      console.error('Error inserting telemetry:', insertError.message);
      return;
    }

    console.log(`✅ Inserted telemetry for device ${deviceId}`);
  } catch (error) {
    console.error('Error saving telemetry to Supabase:', error);
  }
}

// Keep the process running
process.on('SIGINT', () => {
  console.log('Disconnecting MQTT client');
  client.end();
  process.exit();
});
