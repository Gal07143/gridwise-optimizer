
import * as fs from 'fs';
import * as path from 'path';
import { 
  MODELS_DIR,
  MODEL_PATH, 
  MODEL_META_PATH,
  SUPABASE_BUCKET,
  MODEL_OBJECT_PATH,
  MODEL_META_OBJECT_PATH,
  SYNC_INTERVAL_MS,
  MAX_RETRY_COUNT,
  RETRY_DELAY_MS,
  ensureDirectories,
  ModelMetadata
} from './config';
import { supabase } from '@/integrations/supabase/client';

/**
 * Class responsible for syncing models from Supabase Storage
 */
export class ModelSyncAgent {
  private syncInterval: NodeJS.Timeout | null = null;
  private modelMetadata: ModelMetadata | null = null;
  private isRunning = false;
  
  constructor() {
    ensureDirectories();
    this.loadModelMetadata();
  }
  
  /**
   * Load model metadata from file
   */
  private loadModelMetadata(): void {
    try {
      if (fs.existsSync(MODEL_META_PATH)) {
        const data = fs.readFileSync(MODEL_META_PATH, 'utf-8');
        this.modelMetadata = JSON.parse(data) as ModelMetadata;
        console.log(`Loaded model metadata: v${this.modelMetadata.version}`);
      } else {
        console.log('No model metadata file found');
      }
    } catch (error) {
      console.error('Error loading model metadata:', error);
    }
  }
  
  /**
   * Start the sync agent
   */
  public start(): void {
    if (this.syncInterval) {
      return; // Already running
    }
    
    this.isRunning = true;
    
    // Initial sync
    this.syncModel().catch(err => {
      console.error('Error during initial model sync:', err);
    });
    
    // Set up recurring sync
    this.syncInterval = setInterval(() => {
      if (this.isRunning) {
        this.syncModel().catch(err => {
          console.error('Error during model sync:', err);
        });
      }
    }, SYNC_INTERVAL_MS);
    
    console.log(`Model sync agent started, interval: ${SYNC_INTERVAL_MS/1000}s`);
  }
  
  /**
   * Stop the sync agent
   */
  public stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      this.isRunning = false;
      console.log('Model sync agent stopped');
    }
  }
  
  /**
   * Get current model metadata
   */
  public getModelMetadata(): ModelMetadata | null {
    return this.modelMetadata;
  }
  
  /**
   * Sync model from Supabase Storage
   * Returns true if model was updated, false if already up to date
   */
  public async syncModel(retryCount = 0): Promise<boolean> {
    try {
      console.log('Checking for model updates...');
      
      // Get model metadata from Supabase
      const { data: remoteMetaData, error: metaError } = await supabase
        .storage
        .from(SUPABASE_BUCKET)
        .download(MODEL_META_OBJECT_PATH);
      
      if (metaError) {
        throw metaError;
      }
      
      // Parse metadata
      const remoteMetaText = await remoteMetaData.text();
      const remoteMeta = JSON.parse(remoteMetaText) as ModelMetadata;
      
      // Check if we need to update
      const needsUpdate = !this.modelMetadata || 
                          this.modelMetadata.version !== remoteMeta.version;
      
      if (!needsUpdate) {
        console.log(`Model is up to date (v${this.modelMetadata?.version})`);
        return false;
      }
      
      console.log(`New model version available: v${remoteMeta.version}`);
      
      // Download new model
      const { data: modelData, error: modelError } = await supabase
        .storage
        .from(SUPABASE_BUCKET)
        .download(MODEL_OBJECT_PATH);
      
      if (modelError) {
        throw modelError;
      }
      
      // Ensure directories exist
      ensureDirectories();
      
      // Save model
      const modelBuffer = await modelData.arrayBuffer();
      fs.writeFileSync(MODEL_PATH, new Uint8Array(modelBuffer));
      
      // Save metadata
      fs.writeFileSync(MODEL_META_PATH, remoteMetaText);
      this.modelMetadata = remoteMeta;
      
      console.log(`Model updated to v${remoteMeta.version}`);
      return true;
    } catch (error) {
      console.error('Error syncing model:', error);
      
      // Retry logic
      if (retryCount < MAX_RETRY_COUNT) {
        console.log(`Retrying in ${RETRY_DELAY_MS/1000}s (${retryCount + 1}/${MAX_RETRY_COUNT})...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        return this.syncModel(retryCount + 1);
      }
      
      throw error;
    }
  }
}

// Export a singleton instance
export const modelSyncAgent = new ModelSyncAgent();
