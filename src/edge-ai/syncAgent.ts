
import * as fs from 'fs';
import { supabase } from '@/integrations/supabase/client';
import { 
  SUPABASE_BUCKET, 
  MODEL_OBJECT_PATH, 
  MODEL_META_OBJECT_PATH,
  MODEL_PATH, 
  MODEL_META_PATH,
  SYNC_INTERVAL_MS,
  MAX_RETRY_COUNT,
  RETRY_DELAY_MS,
  ensureDirectories,
  ModelMetadata
} from './config';

/**
 * Class responsible for syncing the AI model from Supabase storage
 */
export class ModelSyncAgent {
  private syncInterval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private retryCount = 0;
  
  constructor() {
    ensureDirectories();
  }

  /**
   * Start the sync agent to periodically check for model updates
   */
  public start(): void {
    if (this.isRunning) {
      console.log('Sync agent is already running');
      return;
    }

    // Initial sync
    this.syncModel().catch(err => {
      console.error('Error during initial model sync:', err);
    });

    // Set up periodic sync
    this.syncInterval = setInterval(() => {
      this.syncModel().catch(err => {
        console.error('Error during periodic model sync:', err);
      });
    }, SYNC_INTERVAL_MS);
    
    this.isRunning = true;
    console.log(`Model sync agent started, checking every ${SYNC_INTERVAL_MS / 1000 / 60} minutes`);
  }

  /**
   * Stop the sync agent
   */
  public stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.isRunning = false;
    console.log('Model sync agent stopped');
  }

  /**
   * Check if there's a newer model version available and download it if needed
   */
  public async syncModel(): Promise<boolean> {
    try {
      console.log('Checking for model updates...');
      
      // Check if we need to update
      const needsUpdate = await this.checkForUpdates();
      
      if (needsUpdate) {
        console.log('New model version available, downloading...');
        await this.downloadModel();
        await this.downloadModelMetadata();
        this.retryCount = 0;
        return true;
      } else {
        console.log('Model is already up to date');
        this.retryCount = 0;
        return false;
      }
    } catch (error) {
      this.retryCount++;
      console.error(`Error syncing model (attempt ${this.retryCount}/${MAX_RETRY_COUNT}):`, error);
      
      if (this.retryCount < MAX_RETRY_COUNT) {
        console.log(`Will retry in ${RETRY_DELAY_MS / 1000} seconds...`);
        return new Promise(resolve => {
          setTimeout(() => {
            this.syncModel()
              .then(resolve)
              .catch(() => resolve(false));
          }, RETRY_DELAY_MS);
        });
      }
      
      this.retryCount = 0;
      return false;
    }
  }

  /**
   * Compare local and remote model metadata to determine if an update is needed
   */
  private async checkForUpdates(): Promise<boolean> {
    // If no local model exists, definitely need to download
    if (!fs.existsSync(MODEL_PATH) || !fs.existsSync(MODEL_META_PATH)) {
      return true;
    }

    try {
      // Get remote model metadata
      const { data: remoteMetaData, error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .download(MODEL_META_OBJECT_PATH);

      if (error) {
        throw new Error(`Error fetching remote model metadata: ${error.message}`);
      }

      // Parse remote metadata
      const remoteMetaText = await remoteMetaData.text();
      const remoteMeta = JSON.parse(remoteMetaText) as ModelMetadata;

      // Get local metadata
      const localMetaText = fs.readFileSync(MODEL_META_PATH, 'utf-8');
      const localMeta = JSON.parse(localMetaText) as ModelMetadata;

      // Compare versions
      return remoteMeta.version !== localMeta.version;
    } catch (error) {
      console.error('Error comparing model versions:', error);
      // If we can't compare, assume we need to update to be safe
      return true;
    }
  }

  /**
   * Download the model file from Supabase storage
   */
  private async downloadModel(): Promise<void> {
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .download(MODEL_OBJECT_PATH);

    if (error) {
      throw new Error(`Error downloading model: ${error.message}`);
    }

    const buffer = await data.arrayBuffer();
    fs.writeFileSync(MODEL_PATH, Buffer.from(buffer));
    console.log(`Model downloaded successfully to ${MODEL_PATH}`);
  }

  /**
   * Download the model metadata from Supabase storage
   */
  private async downloadModelMetadata(): Promise<void> {
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .download(MODEL_META_OBJECT_PATH);

    if (error) {
      throw new Error(`Error downloading model metadata: ${error.message}`);
    }

    const metaText = await data.text();
    fs.writeFileSync(MODEL_META_PATH, metaText);
    console.log(`Model metadata downloaded successfully to ${MODEL_META_PATH}`);
  }

  /**
   * Get the current model metadata
   */
  public getModelMetadata(): ModelMetadata | null {
    try {
      if (!fs.existsSync(MODEL_META_PATH)) {
        return null;
      }
      const metaText = fs.readFileSync(MODEL_META_PATH, 'utf-8');
      return JSON.parse(metaText) as ModelMetadata;
    } catch (error) {
      console.error('Error reading model metadata:', error);
      return null;
    }
  }
}

export const modelSyncAgent = new ModelSyncAgent();
