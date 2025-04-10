
import * as fs from 'fs';
import * as path from 'path';
import { 
  QUEUE_PATH, 
  ensureDirectories, 
  PredictionOutput 
} from './config';
import { supabase } from '@/integrations/supabase/client';

/**
 * Class responsible for managing offline operation and queuing
 */
export class FallbackManager {
  private isInitialized = false;
  
  constructor() {
    this.initialize().catch(err => {
      console.error('Error initializing fallback manager:', err);
    });
  }

  /**
   * Initialize the fallback manager
   */
  private async initialize(): Promise<void> {
    try {
      // Ensure directories exist
      ensureDirectories();
      
      // Create queue file if it doesn't exist
      if (!fs.existsSync(QUEUE_PATH)) {
        fs.writeFileSync(QUEUE_PATH, JSON.stringify([]));
      }
      
      this.isInitialized = true;
      console.log('Fallback manager initialized');
    } catch (error) {
      console.error('Error initializing fallback manager:', error);
      throw error;
    }
  }
  
  /**
   * Check if we're currently online (have connectivity to Supabase)
   */
  public async checkIsOnline(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('system_status').select('status').limit(1);
      return !error && data != null;
    } catch (error) {
      console.log('Network connectivity check failed:', error);
      return false;
    }
  }
  
  /**
   * Save prediction to Supabase or local queue
   */
  public async savePrediction(prediction: PredictionOutput): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      const isOnline = await this.checkIsOnline();
      
      if (isOnline) {
        // Save directly to Supabase
        const { error } = await supabase
          .from('ai_predictions')
          .insert({
            id: prediction.prediction_id,
            site_id: prediction.site_id,
            prediction_type: prediction.forecast_type,
            values: prediction.values,
            timestamp: prediction.timestamp,
            confidence: prediction.confidence,
            model_version: prediction.model_version
          });
        
        if (error) {
          console.error('Error saving prediction to Supabase:', error);
          await this.queuePrediction(prediction);
          return false;
        }
        
        prediction.is_synced = true;
        return true;
      } else {
        // Queue locally
        await this.queuePrediction(prediction);
        return false;
      }
    } catch (error) {
      console.error('Error in savePrediction:', error);
      await this.queuePrediction(prediction);
      return false;
    }
  }
  
  /**
   * Queue prediction locally
   */
  private async queuePrediction(prediction: PredictionOutput): Promise<void> {
    try {
      // Read current queue
      let queue: PredictionOutput[] = [];
      if (fs.existsSync(QUEUE_PATH)) {
        const queueData = fs.readFileSync(QUEUE_PATH, 'utf-8');
        queue = JSON.parse(queueData) as PredictionOutput[];
      }
      
      // Add new prediction
      prediction.is_synced = false;
      queue.push(prediction);
      
      // Write updated queue
      fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
      
      console.log(`Prediction queued locally. Queue size: ${queue.length}`);
    } catch (error) {
      console.error('Error queuing prediction locally:', error);
    }
  }
  
  /**
   * Sync queued predictions to Supabase
   */
  public async syncQueuedPredictions(): Promise<number> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // Check if we're online
      const isOnline = await this.checkIsOnline();
      if (!isOnline) {
        console.log('Cannot sync predictions: Offline');
        return 0;
      }
      
      // Read current queue
      if (!fs.existsSync(QUEUE_PATH)) {
        console.log('No queued predictions to sync');
        return 0;
      }
      
      const queueData = fs.readFileSync(QUEUE_PATH, 'utf-8');
      const queue: PredictionOutput[] = JSON.parse(queueData) as PredictionOutput[];
      
      if (queue.length === 0) {
        console.log('No queued predictions to sync');
        return 0;
      }
      
      console.log(`Syncing ${queue.length} queued predictions...`);
      
      // Process in batches to avoid timeouts
      const batchSize = 10;
      let syncCount = 0;
      let remainingQueue: PredictionOutput[] = [];
      
      for (let i = 0; i < queue.length; i += batchSize) {
        const batch = queue.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('ai_predictions')
          .insert(batch.map(prediction => ({
            id: prediction.prediction_id,
            site_id: prediction.site_id,
            prediction_type: prediction.forecast_type,
            values: prediction.values,
            timestamp: prediction.timestamp,
            confidence: prediction.confidence,
            model_version: prediction.model_version
          })));
        
        if (error) {
          console.error('Error syncing predictions batch:', error);
          remainingQueue = remainingQueue.concat(batch);
        } else {
          syncCount += batch.length;
        }
      }
      
      // Update queue with remaining items
      fs.writeFileSync(QUEUE_PATH, JSON.stringify(remainingQueue, null, 2));
      
      console.log(`Synced ${syncCount} predictions. Remaining: ${remainingQueue.length}`);
      return syncCount;
    } catch (error) {
      console.error('Error syncing queued predictions:', error);
      return 0;
    }
  }
}

// Export a singleton instance
export const fallbackManager = new FallbackManager();
