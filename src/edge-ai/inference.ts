
import * as fs from 'fs';
import * as path from 'path';
import * as ort from 'onnxruntime-node';
import { v4 as uuidv4 } from 'uuid';
import { 
  MODEL_PATH,
  MODEL_META_PATH,
  TelemetryInput,
  PredictionOutput,
  ModelMetadata
} from './config';

/**
 * Class responsible for running inference using ONNX Runtime
 */
export class InferenceEngine {
  private session: ort.InferenceSession | null = null;
  private modelMetadata: ModelMetadata | null = null;
  
  constructor() {
    this.loadModel().catch(err => {
      console.error('Error initializing inference engine:', err);
    });
  }

  /**
   * Load the ONNX model into memory
   */
  public async loadModel(): Promise<void> {
    try {
      if (!fs.existsSync(MODEL_PATH)) {
        throw new Error(`Model file not found at ${MODEL_PATH}`);
      }

      // Load model metadata
      if (fs.existsSync(MODEL_META_PATH)) {
        const metaText = fs.readFileSync(MODEL_META_PATH, 'utf-8');
        this.modelMetadata = JSON.parse(metaText) as ModelMetadata;
      } else {
        console.warn('Model metadata file not found, proceeding without metadata');
      }

      // Create ONNX session
      const modelBuffer = fs.readFileSync(MODEL_PATH);
      this.session = await ort.InferenceSession.create(modelBuffer);
      
      console.log('ONNX model loaded successfully');
      
      // Log model information
      if (this.modelMetadata) {
        console.log(`Model version: ${this.modelMetadata.version}`);
        console.log(`Model created at: ${this.modelMetadata.created_at}`);
        console.log(`Input features: ${this.modelMetadata.features.join(', ')}`);
      }
    } catch (error) {
      console.error('Failed to load ONNX model:', error);
      this.session = null;
      throw error;
    }
  }

  /**
   * Check if the model is loaded and ready
   */
  public isModelLoaded(): boolean {
    return this.session !== null;
  }

  /**
   * Process telemetry data to prepare input tensor for the model
   */
  private preprocessInput(telemetry: TelemetryInput): ort.Tensor {
    try {
      // If we have metadata with features list, use it to order inputs
      if (this.modelMetadata?.features) {
        const features = this.modelMetadata.features;
        const inputData = features.map(feature => {
          return telemetry[feature] !== undefined ? telemetry[feature] : 0;
        });

        // Reshape the data according to the model's input shape
        // Assuming a batch size of 1
        const shape = this.modelMetadata.input_shape || [1, features.length];
        return new ort.Tensor('float32', new Float32Array(inputData), shape);
      } else {
        // Fallback if no metadata: create a flat array of values
        const inputValues = [
          telemetry.power_consumption || 0,
          telemetry.solar_production || 0,
          telemetry.battery_soc || 0,
          telemetry.grid_power || 0,
          telemetry.temperature || 0
          // Add any other telemetry values needed by your model
        ];
        
        // Default shape is [1, number_of_features]
        return new ort.Tensor('float32', new Float32Array(inputValues), [1, inputValues.length]);
      }
    } catch (error) {
      console.error('Error preprocessing input:', error);
      throw new Error(`Failed to preprocess input: ${error}`);
    }
  }

  /**
   * Run inference using current telemetry data
   */
  public async predict(telemetry: TelemetryInput): Promise<PredictionOutput> {
    try {
      if (!this.session) {
        await this.loadModel();
        if (!this.session) {
          throw new Error('Model could not be loaded');
        }
      }

      // Prepare input tensor
      const inputTensor = this.preprocessInput(telemetry);
      
      // Get input name from the model
      const inputName = this.session.inputNames[0];
      
      // Run inference
      const feeds: Record<string, ort.Tensor> = {};
      feeds[inputName] = inputTensor;
      
      console.log(`Running inference with input shape: [${inputTensor.dims.join(', ')}]`);
      const results = await this.session.run(feeds);
      
      // Process output
      const outputName = this.session.outputNames[0];
      const outputTensor = results[outputName];
      const outputData = outputTensor.data as Float32Array;
      
      // Convert output to prediction result
      return {
        timestamp: new Date().toISOString(),
        site_id: telemetry.site_id,
        prediction_id: uuidv4(),
        forecast_type: 'consumption', // Can be determined based on model or input
        values: Array.from(outputData),
        time_horizon: 24, // Set based on your model's output
        confidence: 0.9, // This would typically come from the model
        created_at: new Date().toISOString(),
        model_version: this.modelMetadata?.version || 'unknown',
        is_synced: false
      };
    } catch (error) {
      console.error('Error during inference:', error);
      throw new Error(`Inference failed: ${error}`);
    }
  }
}

// Export a singleton instance
export const inferenceEngine = new InferenceEngine();
