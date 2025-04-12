
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';
import { ArrowUpRightFromCircle, Battery, Home, Sun, ZapOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelfSufficiencyCardProps {
  className?: string;
}

const SelfSufficiencyCard: React.FC<SelfSufficiencyCardProps> = ({ className }) => {
  // Sample data - would be replaced with real data from an API
  const data = {
    selfSufficiency: 76, // percentage
    selfConsumption: 92, // percentage
    solarProduction: 13.8, // kWh
    homeConsumption: 18.2, // kWh
    batteryContribution: 3.5, // kWh
    gridImport: 4.4, // kWh
    curtailment: 1.2, // kWh
    curtailmentPercentage: 8.7, // percentage of total production
    timestamp: new Date().toISOString()
  };
  
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Self-Sufficiency & Curtailment</CardTitle>
            <CardDescription>Today's energy independence metrics</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
            Today
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/80 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg">
              <div className="mb-2">
                <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">Self-Sufficiency</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{data.selfSufficiency}%</span>
                <Sun className="h-5 w-5 text-amber-500" />
              </div>
              <Progress value={data.selfSufficiency} className="h-2 bg-amber-200 dark:bg-amber-800">
                <div className="h-full bg-amber-500" style={{ width: `${data.selfSufficiency}%` }} />
              </Progress>
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                {data.selfSufficiency}% of your energy needs are covered by your own production
              </p>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="mb-2">
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Self-Consumption</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{data.selfConsumption}%</span>
                <Home className="h-5 w-5 text-blue-500" />
              </div>
              <Progress value={data.selfConsumption} className="h-2 bg-blue-200 dark:bg-blue-800">
                <div className="h-full bg-blue-500" style={{ width: `${data.selfConsumption}%` }} />
              </Progress>
              <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                {data.selfConsumption}% of your produced energy is consumed on-site
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Energy Flow Breakdown</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2 border rounded-md flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                  <Sun className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Solar Production</p>
                  <p className="font-medium">{data.solarProduction} kWh</p>
                </div>
              </div>
              
              <div className="p-2 border rounded-md flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Home className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Consumption</p>
                  <p className="font-medium">{data.homeConsumption} kWh</p>
                </div>
              </div>
              
              <div className="p-2 border rounded-md flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <Battery className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Battery</p>
                  <p className="font-medium">{data.batteryContribution} kWh</p>
                </div>
              </div>
              
              <div className="p-2 border rounded-md flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <ArrowUpRightFromCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Grid Import</p>
                  <p className="font-medium">{data.gridImport} kWh</p>
                </div>
              </div>
              
              <div className="p-2 border rounded-md flex items-center gap-2 sm:col-span-2">
                <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30">
                  <ZapOff className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Curtailment</p>
                  <p className="font-medium">{data.curtailment} kWh ({data.curtailmentPercentage}%)</p>
                </div>
              </div>
            </div>
          </div>
          
          {data.curtailment > 0 && (
            <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-md">
              <h4 className="text-sm font-medium text-red-700 dark:text-red-300">Curtailment Detected</h4>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {data.curtailment} kWh ({data.curtailmentPercentage}%) of your solar production was curtailed today.
                Consider adding battery storage or shifting consumption to solar production hours to reduce curtailment.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SelfSufficiencyCard;
