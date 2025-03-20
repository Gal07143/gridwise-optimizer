
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

interface ImprovementOpportunity {
  area: string;
  description: string;
  potential_gain: string;
  cost_estimate: string;
}

interface ImprovementOpportunitiesProps {
  opportunities: ImprovementOpportunity[];
}

const ImprovementOpportunities: React.FC<ImprovementOpportunitiesProps> = ({ opportunities }) => {
  if (!opportunities || opportunities.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Improvement Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {opportunities.map((opp, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{opp.area}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{opp.description}</p>
                </div>
                <Badge className="bg-green-500">{opp.potential_gain} gain</Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-amber-500" />
                  <span>Cost: {opp.cost_estimate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovementOpportunities;
