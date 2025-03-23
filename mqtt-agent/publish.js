
import dotenv from 'dotenv';
dotenv.config();

import * as mqtt from 'mqtt';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// MQTT connection options
const mqttOptions = {
  clientId: process.env.MQTT_CLIENT_ID || `grid-ems-mqtt-${Math.random().toString(16).substring(2, 8)}`,
  clean: true,
  connectTimeout: 4000,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  reconnectPeriod: 1000,
};

// Connect to your MQTT broker
console.log(`Connecting to MQTT broker at ${process.env.MQTT_BROKER_URL}`);
const client = mqtt.connect(process.env.MQTT_BROKER_URL, mqttOptions);

// Define topics
const topicPrefix = process.env.MQTT_TOPIC_PREFIX || 'energy/grid';
const readingsTopic = `${topicPrefix}/readings`;
const devicesTopic = `${topicPrefix}/devices`;
const controlTopic = `${topicPrefix}/control`;

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  publishEnergyReadings();
});

client.on('error', (err) => {
  console.error('MQTT connection error:', err);
  client.end();
});

async function publishEnergyReadings() {
  try {
    console.log('Fetching energy readings from Supabase...');
    
    // Fetch the latest energy readings
    const { data, error } = await supabase
      .from('telemetry_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      client.end();
      return;
    }

    if (!data || data.length === 0) {
      console.log('No readings found in database');
      client.end();
      return;
    }

    console.log(`Found ${data.length} readings to publish`);
    
    // Format the data for MQTT publication
    const formattedReadings = data.map(reading => {
      // Extract telemetry values from message if it exists
      let telemetry = {};
      if (reading.message) {
        if (typeof reading.message === 'string') {
          try {
            telemetry = JSON.parse(reading.message);
          } catch (e) {
            console.warn('Could not parse message as JSON:', e);
          }
        } else if (typeof reading.message === 'object') {
          telemetry = reading.message;
        }
      }
      
      return {
        id: reading.id,
        device_id: reading.device_id,
        timestamp: reading.created_at,
        metrics: {
          voltage: telemetry.voltage || null,
          current: telemetry.current || null,
          power: telemetry.power || null,
          temperature: telemetry.temperature || null,
          energy: telemetry.energy || null,
          state_of_charge: telemetry.state_of_charge || null
        }
      };
    });

    // Publish to different topics
    const payload = JSON.stringify(formattedReadings);
    client.publish(readingsTopic, payload, { qos: 1 }, () => {
      console.log(`Published ${formattedReadings.length} readings to ${readingsTopic}`);
    });
    
    // Also publish individual device readings
    const deviceGroups = formattedReadings.reduce((acc, reading) => {
      if (!acc[reading.device_id]) {
        acc[reading.device_id] = [];
      }
      acc[reading.device_id].push(reading);
      return acc;
    }, {});
    
    Object.entries(deviceGroups).forEach(([deviceId, readings]) => {
      const deviceTopic = `${devicesTopic}/${deviceId}`;
      client.publish(deviceTopic, JSON.stringify(readings), { qos: 1 }, () => {
        console.log(`Published ${readings.length} readings for device ${deviceId}`);
      });
    });
    
    // Publish a system status message
    const statusMessage = {
      system: 'grid-ems',
      timestamp: new Date().toISOString(),
      status: 'online',
      readings_count: formattedReadings.length,
      devices_count: Object.keys(deviceGroups).length
    };
    
    client.publish(`${topicPrefix}/status`, JSON.stringify(statusMessage), { qos: 1 }, () => {
      console.log('Published system status');
      setTimeout(() => client.end(), 1000); // End after a delay to ensure messages are sent
    });

  } catch (error) {
    console.error('Error in publishEnergyReadings:', error);
    client.end();
  }
}
