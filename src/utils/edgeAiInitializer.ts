
import { edgeAI } from '@/edge-ai';
import { supabase } from '@/integrations/supabase/client';
import { TelemetryInput } from '@/edge-ai/config';

/**
 * Initialize Edge AI system and set up telemetry processing
 */
export const initializeEdgeAI = async () => {
  // Check if we're running on a device that should run edge AI
  const isEdgeDevice = process.env.EDGE_DEVICE === 'true' || 
                       typeof window === 'undefined' ||
                       window.location.hostname === 'localhost';
  
  if (!isEdgeDevice) {
    console.log('Not running on edge device, skipping Edge AI initialization');
    return;
  }
  
  try {
    console.log('Initializing Edge AI system...');
    
    // Set up telemetry subscription to process real-time data
    const channel = supabase
      .channel('telemetry_processing')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'telemetry_log'
      }, async (payload) => {
        try {
          const telemetry = payload.new;
          
          // Parse the message from the telemetry log
          let metrics;
          if (typeof telemetry.message === 'string') {
            metrics = JSON.parse(telemetry.message);
          } else {
            metrics = telemetry.message;
          }
          
          // Create input for the model
          const input: TelemetryInput = {
            timestamp: telemetry.timestamp || new Date().toISOString(),
            site_id: telemetry.device_id.split('-')[0] || 'unknown',
            power_consumption: metrics.power || 0,
            solar_production: metrics.solar_production || 0,
            battery_soc: metrics.state_of_charge || 0,
            grid_power: metrics.grid_power || 0,
            temperature: metrics.temperature || 0
          };
          
          // Process the telemetry
          await edgeAI.processTelemetry(input);
        } catch (error) {
          console.error('Error processing telemetry event:', error);
        }
      })
      .subscribe();
    
    console.log('Edge AI system initialized and listening for telemetry');
    
    // Schedule periodic sync with cloud
    setInterval(() => {
      edgeAI.syncWithCloud().catch(console.error);
    }, 15 * 60 * 1000); // Every 15 minutes
    
    return () => {
      channel.unsubscribe();
      edgeAI.shutdown();
    };
  } catch (error) {
    console.error('Error initializing Edge AI:', error);
  }
};
