
// Re-export all the edge AI modules
import { EdgeAI } from './edge-ai';
import { InferenceEngine } from './inference';
import { ModelSyncAgent } from './model-sync';
import { FallbackManager } from './fallback';
import { TelemetryInput, ModelMetadata, PredictionResult } from './config';

// Create instances with default configurations
const inferenceEngine = new InferenceEngine();
const modelSyncAgent = new ModelSyncAgent(inferenceEngine);
const fallbackManager = new FallbackManager();
const edgeAI = new EdgeAI(inferenceEngine, modelSyncAgent, fallbackManager);

// Export instances
export { edgeAI, inferenceEngine, modelSyncAgent, fallbackManager };

// Export types properly
export type { TelemetryInput, ModelMetadata, PredictionResult };
