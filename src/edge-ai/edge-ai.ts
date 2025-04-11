
import { InferenceEngine } from './inference';
import { ModelSyncAgent } from './model-sync';
import { FallbackManager } from './fallback';
import { TelemetryInput, PredictionResult } from './config';

// Main EdgeAI class that coordinates inference, model sync and fallback
export class EdgeAI {
  private inferenceEngine: InferenceEngine;
  private modelSyncAgent: ModelSyncAgent;
  private fallbackManager: FallbackManager;
  private isInitialized: boolean = false;
  
  constructor(
    inferenceEngine: InferenceEngine,
    modelSyncAgent: ModelSyncAgent,
    fallbackManager: FallbackManager
  ) {
    this.inferenceEngine = inferenceEngine;
    this.modelSyncAgent = modelSyncAgent;
    this.fallbackManager = fallbackManager;
  }
  
  // Initialize the EdgeAI system
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }
    
    try {
      console.log('[EdgeAI] Initializing Edge AI system');
      
      // Check if model is already loaded
      if (!this.inferenceEngine.isModelLoaded()) {
        // Load initial model
        const initialModelPath = '/models/energy_forecast_v1.0.0.onnx';
        const modelLoaded = await this.inferenceEngine.loadModel(initialModelPath);
        
        if (!modelLoaded) {
          console.error('[EdgeAI] Failed to load initial model');
          return false;
        }
      }
      
      // Check for model updates
      try {
        const isOnline = await this.fallbackManager.checkIsOnline();
        if (isOnline) {
          await this.modelSyncAgent.syncModel();
        }
      } catch (error) {
        console.warn('[EdgeAI] Could not check for model updates:', error);
        // Continue initialization even if update check fails
      }
      
      this.isInitialized = true;
      console.log('[EdgeAI] Initialization complete');
      return true;
    } catch (error) {
      console.error('[EdgeAI] Initialization failed:', error);
      return false;
    }
  }
  
  // Process telemetry data and return predictions
  async processTelemetry(telemetry: TelemetryInput): Promise<PredictionResult | null> {
    // Ensure system is initialized
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        console.error('[EdgeAI] Cannot process telemetry: System not initialized');
        return null;
      }
    }
    
    // Run inference
    const prediction = await this.inferenceEngine.runInference(telemetry);
    
    if (!prediction) {
      console.error('[EdgeAI] Inference failed');
      return null;
    }
    
    // Check if online to determine if we should sync or queue
    const isOnline = await this.fallbackManager.checkIsOnline();
    
    if (!isOnline) {
      // Queue prediction for later sync
      prediction.is_synced = false;
      this.fallbackManager.queuePrediction(prediction);
      console.log('[EdgeAI] System offline. Prediction queued for later sync');
    } else {
      // Mark as synced (in a real impl, would actually sync to cloud here)
      prediction.is_synced = true;
      console.log('[EdgeAI] Prediction processed and synced');
      
      // Try to sync any queued predictions while online
      if (this.fallbackManager.getQueueLength() > 0) {
        this.fallbackManager.syncQueuedPredictions();
      }
      
      // Periodically check for model updates (throttled)
      const lastMetadata = this.modelSyncAgent.getModelMetadata();
      const lastUpdated = new Date(lastMetadata?.created_at || 0);
      const daysSinceUpdate = (new Date().getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceUpdate > 1) {
        console.log('[EdgeAI] Checking for model updates');
        this.modelSyncAgent.syncModel();
      }
    }
    
    return prediction;
  }
}
