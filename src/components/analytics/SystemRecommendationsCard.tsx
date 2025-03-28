
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import NoRecommendations from './recommendations/NoRecommendations';
import RecommendationItem from './recommendations/RecommendationItem';
import RecommendationDialog from './recommendations/RecommendationDialog';
import { toast } from 'sonner';
import { SystemRecommendation, applyRecommendation } from '@/hooks/usePredictions';

interface SystemRecommendationsCardProps {
  recommendations: SystemRecommendation[];
  isLoading: boolean;
}

const SystemRecommendationsCard: React.FC<SystemRecommendationsCardProps> = ({ 
  recommendations, 
  isLoading 
}) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<SystemRecommendation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async (recommendationId: string) => {
    setIsApplying(true);
    try {
      await applyRecommendation(recommendationId);
      toast.success('Recommendation applied successfully');
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to apply recommendation');
      console.error('Error applying recommendation:', error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          System Recommendations
        </CardTitle>
        <CardDescription>
          AI-powered suggestions to improve your energy system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : recommendations.length === 0 ? (
          <NoRecommendations />
        ) : (
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((recommendation) => (
              <RecommendationItem 
                key={recommendation.id}
                recommendation={recommendation}
                onClick={() => {
                  setSelectedRecommendation(recommendation);
                  setIsDialogOpen(true);
                }}
              />
            ))}
            
            {recommendations.length > 3 && (
              <div className="pt-2">
                <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                  View all recommendations
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {selectedRecommendation && (
        <RecommendationDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          recommendation={selectedRecommendation}
          onApply={() => handleApply(selectedRecommendation.id)}
          isApplying={isApplying}
        />
      )}
    </Card>
  );
};

export default SystemRecommendationsCard;
