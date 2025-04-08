
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Zap, ArrowRight, BatteryFull, PanelTop, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const RealtimeDispatchAdvice = () => {
  return (
    <Card className="xl:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-purple-500" />
          AI Energy Dispatch Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="p-4 bg-violet-50 dark:bg-violet-900/10 rounded-md border border-violet-100 dark:border-violet-800/20">
            <h3 className="text-sm font-medium mb-1 text-violet-800 dark:text-violet-300">Current Advisory</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Prioritize battery charging now while solar production is high. Recommended to store energy for peak evening rates (17:00-21:00).
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md">
              <div className="flex items-center mb-2">
                <Activity className="h-4 w-4 text-blue-500 mr-2" />
                <h4 className="text-sm font-medium">Current Generation</h4>
              </div>
              <div className="text-xl font-bold">4.2 kW</div>
              <div className="text-xs text-muted-foreground mt-1">Solar: 4.2 kW, Grid: 0 kW</div>
            </div>
            
            <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md">
              <div className="flex items-center mb-2">
                <Zap className="h-4 w-4 text-green-500 mr-2" />
                <h4 className="text-sm font-medium">Current Load</h4>
              </div>
              <div className="text-xl font-bold">1.8 kW</div>
              <div className="text-xs text-muted-foreground mt-1">Excess available: 2.4 kW</div>
            </div>
            
            <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-md">
              <div className="flex items-center mb-2">
                <BatteryFull className="h-4 w-4 text-amber-500 mr-2" />
                <h4 className="text-sm font-medium">Battery Status</h4>
              </div>
              <div className="text-xl font-bold">62%</div>
              <div className="text-xs text-muted-foreground mt-1">Charging at 2.4 kW</div>
            </div>
          </div>
          
          <div className="border p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Optimal Energy Flow</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Solar → Battery</span>
                  <span className="font-medium">2.4 kW</span>
                </div>
                <Progress value={57} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Solar → Home</span>
                  <span className="font-medium">1.8 kW</span>
                </div>
                <Progress value={43} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Battery → Grid</span>
                  <span className="font-medium">0 kW</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            AI recommendation based on current solar production, load patterns, and predicted evening demand. Updated 2 minutes ago.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeDispatchAdvice;
