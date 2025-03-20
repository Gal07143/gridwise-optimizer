
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock, Users, Activity, FileText } from 'lucide-react';

interface SecurityOverviewProps {
  overallScore: number;
  scoreColor: string;
  progressColor: (score: number) => string;
  securityScores: Array<{
    name: string;
    score: number;
    recommendation: string | null;
  }>;
}

const SecurityOverview = ({ 
  overallScore, 
  scoreColor, 
  progressColor, 
  securityScores 
}: SecurityOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 hover-card">
        <CardHeader>
          <CardTitle className="text-lg">Security Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className={`${scoreColor} stroke-current`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                    strokeDasharray={`${overallScore * 3.51}, 400`}
                  />
                </svg>
                <span className={`absolute text-2xl font-bold ${scoreColor}`}>
                  {overallScore}%
                </span>
              </div>
              <h3 className="text-lg font-medium mt-2">Overall Score</h3>
            </div>
            
            <div className="space-y-4">
              {securityScores
                .filter(item => item.recommendation)
                .slice(0, 3)
                .map(item => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className={`text-sm ${scoreColor}`}>{item.score}%</span>
                    </div>
                    <Progress value={item.score} className={progressColor(item.score)} />
                    <p className="text-xs text-muted-foreground">{item.recommendation}</p>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-card">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Lock className="mr-2 h-4 w-4" />
              Configure 2FA
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Manage User Access
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="mr-2 h-4 w-4" />
              View Audit Logs
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Security Policies
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityOverview;
