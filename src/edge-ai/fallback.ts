
import { PredictionResult } from './config';

// FallbackManager handles offline operation and syncing queued predictions
export class FallbackManager {
  private queuedPredictions: PredictionResult[] = [];
  private isOnline: boolean = true;
  
  constructor() {
    // Check online status initially and set up listener
    this.updateOnlineStatus();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.updateOnlineStatus());
      window.addEventListener('offline', () => this.updateOnlineStatus());
    }
  }
  
  // Update the online status
  private updateOnlineStatus(): void {
    if (typeof navigator !== 'undefined') {
      this.isOnline = navigator.onLine;
    }
  }
  
  // Check if system is currently online
  async checkIsOnline(): Promise<boolean> {
    // Additional connectivity check beyond navigator.onLine
    if (!this.isOnline) return false;
    
    try {
      // Try to fetch a small resource to verify connectivity
      const response = await fetch('/api/status', { 
        method: 'HEAD',
        // Short timeout to not block operations
        signal: AbortSignal.timeout(3000)
      });
      return response.ok;
    } catch (error) {
      console.warn('[FallbackManager] Connectivity check failed:', error);
      return false;
    }
  }
  
  // Queue a prediction for later sync
  queuePrediction(prediction: PredictionResult): void {
    this.queuedPredictions.push(prediction);
    console.log(`[FallbackManager] Prediction queued, total in queue: ${this.queuedPredictions.length}`);
  }
  
  // Sync all queued predictions
  async syncQueuedPredictions(): Promise<number> {
    if (this.queuedPredictions.length === 0) {
      console.log('[FallbackManager] No predictions in queue');
      return 0;
    }
    
    if (!(await this.checkIsOnline())) {
      console.log('[FallbackManager] Cannot sync: system offline');
      return 0;
    }
    
    let syncedCount = 0;
    const predictionsToSync = [...this.queuedPredictions];
    this.queuedPredictions = [];
    
    try {
      for (const prediction of predictionsToSync) {
        try {
          // Simulate API call to sync prediction
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // In a real implementation, send prediction to cloud:
          // await fetch('/api/predictions', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(prediction)
          // });
          
          syncedCount++;
        } catch (error) {
          console.error(`[FallbackManager] Failed to sync prediction ${prediction.prediction_id}:`, error);
          // Put failed prediction back in queue
          this.queuedPredictions.push(prediction);
        }
      }
      
      console.log(`[FallbackManager] Synced ${syncedCount}/${predictionsToSync.length} predictions`);
      return syncedCount;
    } catch (error) {
      console.error('[FallbackManager] Sync failed:', error);
      // Put all predictions back in queue on catastrophic failure
      this.queuedPredictions = [...this.queuedPredictions, ...predictionsToSync];
      return 0;
    }
  }
  
  // Get count of queued predictions
  getQueueLength(): number {
    return this.queuedPredictions.length;
  }
}
