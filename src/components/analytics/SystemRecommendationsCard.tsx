
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';
import { 
  Accordion
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { SystemRecommendation, applyRecommendation } from '@/services/predictions/energyPredictionService';
import { toast } from 'sonner';
import NoRecommendations from './recommendations/NoRecommendations';
import RecommendationItem from './recommendations/RecommendationItem';

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
  const [isApplying, setIsApplying] = useState(false);
  
  const handleApplyRecommendation = async (recommendation: SystemRecommendation, notes: string) => {
    setIsApplying(true);
    
    try {
      const success = await applyRecommendation(
        recommendation.id,
        notes
      );
      
      if (success) {
        toast.success("Recommendation applied successfully", {
          description: "The system will adapt based on this feedback"
        });
        
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      );
    }
    
    if (recommendations.length === 0) {
      return <NoRecommendations />;
    }
    
    return (
      <Accordion type="single" collapsible className="w-full">
        {recommendations.map((recommendation) => (
          <RecommendationItem 
            key={recommendation.id}
            recommendation={recommendation}
            onApply={handleApplyRecommendation}
            isApplying={isApplying}
          />
        ))}
      </Accordion>
    );
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
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default SystemRecommendationsCard;
