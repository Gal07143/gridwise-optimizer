
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, DollarSign, Wrench, LineChart, AlertTriangle } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { SystemRecommendation } from '@/services/predictions/energyPredictionService';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import RecommendationDialog from './RecommendationDialog';

interface RecommendationItemProps {
  recommendation: SystemRecommendation;
  onApply: (recommendation: SystemRecommendation, notes: string) => Promise<void>;
  isApplying: boolean;
}

const RecommendationItem = ({ 
  recommendation, 
  onApply,
  isApplying 
}: RecommendationItemProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [implementationNotes, setImplementationNotes] = useState('');

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
    await onApply(recommendation, implementationNotes);
    setDialogOpen(false);
    setImplementationNotes('');
  };

  return (
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
                {recommendation.potential_savings}
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
              <div className="flex items-center text-xs text-muted-foreground mb-1 gap-1">
                <Wrench className="h-3 w-3" />
                <span>Implementation Effort</span>
              </div>
              <div className="text-sm font-medium">
                {recommendation.implementation_effort}
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
            open={dialogOpen} 
            onOpenChange={setDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="mt-2 w-full"
              >
                Apply Recommendation
              </Button>
            </DialogTrigger>
            <RecommendationDialog
              recommendation={recommendation}
              notes={implementationNotes}
              onNotesChange={setImplementationNotes}
              onApply={handleApplyRecommendation}
              onCancel={() => setDialogOpen(false)}
              isApplying={isApplying}
            />
          </Dialog>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default RecommendationItem;
