
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, Activity, Battery, Sun, Wind, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useEnergyFlow } from '@/components/dashboard/energy-flow/EnergyFlowContext';
import { Button } from '@/components/ui/button';

interface HighTechEnergyFlowProps {
  siteId?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  hideHeader?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const HighTechEnergyFlow: React.FC<HighTechEnergyFlowProps> = ({
  siteId,
  title = 'Energy Flow',
  subtitle = 'Real-time energy distribution',
  className,
  hideHeader = false,
  variant = 'default'
}) => {
  const {
    totalGeneration,
    totalConsumption,
    batteryPercentage,
    selfConsumptionRate,
    isLoading,
    refreshData
  } = useEnergyFlow();

  const [animate, setAnimate] = useState(true);
  
  // Calculate grid power (difference between consumption and generation)
  const gridPower = Math.max(0, totalConsumption - totalGeneration);
  const exportedPower = Math.max(0, totalGeneration - totalConsumption);

  return (
    <Card className={cn("overflow-hidden", className)}>
      {!hideHeader && (
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                {title}
              </CardTitle>
              <CardDescription>{subtitle}</CardDescription>
            </div>
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
              Live
            </Badge>
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        <div className={cn(
          "relative h-64 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 rounded-lg",
          "border border-slate-200 dark:border-slate-800 overflow-hidden",
          variant === 'compact' ? 'h-48' : variant === 'detailed' ? 'h-80' : 'h-64'
        )}>
          {/* Background grid effect */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 1px, transparent 1px)", 
            backgroundSize: "30px 30px" 
          }}></div>
          
          {/* Energy sources and consumption */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
              "grid gap-8 w-full max-w-3xl px-4",
              variant === 'compact' ? 'grid-cols-2 gap-6' : 'grid-cols-3'
            )}>
              {/* Left column - Energy Sources */}
              <div className="flex flex-col items-center justify-center gap-8">
                {/* Solar */}
                <div className="relative">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "p-3 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/30",
                      "border border-amber-200 dark:border-amber-700/50 shadow-md"
                    )}>
                      <Sun className="h-8 w-8 text-amber-500" />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="font-medium text-sm">Solar</p>
                      <p className="font-semibold text-amber-600 dark:text-amber-400">{(totalGeneration * 0.8).toFixed(1)} kW</p>
                    </div>
                  </div>
                  
                  {/* Connection line to battery */}
                  {animate && (
                    <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2">
                      <svg width="100" height="2" className="overflow-visible">
                        <line x1="0" y1="1" x2="100" y2="1" stroke="#fde68a" strokeWidth="2" />
                        <circle className="animate-flow-right" r="4" fill="#f59e0b">
                          <animateMotion
                            dur="3s"
                            repeatCount="indefinite"
                            path="M 0 1 L 100 1"
                          />
                        </circle>
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Grid */}
                <div className="relative">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "p-3 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/30",
                      "border border-purple-200 dark:border-purple-700/50 shadow-md"
                    )}>
                      <svg className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14.5 5.5h5v5" />
                        <path d="M18 7L9.5 15.5" />
                        <path d="M4.5 13.5h5v5" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                    <div className="mt-2 text-center">
                      <p className="font-medium text-sm">Grid</p>
                      <p className="font-semibold text-purple-600 dark:text-purple-400">{gridPower.toFixed(1)} kW</p>
                    </div>
                  </div>
                  
                  {/* Connection line to home */}
                  {animate && gridPower > 0.1 && (
                    <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2">
                      <svg width="100" height="2" className="overflow-visible">
                        <line x1="0" y1="1" x2="100" y2="1" stroke="#d8b4fe" strokeWidth="2" />
                        <circle className="animate-flow-right" r="4" fill="#9333ea">
                          <animateMotion
                            dur="2s"
                            repeatCount="indefinite"
                            path="M 0 1 L 100 1"
                          />
                        </circle>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Center column - Battery/Storage */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "p-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/30",
                      "border border-blue-200 dark:border-blue-700/50 shadow-md"
                    )}>
                      <Battery className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="font-medium text-sm">Battery</p>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">{batteryPercentage}%</p>
                      
                      <div className="w-full mt-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full transition-all duration-1000" 
                          style={{ width: `${batteryPercentage}%` }}
                        ></div>
                      </div>
                      
                      <p className="text-xs mt-1 text-slate-500">
                        {batteryPercentage < 30 ? 'Charging' : batteryPercentage > 80 ? 'Discharging' : 'Balanced'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Connection line to home */}
                  {animate && batteryPercentage > 40 && (
                    <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2">
                      <svg width="100" height="2" className="overflow-visible">
                        <line x1="0" y1="1" x2="100" y2="1" stroke="#93c5fd" strokeWidth="2" />
                        <circle className="animate-flow-right" r="4" fill="#3b82f6">
                          <animateMotion
                            dur="4s"
                            repeatCount="indefinite"
                            path="M 0 1 L 100 1"
                          />
                        </circle>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right column - Consumption */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "p-3 rounded-full bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/30",
                    "border border-green-200 dark:border-green-700/50 shadow-md"
                  )}>
                    <Home className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="font-medium text-sm">Home</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">{totalConsumption.toFixed(1)} kW</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating digital indicators */}
          {variant === 'detailed' && (
            <div className="absolute inset-x-0 bottom-0 flex justify-around py-4 px-8 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800">
              <div className="text-center">
                <div className="text-xs text-slate-500">Generation</div>
                <div className="text-lg font-semibold">{totalGeneration.toFixed(1)} kW</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500">Self-Consumption</div>
                <div className="text-lg font-semibold">{selfConsumptionRate.toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500">Consumption</div>
                <div className="text-lg font-semibold">{totalConsumption.toFixed(1)} kW</div>
              </div>
            </div>
          )}
          
          {/* Animation toggle */}
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={() => setAnimate(prev => !prev)}
          >
            <Activity className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Stats summary */}
        {variant !== 'compact' && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Generation</p>
              <p className="font-semibold">{totalGeneration.toFixed(1)} kW</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Consumption</p>
              <p className="font-semibold">{totalConsumption.toFixed(1)} kW</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Battery</p>
              <p className="font-semibold">{batteryPercentage}%</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Self-Consumption</p>
              <p className="font-semibold">{selfConsumptionRate.toFixed(0)}%</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HighTechEnergyFlow;
