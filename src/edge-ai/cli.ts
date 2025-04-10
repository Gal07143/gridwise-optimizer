#!/usr/bin/env node
import { Command } from 'commander';
import { edgeAI, modelSyncAgent, fallbackManager, inferenceEngine } from './index';
import { TelemetryInput } from './config';

// Create CLI program
const program = new Command();

program
  .name('edge-ai-cli')
  .description('CLI tool for Edge AI EMS system')
  .version('1.0.0');

// Command to test the inference loop
program
  .command('test-inference')
  .description('Test inference with sample telemetry data')
  .option('-s, --site-id <siteId>', 'Site ID for the prediction', 'site-123')
  .option('-c, --consumption <value>', 'Power consumption in kWh', '3.5')
  .option('-p, --production <value>', 'Solar production in kWh', '2.1')
  .option('-b, --battery <value>', 'Battery state of charge (0-100)', '75')
  .option('-g, --grid <value>', 'Grid power in kW', '1.2')
  .option('-t, --temperature <value>', 'Ambient temperature in °C', '22')
  .action(async (options) => {
    try {
      console.log('Running inference test with sample data...');
      
      // Prepare telemetry data
      const telemetry: TelemetryInput = {
        timestamp: new Date().toISOString(),
        site_id: options.siteId,
        power_consumption: parseFloat(options.consumption),
        solar_production: parseFloat(options.production),
        battery_soc: parseFloat(options.battery),
        grid_power: parseFloat(options.grid),
        temperature: parseFloat(options.temperature)
      };
      
      console.log('Input telemetry:', telemetry);
      
      // Run inference
      const startTime = performance.now();
      const prediction = await edgeAI.processTelemetry(telemetry);
      const duration = performance.now() - startTime;
      
      if (prediction) {
        console.log('\nPrediction result:');
        console.log('- ID:', prediction.prediction_id);
        console.log('- Type:', prediction.forecast_type);
        console.log('- Values:', prediction.values.slice(0, 5), prediction.values.length > 5 ? '...' : '');
        console.log('- Confidence:', prediction.confidence);
        console.log('- Model version:', prediction.model_version);
        console.log('- Synced:', prediction.is_synced);
        console.log(`\nInference completed in ${duration.toFixed(2)}ms`);
      } else {
        console.error('Inference failed, no prediction returned');
      }
      
    } catch (error) {
      console.error('Error running inference test:', error);
    }
  });

// Command to force model sync
program
  .command('sync-model')
  .description('Force sync of the ONNX model from cloud storage')
  .action(async () => {
    try {
      console.log('Forcing model sync...');
      const updated = await modelSyncAgent.syncModel();
      console.log(updated ? 'Model was updated' : 'Model is already up to date');
    } catch (error) {
      console.error('Error syncing model:', error);
    }
  });

// Command to sync predictions
program
  .command('sync-predictions')
  .description('Upload queued predictions to the cloud')
  .action(async () => {
    try {
      console.log('Syncing queued predictions...');
      const count = await fallbackManager.syncQueuedPredictions();
      console.log(`Synced ${count} predictions`);
    } catch (error) {
      console.error('Error syncing predictions:', error);
    }
  });

// Command to check system status
program
  .command('status')
  .description('Check the status of the Edge AI system')
  .action(async () => {
    try {
      const isOnline = await fallbackManager.checkIsOnline();
      const modelMeta = modelSyncAgent.getModelMetadata();
      const modelLoaded = inferenceEngine.isModelLoaded();
      
      console.log('Edge AI System Status:');
      console.log('---------------------');
      console.log('Network connectivity:', isOnline ? 'Online' : 'Offline');
      console.log('Model loaded:', modelLoaded ? 'Yes' : 'No');
      
      if (modelMeta) {
        console.log('Model version:', modelMeta.version);
        console.log('Model created:', modelMeta.created_at);
        console.log('Model features:', modelMeta.features.join(', '));
      } else {
        console.log('Model metadata: Not available');
      }
    } catch (error) {
      console.error('Error checking system status:', error);
    }
  });

// Parse command line arguments
program.parse(process.argv);

// If no arguments, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
