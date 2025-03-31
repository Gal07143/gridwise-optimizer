
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Activity, LineChart } from 'lucide-react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import RealtimeDispatchAdvice from '@/components/ai/RealtimeDispatchAdvice';
import AIBatteryHealthChart from '@/components/ai/AIBatteryHealthChart';
import AIROIChart from '@/components/ai/AIROIChart';
import AIAlertHistory from '@/components/ai/AIAlertHistory';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AIOverview = () => {
  const triggerTraining = async () => {
    toast.info("Training started");
  };

  return (
    <AppLayout>
      <Main title="AI Overview" description="AI-powered insights and controls for your energy system">
        <ErrorBoundary>
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-start">
            <Card className="w-full md:w-3/4">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Energy Advisory
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>The GridWise AI provides real-time energy optimization and predictive insights to maximize efficiency and reduce costs.</p>
              </CardContent>
            </Card>
            <Card className="w-full md:w-1/4">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Model Training
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={triggerTraining}
                  className="w-full"
                >
                  Trigger Training
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <RealtimeDispatchAdvice />
            <AIBatteryHealthChart />
            <AIROIChart />
            <AIAlertHistory />
            
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  System Performance Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Performance metrics visualization will be available soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ErrorBoundary>
      </Main>
    </AppLayout>
  );
};

export default AIOverview;
