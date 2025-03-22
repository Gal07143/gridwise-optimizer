require('dotenv').config();
const mqtt = require('mqtt');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Connect to your MQTT broker
const client = mqtt.connect(process.env.MQTT_BROKER_URL);

async function publishEnergyReadings() {
  try {
    const { data, error } = await supabase
      .from('energy_readings')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (error) throw error;

    const payload = JSON.stringify(data);
    
    client.publish('energy/readings', payload, { qos: 1 }, () => {
      console.log('Energy readings published via MQTT:', payload);
      client.end();
    });

  } catch (error) {
    console.error('Error fetching or publishing data:', error);
    client.end();
  }
}

publishEnergyReadings();
