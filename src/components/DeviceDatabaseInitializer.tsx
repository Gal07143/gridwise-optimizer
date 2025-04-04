
import { useEffect, useState } from 'react';
import { shouldPopulateDeviceDatabase, importDeviceData } from '@/utils/deviceDataImporter';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';

export function DeviceDatabaseInitializer() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkAndInitializeDatabase = async () => {
      try {
        const needsPopulation = await shouldPopulateDeviceDatabase();
        
        if (needsPopulation) {
          setIsInitializing(true);
          
          // Simulate progress updates
          const progressInterval = setInterval(() => {
            setProgress(prev => {
              const newProgress = prev + Math.random() * 10;
              return newProgress > 95 ? 95 : newProgress;
            });
          }, 500);
          
          await importDeviceData();
          
          clearInterval(progressInterval);
          setProgress(100);
          
          // Close the dialog after a short delay
          setTimeout(() => {
            setIsInitializing(false);
          }, 1000);
        }
      } catch (error) {
        console.error('Error initializing device database:', error);
        setIsInitializing(false);
      }
    };
    
    checkAndInitializeDatabase();
  }, []);
  
  return (
    <Dialog open={isInitializing} onOpenChange={setIsInitializing}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Initializing Device Database</DialogTitle>
          <DialogDescription>
            Setting up device catalog data for the first time. This may take a moment...
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-center text-muted-foreground">{Math.round(progress)}% complete</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeviceDatabaseInitializer;
