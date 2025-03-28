
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { toast } from 'sonner';
import { getModelStatus, trainModel } from '@/services/predictions/energyPredictionService';
import usePredictions from '@/hooks/usePredictions';

const MLModelCard = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [lastTrainedDate, setLastTrainedDate] = useState<string | null>(null);
  const [modelVersion, setModelVersion] = useState<string | null>(null);
  const [modelAccuracy, setModelAccuracy] = useState<number | null>(null);
  
  // The model version will be tracked separately since it doesn't exist in the hook
  const { refreshData } = usePredictions();
  
  const refreshModelStatus = async () => {
    try {
      const status = await getModelStatus();
      setLastTrainedDate(status.lastTrained);
      setModelVersion(status.version);
      setModelAccuracy(status.accuracy);
    } catch (err) {
      console.error("Error fetching model status:", err);
      toast.error("Failed to fetch model status");
    }
  };
  
  // Initial fetch of model status
  React.useEffect(() => {
    refreshModelStatus();
  }, []);
  
  const handleTrainModel = async () => {
    setIsTraining(true);
    
    try {
      const result = await trainModel();
      
      if (result.success) {
        toast.success("Model training initiated", {
          description: "The AI model will be updated with the latest data."
        });
        
        // Refresh status after a delay to simulate training
        setTimeout(() => {
          refreshModelStatus();
          refreshData();
        }, 3000);
      } else {
        toast.error("Failed to initiate model training");
      }
    } catch (err) {
      console.error("Error training model:", err);
      toast.error("An error occurred while training the model");
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          AI Energy Prediction Model
        </CardTitle>
        <CardDescription>
          Energy prediction model status and training
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Model Version</p>
              <p className="text-sm">{modelVersion || "Not available"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Last Trained</p>
              <p className="text-sm">
                {lastTrainedDate 
                  ? formatDistance(new Date(lastTrainedDate), new Date(), { addSuffix: true })
                  : "Never"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Accuracy</p>
              <p className="text-sm">
                {modelAccuracy !== null 
                  ? `${(modelAccuracy * 100).toFixed(1)}%`
                  : "Not available"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                <p className="text-sm">Active</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={refreshModelStatus}
        >
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Refresh Status
        </Button>
        <Button 
          size="sm"
          onClick={handleTrainModel}
          disabled={isTraining}
        >
          {isTraining ? (
            <>
              <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
              Training...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-3.5 w-3.5" />
              Train Model
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MLModelCard;
