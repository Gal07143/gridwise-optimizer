
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Server, CheckCircle, History, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import usePredictions from '@/hooks/usePredictions';

interface MLModelCardProps {
  isTraining: boolean;
  onStartTraining: () => void;
}

const MLModelCard = ({ isTraining, onStartTraining }: MLModelCardProps) => {
  const { modelVersion, refetch } = usePredictions('week');
  
  const handleRefreshModel = () => {
    toast.info("Refreshing ML model status");
    setTimeout(() => {
      refetch();
      toast.success("ML model status refreshed");
    }, 1000);
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
            Version {modelVersion || '1.0.0'}
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
                <span className="text-sm">
                  {isTraining ? 'Training' : 'Active'}
                </span>
                {isTraining ? (
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Updated</span>
              </div>
              <div className="text-sm">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {isTraining && (
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Training Progress</span>
                <span className="text-sm">45%</span>
              </div>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Training on your energy usage data to improve predictions and recommendations
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-3 mt-4">
            <Button 
              onClick={onStartTraining} 
              className="flex-1"
              disabled={isTraining}
            >
              {isTraining ? 'Training in Progress...' : 'Train Model'}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefreshModel}
              disabled={isTraining}
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
