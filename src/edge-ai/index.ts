
import { modelSyncAgent } from './syncAgent';
import { inferenceEngine } from './inference';
import { fallbackManager } from './fallback';
import { TelemetryInput, PredictionOutput } from './config';

/**
 * Main Edge AI module
 */
export class EdgeAI {
  constructor() {
    // Initialize components
    this.initialize().catch(console.error);
  }

  /**
   * Initialize the Edge AI system
   */
  private async initialize(): Promise<void> {
    try {
      // Start model sync agent
      modelSyncAgent.start();
      
      // Wait for model to load
      if (!inferenceEngine.isModelLoaded()) {
        await inferenceEngine.loadModel();
      }
      
      console.log('Edge AI system initialized successfully');
    } catch (error) {
      console.error('Error initializing Edge AI:', error);
    }
  }

  /**
   * Process telemetry data and make predictions
   */
  public async processTelemetry(telemetry: TelemetryInput): Promise<PredictionOutput | null> {
    try {
      // Run inference
      const prediction = await inferenceEngine.predict(telemetry);
      
      // Save prediction (locally or to cloud depending on connectivity)
      await fallbackManager.savePrediction(prediction);
      
      return prediction;
    } catch (error) {
      console.error('Error processing telemetry:', error);
      return null;
    }
  }

  /**
   * Force sync with cloud
   */
  public async syncWithCloud(): Promise<void> {
    try {
      // Sync model if needed
      await modelSyncAgent.syncModel();
      
      // Send queued predictions
      await fallbackManager.syncQueuedPredictions();
    } catch (error) {
      console.error('Error syncing with cloud:', error);
    }
  }

  /**
   * Shutdown the Edge AI system
   */
  public shutdown(): void {
    modelSyncAgent.stop();
    console.log('Edge AI system shut down');
  }
}

// Export a singleton instance
export const edgeAI = new EdgeAI();

// Also export individual components for direct access
export {
  modelSyncAgent,
  inferenceEngine,
  fallbackManager,
  TelemetryInput,
  PredictionOutput
};
