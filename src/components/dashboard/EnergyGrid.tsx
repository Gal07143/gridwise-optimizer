
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
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 dark:from-slate-950 dark:to-slate-900 border-slate-700/50 dark:border-slate-800/50 shadow-lg">
      <CardContent className="p-6">
        <div className="relative h-[300px]">
          {/* Top status indicators */}
          <div className="absolute top-0 left-0 right-0 flex justify-between px-4">
            <div className="flex items-center space-x-1 text-sm text-slate-300">
              <Zap className="h-4 w-4 text-green-400" />
              <span className="font-semibold text-white">{(solarOutput + windOutput).toFixed(1)} kW</span>
              <span className="text-slate-400">Generation</span>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-slate-300">
              <Home className="h-4 w-4 text-green-400" />
              <span className="font-semibold text-white">{(homeConsumption + evConsumption + deviceConsumption).toFixed(1)} kW</span>
              <span className="text-slate-400">Consumption</span>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-slate-300">
              <Battery className="h-4 w-4 text-purple-400" />
              <span className="font-semibold text-white">{batteryLevel}%</span>
              <span className="text-slate-400">Battery</span>
            </div>
          </div>

          {/* Energy sources nodes */}
          <div className="absolute left-4 top-16">
            <div className="p-3 bg-gradient-to-br from-yellow-900/50 to-yellow-950/80 rounded-lg border border-yellow-700/30 backdrop-blur-sm shadow-lg">
              <div className="flex flex-col items-center">
                <div className="mb-1 p-2 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-inner flex items-center justify-center">
                  <Zap className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="text-sm font-medium text-slate-200">Solar</div>
                <div className="text-xl font-bold text-white">{solarOutput} kW</div>
              </div>
            </div>
            
            <div className="p-3 mt-8 bg-gradient-to-br from-blue-900/50 to-blue-950/80 rounded-lg border border-blue-700/30 backdrop-blur-sm shadow-lg">
              <div className="flex flex-col items-center">
                <div className="mb-1 p-2 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-inner flex items-center justify-center">
                  <Wind className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-sm font-medium text-slate-200">Wind</div>
                <div className="text-xl font-bold text-white">{windOutput} kW</div>
              </div>
            </div>
          </div>

          {/* Battery storage node */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="p-3 bg-gradient-to-br from-purple-900/50 to-purple-950/80 rounded-lg border border-purple-700/30 backdrop-blur-sm shadow-lg">
              <div className="flex flex-col items-center">
                <div className="mb-1 p-2 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-inner flex items-center justify-center">
                  <Battery className="h-6 w-6 text-purple-400" />
                </div>
                <div className="text-sm font-medium text-slate-200">Battery</div>
                <div className="text-lg font-bold text-white">{batteryLevel}%</div>
                
                <div className="w-full h-2 bg-purple-950/50 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 transition-all duration-700 ease-in-out"
                    style={{ width: `${batteryLevel}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Consumption nodes */}
          <div className="absolute right-4 top-16">
            <div className="p-3 bg-gradient-to-br from-green-900/50 to-green-950/80 rounded-lg border border-green-700/30 backdrop-blur-sm shadow-lg">
              <div className="flex flex-col items-center">
                <div className="mb-1 p-2 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-inner flex items-center justify-center">
                  <Home className="h-6 w-6 text-green-400" />
                </div>
                <div className="text-sm font-medium text-slate-200">Home</div>
                <div className="text-xl font-bold text-white">{homeConsumption} kW</div>
              </div>
            </div>
            
            <div className="p-3 mt-4 bg-gradient-to-br from-slate-800/50 to-slate-900/80 rounded-lg border border-slate-700/30 backdrop-blur-sm shadow-lg">
              <div className="flex flex-col items-center">
                <div className="mb-1 p-2 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-inner flex items-center justify-center">
                  <Laptop className="h-6 w-6 text-slate-400" />
                </div>
                <div className="text-sm font-medium text-slate-200">Devices</div>
                <div className="text-xl font-bold text-white">{deviceConsumption} kW</div>
              </div>
            </div>
          </div>

          {/* System status indicator */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <div className="bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs shadow-sm border border-slate-700/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-slate-300">System Active</span>
              <span className="text-slate-500 ml-1">
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
