
import * as fs from 'fs';
import { supabase } from '@/integrations/supabase/client';
import { 
  QUEUE_PATH, 
  PredictionOutput, 
  AI_PREDICTIONS_TABLE,
  ensureDirectories
} from './config';
import { errorUtils } from '@/utils/errorUtils';

/**
 * Class responsible for managing offline operations and synchronization
 */
export class FallbackManager {
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  
  constructor() {
    ensureDirectories();
    this.checkConnection();
    
    // Periodically check connectivity and sync when back online
    setInterval(() => {
      this.checkConnection();
    }, 60000); // Check every minute
  }

  /**
   * Check if the system is online
   */
  private async checkConnection(): Promise<void> {
    try {
      const { error } = await supabase.from('health_check').select('count').single();
      const wasOffline = !this.isOnline;
      this.isOnline = !error;
      
      // If we were offline and now online, try to sync
      if (wasOffline && this.isOnline) {
        console.log('Connection restored, syncing queued predictions...');
        this.syncQueuedPredictions();
      }
    } catch (error) {
      this.isOnline = false;
      console.log('System appears to be offline');
    }
  }

  /**
   * Save a prediction result (either directly to Supabase or to local buffer)
   */
  public async savePrediction(prediction: PredictionOutput): Promise<boolean> {
    if (this.isOnline) {
      try {
        return await this.savePredictionToSupabase(prediction);
      } catch (error) {
        console.error('Error saving prediction to Supabase, falling back to local storage:', error);
        this.isOnline = false;
        return this.queuePrediction(prediction);
      }
    } else {
      return this.queuePrediction(prediction);
    }
  }

  /**
   * Save a prediction to the local queue file
   */
  private queuePrediction(prediction: PredictionOutput): boolean {
    try {
      // Make sure the prediction is marked as not synced
      prediction.is_synced = false;
      
      // Load existing queue
      const queue = this.loadQueue();
      
      // Add new prediction
      queue.push(prediction);
      
      // Save updated queue
      fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
      console.log(`Prediction queued locally (queue size: ${queue.length})`);
      return true;
    } catch (error) {
      console.error('Error queuing prediction:', error);
      return false;
    }
  }

  /**
   * Load the current prediction queue
   */
  private loadQueue(): PredictionOutput[] {
    try {
      if (fs.existsSync(QUEUE_PATH)) {
        const queueData = fs.readFileSync(QUEUE_PATH, 'utf-8');
        return JSON.parse(queueData) as PredictionOutput[];
      }
    } catch (error) {
      console.error('Error loading prediction queue:', error);
    }
    
    return [];
  }

  /**
   * Save a prediction directly to Supabase
   */
  private async savePredictionToSupabase(prediction: PredictionOutput): Promise<boolean> {
    try {
      prediction.is_synced = true;
      
      const { error } = await supabase
        .from(AI_PREDICTIONS_TABLE)
        .insert([prediction]);
      
      if (error) {
        throw error;
      }
      
      console.log(`Prediction saved to Supabase (ID: ${prediction.prediction_id})`);
      return true;
    } catch (error) {
      console.error('Error saving prediction to Supabase:', error);
      return false;
    }
  }

  /**
   * Sync all queued predictions to Supabase
   */
  public async syncQueuedPredictions(): Promise<number> {
    if (this.syncInProgress) {
      console.log('Sync already in progress, skipping');
      return 0;
    }
    
    this.syncInProgress = true;
    let syncedCount = 0;
    
    try {
      // Load queue
      const queue = this.loadQueue();
      
      if (queue.length === 0) {
        console.log('No predictions to sync');
        this.syncInProgress = false;
        return 0;
      }
      
      console.log(`Found ${queue.length} predictions to sync`);
      
      // Try to sync each prediction
      const remaining = [];
      
      for (const prediction of queue) {
        try {
          const success = await this.savePredictionToSupabase(prediction);
          
          if (success) {
            syncedCount++;
          } else {
            remaining.push(prediction);
          }
        } catch (error) {
          console.error(`Error syncing prediction ${prediction.prediction_id}:`, error);
          remaining.push(prediction);
        }
      }
      
      // Save remaining items back to queue
      fs.writeFileSync(QUEUE_PATH, JSON.stringify(remaining, null, 2));
      console.log(`Synced ${syncedCount} predictions, ${remaining.length} remaining`);
      
      return syncedCount;
    } catch (error) {
      console.error('Error during prediction sync:', error);
      return syncedCount;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Force check of connectivity status
   */
  public async checkIsOnline(): Promise<boolean> {
    await this.checkConnection();
    return this.isOnline;
  }
}

// Export a singleton instance
export const fallbackManager = new FallbackManager();
