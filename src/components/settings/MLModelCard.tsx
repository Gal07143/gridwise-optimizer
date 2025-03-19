
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Server, CheckCircle, History, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import usePredictions from '@/hooks/usePredictions';
import { getModelStatus, trainModel } from '@/services/predictions/energyPredictionService';

interface MLModelCardProps {
  isTraining?: boolean;
  onStartTraining?: () => void;
}

const MLModelCard = ({ 
  isTraining: externalIsTraining, 
  onStartTraining: externalOnStartTraining 
}: MLModelCardProps) => {
  const { modelVersion, refetch } = usePredictions('week');
  const [isTraining, setIsTraining] = useState(externalIsTraining || false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelStatus, setModelStatus] = useState({
    version: modelVersion || '1.0.0',
    lastTrained: new Date().toISOString(),
    accuracy: 0.85,
    status: 'active' as 'training' | 'active' | 'error'
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch the model status on mount and when training status changes
  useEffect(() => {
    const fetchModelStatus = async () => {
      try {
        setIsLoading(true);
        const status = await getModelStatus();
        setModelStatus(status);
        setIsTraining(status.status === 'training');
      } catch (error) {
        console.error("Error fetching model status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModelStatus();
  }, [modelVersion]);
  
  // Simulate training progress when in training mode
  useEffect(() => {
    if (!isTraining) return;
    
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          refetch();
          toast.success("Model training completed");
          return 0;
        }
        return prev + 5;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isTraining, refetch]);
  
  const handleRefreshModel = async () => {
    toast.info("Refreshing ML model status");
    setIsLoading(true);
    
    try {
      const status = await getModelStatus();
      setModelStatus(status);
      refetch();
      toast.success("ML model status refreshed");
    } catch (error) {
      console.error("Error refreshing model status:", error);
      toast.error("Failed to refresh model status");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartTraining = async () => {
    if (externalOnStartTraining) {
      externalOnStartTraining();
      return;
    }
    
    if (isTraining) return;
    
    try {
      setIsLoading(true);
      const success = await trainModel();
      
      if (success) {
        setIsTraining(true);
        setTrainingProgress(0);
        toast.success("Model training started");
      }
    } catch (error) {
      console.error("Error starting model training:", error);
      toast.error("Failed to start model training");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusIndicator = () => {
    switch (modelStatus.status) {
      case 'training':
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">Training</span>
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">Error</span>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
        );
      case 'active':
      default:
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">Active</span>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        );
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <span>Machine Learning Model</span>
          </div>
          
          <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
            Version {modelStatus.version || modelVersion || '1.0.0'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIndicator()}
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Updated</span>
              </div>
              <div className="text-sm">
                {new Date(modelStatus.lastTrained).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {isTraining && (
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Training Progress</span>
                <span className="text-sm">{trainingProgress}%</span>
              </div>
              <Progress value={trainingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Training on your energy usage data to improve predictions and recommendations
              </p>
            </div>
          )}
          
          <div className="mt-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Model Accuracy</span>
            </div>
            <div className="mt-1">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-muted-foreground">Confidence</span>
                <span className="text-xs font-medium">
                  {Math.round(modelStatus.accuracy * 100)}%
                </span>
              </div>
              <Progress 
                value={modelStatus.accuracy * 100} 
                className="h-1.5" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <Button 
              onClick={handleStartTraining} 
              className="flex-1"
              disabled={isTraining || isLoading}
            >
              {isTraining ? 'Training in Progress...' : 'Train Model'}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefreshModel}
              disabled={isTraining || isLoading}
              className={isLoading ? "animate-spin" : ""}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MLModelCard;
