
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Zap, Battery, LineChart, PlugZap, Check } from 'lucide-react';
import { AIRecommendation } from '@/types/energy';
import { useEnergyOptimization } from '@/hooks/useEnergyOptimization';
import { useAppStore } from '@/store/appStore';
import { Skeleton } from '@/components/ui/skeleton';

const RecommendationsCard = () => {
  const { currentSite } = useAppStore();
  const { 
    recommendations, 
    isLoadingRecommendations, 
    applyRecommendation, 
    isApplyingRecommendation 
  } = useEnergyOptimization(currentSite?.id || '');
  
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'medium':
        return 'text-amber-500 bg-amber-100 dark:bg-amber-900/20';
      default:
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
    }
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'battery_optimization':
        return <Battery className="h-5 w-5" />;
      case 'load_shifting':
        return <LineChart className="h-5 w-5" />;
      case 'ev_charging':
        return <PlugZap className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };
  
  return (
    <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Smart suggestions to optimize your energy system
            </CardDescription>
          </div>
          <Badge variant="secondary" className="flex gap-1 items-center">
            <Zap className="h-3 w-3" /> AI-powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingRecommendations ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center p-8 text-slate-500">
            <Lightbulb className="h-12 w-12 mx-auto mb-3 text-slate-400" />
            <p>No recommendations available right now.</p>
            <p className="text-sm mt-1">The AI will generate new suggestions as it analyzes your energy usage.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-full ${getPriorityStyle(rec.priority)}`}>
                    {getIconForType(rec.type)}
                  </div>
                  <h4 className="font-medium text-base">{rec.title}</h4>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {rec.description}
                </p>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {rec.potential_savings ? `Savings: ${rec.potential_savings}` : 'Improves efficiency'}
                    </span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                      {rec.confidence ? `${Math.round(rec.confidence * 100)}% confident` : 'Recommended'}
                    </span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => applyRecommendation(rec.id)}
                    disabled={isApplyingRecommendation}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-4 w-4" />
                    Apply
                  </Button>
                </div>
              </div>
            ))}
            
            {recommendations.length > 3 && (
              <Button variant="outline" className="w-full mt-2">
                Show all {recommendations.length} recommendations
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationsCard;
