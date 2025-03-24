
import React from 'react';
import { Battery, Home, Zap, Wind, Cable, Laptop } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EnergyGridProps {
  solarOutput: number;
  windOutput: number;
  batteryLevel: number;
  homeConsumption: number;
  evConsumption: number;
  deviceConsumption: number;
  gridConnection: 'import' | 'export' | 'disconnected';
}

const EnergyGrid: React.FC<EnergyGridProps> = ({
  solarOutput,
  windOutput,
  batteryLevel,
  homeConsumption,
  evConsumption,
  deviceConsumption,
  gridConnection
}) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50/80 to-slate-100/50 dark:from-slate-800/30 dark:to-slate-900/20 border-slate-200/50 dark:border-slate-700/50">
      <CardContent className="p-6">
        <div className="relative h-[300px]">
          {/* Top status indicators */}
          <div className="absolute top-0 left-0 right-0 flex justify-between px-4">
            <div className="flex items-center space-x-1 text-sm">
              <Zap className="h-4 w-4 text-energy-green" />
              <span className="font-semibold">{(solarOutput + windOutput).toFixed(1)} kW</span>
              <span className="text-muted-foreground">Generation</span>
            </div>
            
            <div className="flex items-center space-x-1 text-sm">
              <Home className="h-4 w-4 text-energy-red" />
              <span className="font-semibold">{(homeConsumption + evConsumption + deviceConsumption).toFixed(1)} kW</span>
              <span className="text-muted-foreground">Consumption</span>
            </div>
            
            <div className="flex items-center space-x-1 text-sm">
              <Battery className="h-4 w-4 text-energy-blue" />
              <span className="font-semibold">{batteryLevel}%</span>
              <span className="text-muted-foreground">Battery</span>
            </div>
          </div>

          {/* Energy sources nodes */}
          <div className="absolute left-4 top-16">
            <div className="p-3 bg-yellow-100/80 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/50 backdrop-blur-sm shadow-sm">
              <div className="flex flex-col items-center">
                <Zap className="h-8 w-8 text-yellow-500 mb-1" />
                <div className="text-sm font-medium">Solar</div>
                <div className="text-xl font-bold">{solarOutput} kW</div>
              </div>
            </div>
            
            <div className="p-3 mt-8 bg-blue-100/80 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50 backdrop-blur-sm shadow-sm">
              <div className="flex flex-col items-center">
                <Wind className="h-8 w-8 text-blue-500 mb-1" />
                <div className="text-sm font-medium">Wind</div>
                <div className="text-xl font-bold">{windOutput} kW</div>
              </div>
            </div>
          </div>

          {/* Battery storage node */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="p-3 bg-purple-100/80 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/50 backdrop-blur-sm shadow-sm">
              <div className="flex flex-col items-center">
                <Battery className="h-8 w-8 text-purple-500 mb-1" />
                <div className="text-sm font-medium">Battery</div>
                <div className="text-lg font-bold">{batteryLevel}%</div>
                
                <div className="w-full h-2 bg-purple-200/50 dark:bg-purple-800/30 rounded-full mt-2">
                  <div 
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${batteryLevel}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Consumption nodes */}
          <div className="absolute right-4 top-16">
            <div className="p-3 bg-green-100/80 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50 backdrop-blur-sm shadow-sm">
              <div className="flex flex-col items-center">
                <Home className="h-8 w-8 text-green-500 mb-1" />
                <div className="text-sm font-medium">Home</div>
                <div className="text-xl font-bold">{homeConsumption} kW</div>
              </div>
            </div>
            
            <div className="p-3 mt-4 bg-slate-100/80 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm shadow-sm">
              <div className="flex flex-col items-center">
                <Laptop className="h-8 w-8 text-slate-500 mb-1" />
                <div className="text-sm font-medium">Devices</div>
                <div className="text-xl font-bold">{deviceConsumption} kW</div>
              </div>
            </div>
          </div>

          {/* System status indicator */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>System Active</span>
              <span className="text-muted-foreground ml-1">
                • Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyGrid;
