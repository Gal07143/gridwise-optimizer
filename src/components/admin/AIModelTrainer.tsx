
// components/admin/AIModelTrainer.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { RefreshCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TrainingResult {
  score: number;
  precision?: number;
  recall?: number;
  message?: string;
}

const trainModel = async (): Promise<TrainingResult> => {
  try {
    const res = await axios.post('/api/train');
    return res.data;
  } catch (err) {
    console.error('Training failed:', err);
    throw new Error(err instanceof Error ? err.message : 'Unknown error');
  }
};

const AIModelTrainer = () => {
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: trainModel,
    onMutate: () => {
      // Start the fake progress indicator
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95; // Stop at 95% and wait for actual completion
          }
          return prev + (95 - prev) * 0.1; // Asymptotic approach to 95%
        });
      }, 500);

      // Store the interval so we can clear it later
      return { interval };
    },
    onSuccess: (data, _, context) => {
      // Clear the interval
      if (context?.interval) clearInterval(context.interval);
      
      // Set to 100% complete
      setProgress(100);
      
      // Show success toast
      toast({
        title: "Model Training Complete",
        description: `Model R² score: ${data.score.toFixed(4)}`,
        variant: "default",
      });
    },
    onError: (error, _, context) => {
      // Clear the interval
      if (context?.interval) clearInterval(context.interval);
      
      // Reset progress
      setProgress(0);
      
      // Show error toast
      toast({
        title: "Training Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <RefreshCcw className="h-5 w-5" />
          <span>AI Model Trainer</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mutation.isLoading && (
          <div className="space-y-2">
            <p className="text-sm">Training in progress...</p>
            <Progress value={progress} className="w-full" />
          </div>
        )}
        
        {mutation.isSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-100 dark:border-green-800/30">
            <div className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <div>
                <p className="font-medium">Training Successful</p>
                <p className="text-sm">
                  The model was trained successfully with the following metrics:
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">R² Score:</span>{' '}
                    <span className="font-medium">{mutation.data?.score.toFixed(4)}</span>
                  </div>
                  {mutation.data?.precision && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Precision:</span>{' '}
                      <span className="font-medium">{mutation.data.precision.toFixed(4)}</span>
                    </div>
                  )}
                  {mutation.data?.recall && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Recall:</span>{' '}
                      <span className="font-medium">{mutation.data.recall.toFixed(4)}</span>
                    </div>
                  )}
                  {mutation.data?.message && (
                    <div className="col-span-2 text-sm">
                      <span className="text-muted-foreground">Notes:</span>{' '}
                      <span>{mutation.data.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {mutation.isError && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-100 dark:border-red-800/30">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
              <div>
                <p className="font-medium">Training Failed</p>
                <p className="text-sm">
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : "An unknown error occurred during model training."}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => mutation.mutate()} 
          disabled={mutation.isLoading}
          className="w-full"
        >
          {mutation.isLoading ? (
            <>
              <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
              Training...
            </>
          ) : (
            'Train Model Now'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIModelTrainer;
