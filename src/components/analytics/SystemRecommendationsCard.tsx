
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, DollarSign, Wrench, LineChart, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { SystemRecommendation, applyRecommendation } from '@/services/predictions/energyPredictionService';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface SystemRecommendationsCardProps {
  recommendations: SystemRecommendation[];
  isLoading: boolean;
  onRefresh?: () => void;
}

const SystemRecommendationsCard = ({ 
  recommendations,
  isLoading,
  onRefresh 
}: SystemRecommendationsCardProps) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<SystemRecommendation | null>(null);
  const [implementationNotes, setImplementationNotes] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'behavioral':
        return <LineChart className="h-4 w-4" />;
      case 'system':
        return <Wrench className="h-4 w-4" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4" />;
      case 'optimization':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleApplyRecommendation = async () => {
    if (!selectedRecommendation) return;
    
    setIsApplying(true);
    
    try {
      const success = await applyRecommendation(
        selectedRecommendation.id,
        implementationNotes
      );
      
      if (success) {
        toast.success("Recommendation applied successfully", {
          description: "The system will adapt based on this feedback"
        });
        setDialogOpen(false);
        setImplementationNotes('');
        
        // Refresh recommendations if a refresh handler was provided
        if (onRefresh) {
          setTimeout(onRefresh, 500);
        }
      }
    } catch (error) {
      console.error("Error applying recommendation:", error);
      toast.error("Failed to apply recommendation");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              System Recommendations
            </CardTitle>
            <CardDescription>
              ML-powered suggestions to optimize your energy system
            </CardDescription>
          </div>
          {!isLoading && recommendations.length > 0 && (
            <Badge 
              variant="outline" 
              className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            >
              {recommendations.length} recommendations
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-2 opacity-50" />
            <p>Your system is already well optimized!</p>
            <p className="text-sm mt-1">We'll generate new recommendations as we gather more data.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {recommendations.map((recommendation, index) => (
              <AccordionItem key={recommendation.id} value={recommendation.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4 text-left">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(recommendation.type)}
                      <span>{recommendation.title}</span>
                    </div>
                    <Badge className={getPriorityColor(recommendation.priority)}>
                      {recommendation.priority} priority
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-3">
                    <p className="text-sm">{recommendation.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
                        <div className="flex items-center text-xs text-muted-foreground mb-1 gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>Potential Savings</span>
                        </div>
                        <div className="text-sm font-medium text-green-700 dark:text-green-400">
                          {recommendation.potentialSavings}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                        <div className="flex items-center text-xs text-muted-foreground mb-1 gap-1">
                          <Wrench className="h-3 w-3" />
                          <span>Implementation Cost</span>
                        </div>
                        <div className="text-sm font-medium">
                          {recommendation.implementationCost}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">Confidence</span>
                        <span className="text-xs font-medium">
                          {Math.round(recommendation.confidence * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={recommendation.confidence * 100} 
                        className="h-1.5" 
                      />
                    </div>
                    
                    <Dialog 
                      open={dialogOpen && selectedRecommendation?.id === recommendation.id} 
                      onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) setSelectedRecommendation(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => setSelectedRecommendation(recommendation)}
                        >
                          Apply Recommendation
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Apply Recommendation</DialogTitle>
                          <DialogDescription>
                            You're about to apply the recommendation: {recommendation.title}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="my-4">
                          <p className="text-sm mb-4">{recommendation.description}</p>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium">Implementation Notes</label>
                              <Textarea
                                placeholder="Add any notes about how you're implementing this recommendation..."
                                value={implementationNotes}
                                onChange={(e) => setImplementationNotes(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleApplyRecommendation}
                            disabled={isApplying}
                          >
                            {isApplying ? 'Applying...' : 'Apply Recommendation'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemRecommendationsCard;
