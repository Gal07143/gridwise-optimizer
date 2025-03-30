
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, DatabaseBackup, Play, Archive, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TrainingStats {
  accuracy: number;
  loss: number;
  epochs: number;
  duration: string;
}

interface TrainingModelProps {
  onStart: () => void;
  onCancelTraining: () => void;
  isTraining: boolean;
  progress: number;
}

const TrainingModel: React.FC<TrainingModelProps> = ({ 
  onStart, 
  onCancelTraining, 
  isTraining, 
  progress 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">Energy Load Prediction Model</h3>
          <p className="text-sm text-muted-foreground">
            Train the model to improve energy load predictions
          </p>
        </div>
        {!isTraining ? (
          <Button 
            variant="outline" 
            className="flex items-center gap-1" 
            onClick={onStart}
          >
            <Play size={14} />
            Start Training
          </Button>
        ) : (
          <Button 
            variant="destructive" 
            className="flex items-center gap-1" 
            onClick={onCancelTraining}
          >
            Cancel
          </Button>
        )}
      </div>
      
      {isTraining && (
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Training in progress...</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Do not close this page. Training may take several minutes.
          </p>
        </div>
      )}
    </div>
  );
};

const ModelStats: React.FC<{ stats: TrainingStats | null }> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No training history available</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="text-sm font-medium">Accuracy</div>
        <div className="text-2xl font-bold mt-1">{stats.accuracy}%</div>
      </div>
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="text-sm font-medium">Loss</div>
        <div className="text-2xl font-bold mt-1">{stats.loss.toFixed(4)}</div>
      </div>
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="text-sm font-medium">Epochs</div>
        <div className="text-2xl font-bold mt-1">{stats.epochs}</div>
      </div>
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="text-sm font-medium">Duration</div>
        <div className="text-2xl font-bold mt-1">{stats.duration}</div>
      </div>
    </div>
  );
};

const TrainingHistory: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const downloadBackup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("AI model backup downloaded successfully");
    }, 2000);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">Training History</h3>
          <p className="text-sm text-muted-foreground">
            Previous model training sessions
          </p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-1" 
          onClick={downloadBackup}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <DatabaseBackup size={14} />
          )}
          Backup Model
        </Button>
      </div>
      
      <div className="border rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Accuracy</th>
              <th className="text-left p-2">Duration</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">2025-03-28</td>
              <td className="p-2">93.2%</td>
              <td className="p-2">12m 30s</td>
              <td className="p-2">
                <Button variant="ghost" size="sm">
                  <Archive size={14} />
                </Button>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-2">2025-03-25</td>
              <td className="p-2">91.8%</td>
              <td className="p-2">10m 15s</td>
              <td className="p-2">
                <Button variant="ghost" size="sm">
                  <Archive size={14} />
                </Button>
              </td>
            </tr>
            <tr>
              <td className="p-2">2025-03-20</td>
              <td className="p-2">90.5%</td>
              <td className="p-2">11m 45s</td>
              <td className="p-2">
                <Button variant="ghost" size="sm">
                  <Archive size={14} />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TrainingPanel: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trainingStats, setTrainingStats] = useState<TrainingStats | null>({
    accuracy: 93.2,
    loss: 0.0685,
    epochs: 50,
    duration: '12m 30s'
  });
  
  const startTraining = () => {
    setIsTraining(true);
    setProgress(0);
    toast.info("Model training started");
    
    // Simulate training progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast.success("Model training completed successfully!");
          setTrainingStats({
            accuracy: 94.5,
            loss: 0.0575,
            epochs: 50,
            duration: '13m 45s'
          });
          return 100;
        }
        return prev + 5;
      });
    }, 800);
  };
  
  const cancelTraining = () => {
    setIsTraining(false);
    setProgress(0);
    toast.error("Model training cancelled");
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          AI Model Training
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="training">
          <TabsList className="mb-4">
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="training">
            <TrainingModel 
              onStart={startTraining} 
              onCancelTraining={cancelTraining}
              isTraining={isTraining}
              progress={progress}
            />
          </TabsContent>
          
          <TabsContent value="stats">
            <ModelStats stats={trainingStats} />
          </TabsContent>
          
          <TabsContent value="history">
            <TrainingHistory />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrainingPanel;
