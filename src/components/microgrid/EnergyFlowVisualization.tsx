
import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Wind, 
  Battery, 
  Home, 
  Cable,
  Zap,
  RefreshCw,
  ArrowUpDown,
  Info,
  PlugZap
} from 'lucide-react';
import { MicrogridState } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';

interface EnergyFlowVisualizationProps {
  microgridState: MicrogridState;
  onRefresh?: () => void;
}

interface EnergyNodeProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  status?: 'active' | 'inactive' | 'warning' | 'error';
  bgColor: string;
  textColor: string;
  onClick?: () => void;
  isSelected?: boolean;
  detail?: string;
}

const EnergyNode: React.FC<EnergyNodeProps> = ({
  icon,
  label,
  value,
  unit,
  status = 'active',
  bgColor,
  textColor,
  onClick,
  isSelected,
  detail
}) => {
  return (
    <div 
      className={cn(
        "p-4 rounded-xl backdrop-blur-sm transition-all duration-300",
        bgColor,
        isSelected ? "ring-2 ring-white/40 shadow-lg transform scale-105" : "",
        onClick ? "cursor-pointer hover:scale-105" : ""
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-2">
        <div className="mb-2 p-3 rounded-full bg-black/30 flex items-center justify-center">
          {React.cloneElement(icon as React.ReactElement, { 
            className: `h-8 w-8 ${textColor}`
          })}
        </div>
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xl font-bold text-white">
          {value.toFixed(1)} {unit}
        </div>
        {detail && (
          <div className="text-xs text-white/70">{detail}</div>
        )}
        {status !== 'active' && (
          <Badge variant={status === 'warning' ? "outline" : "destructive"} className="mt-1">
            {status === 'warning' ? 'Warning' : status === 'error' ? 'Error' : 'Inactive'}
          </Badge>
        )}
      </div>
    </div>
  );
};

interface FlowConnectionProps {
  from: string;
  to: string;
  value: number;
  active: boolean;
  color: string;
}

const FlowConnection: React.FC<FlowConnectionProps> = ({
  from,
  to,
  value,
  active,
  color
}) => {
  const getPathCoordinates = () => {
    // Define connection paths based on predefined positions
    switch (`${from}-${to}`) {
      case 'solar-battery':
        return "M110,80 C160,80 160,160 210,160";
      case 'solar-building':
        return "M110,80 C160,80 290,80 390,120";
      case 'wind-battery':
        return "M110,180 C160,180 160,160 210,160";
      case 'wind-building':
        return "M110,180 C160,180 290,140 390,140";
      case 'battery-building':
        return "M290,160 C330,160 350,140 390,140";
      case 'grid-battery':
        return "M110,280 C160,280 160,200 210,180";
      case 'grid-building':
        return "M110,280 C160,280 290,180 390,160";
      default:
        return "";
    }
  };

  const path = getPathCoordinates();
  if (!path || !active) return null;

  // Calculate stroke width based on energy value
  const strokeWidth = Math.max(2, Math.min(8, 2 + (value * 0.5)));

  return (
    <g className="energy-flow-connection">
      {/* Base path */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={0.6}
      />
      
      {/* Animated flow */}
      <path
        d={path}
        fill="none"
        stroke="white"
        strokeWidth={strokeWidth * 0.6}
        strokeDasharray="5,15"
        opacity={0.7}
        className="animate-flow"
      />
      
      {/* Value label */}
      {value > 0.1 && (
        <>
          <path
            id={`path-${from}-${to}`}
            d={path}
            fill="none"
            stroke="none"
          />
          <text className="text-[10px] fill-white font-medium drop-shadow-md">
            <textPath
              href={`#path-${from}-${to}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {value.toFixed(1)} kW
            </textPath>
          </text>
        </>
      )}
    </g>
  );
};

const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = ({ 
  microgridState,
  onRefresh 
}) => {
  const [animatedValues, setAnimatedValues] = useState({
    solarProduction: 0,
    windProduction: 0,
    batteryLevel: 0,
    buildingConsumption: 0,
    gridExchange: 0
  });
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Animate values for smooth transitions
  useEffect(() => {
    const targetValues = {
      solarProduction: microgridState.solarProduction,
      windProduction: microgridState.windProduction,
      batteryLevel: microgridState.batteryLevel,
      buildingConsumption: 8.5, // Example fixed value
      gridExchange: microgridState.gridConnected ? 2.0 : 0
    };
    
    const animationFrame = setInterval(() => {
      setAnimatedValues(prev => {
        const newValues = {...prev};
        let allReached = true;
        
        Object.keys(targetValues).forEach(key => {
          const target = targetValues[key as keyof typeof targetValues];
          const current = prev[key as keyof typeof animatedValues];
          const delta = (target - current) * 0.1;
          
          if (Math.abs(delta) > 0.01) {
            newValues[key as keyof typeof animatedValues] = current + delta;
            allReached = false;
          } else {
            newValues[key as keyof typeof animatedValues] = target;
          }
        });
        
        if (allReached) {
          clearInterval(animationFrame);
        }
        
        return newValues;
      });
    }, 50);
    
    return () => clearInterval(animationFrame);
  }, [microgridState]);
  
  // Calculate energy flows
  const totalProduction = animatedValues.solarProduction + animatedValues.windProduction;
  const solarToBattery = animatedValues.solarProduction * 0.3;
  const solarToBuilding = animatedValues.solarProduction * 0.7;
  const windToBattery = animatedValues.windProduction * 0.4;
  const windToBuilding = animatedValues.windProduction * 0.6;
  const batteryToBuilding = microgridState.batteryDischargeEnabled ? 2.5 : 0;
  const gridToBattery = microgridState.gridConnected && microgridState.batteryLevel < 50 ? 1.5 : 0;
  const gridToBuilding = microgridState.gridConnected ? animatedValues.gridExchange : 0;
  
  const handleRefresh = () => {
    setLastUpdated(new Date());
    onRefresh?.();
  };
  
  const energyBalance = totalProduction - animatedValues.buildingConsumption;
  const isEnergyPositive = energyBalance >= 0;
  
  return (
    <Card className="shadow-lg bg-slate-50 dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Zap className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-500" />
              Energy Flow Visualization
            </CardTitle>
            <CardDescription>
              Real-time energy distribution across your microgrid
            </CardDescription>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="relative h-[380px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-700/50 p-4">
          {/* Status indicators */}
          <div className="absolute top-4 left-0 right-0 flex justify-center z-30">
            <div className={cn(
              "px-4 py-2 rounded-full backdrop-blur-lg border shadow-md",
              isEnergyPositive 
                ? "bg-green-950/50 border-green-700/30 text-green-400" 
                : "bg-amber-950/50 border-amber-700/30 text-amber-400"
            )}>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {isEnergyPositive 
                    ? `Energy Surplus: ${energyBalance.toFixed(1)} kW` 
                    : `Energy Deficit: ${Math.abs(energyBalance).toFixed(1)} kW`}
                </span>
              </div>
            </div>
          </div>
          
          {/* SVG for energy connections */}
          <svg className="absolute inset-0 w-full h-full z-10">
            {/* Energy Flow Connections */}
            <FlowConnection 
              from="solar" 
              to="battery" 
              value={solarToBattery} 
              active={animatedValues.solarProduction > 0} 
              color="rgba(234, 179, 8, 0.8)" 
            />
            <FlowConnection 
              from="solar" 
              to="building" 
              value={solarToBuilding} 
              active={animatedValues.solarProduction > 0} 
              color="rgba(234, 179, 8, 0.8)" 
            />
            <FlowConnection 
              from="wind" 
              to="battery" 
              value={windToBattery} 
              active={animatedValues.windProduction > 0} 
              color="rgba(59, 130, 246, 0.8)" 
            />
            <FlowConnection 
              from="wind" 
              to="building" 
              value={windToBuilding} 
              active={animatedValues.windProduction > 0} 
              color="rgba(59, 130, 246, 0.8)" 
            />
            <FlowConnection 
              from="battery" 
              to="building" 
              value={batteryToBuilding} 
              active={microgridState.batteryDischargeEnabled} 
              color="rgba(168, 85, 247, 0.8)" 
            />
            <FlowConnection 
              from="grid" 
              to="battery" 
              value={gridToBattery} 
              active={microgridState.gridConnected && microgridState.batteryLevel < 50} 
              color="rgba(220, 38, 38, 0.8)" 
            />
            <FlowConnection 
              from="grid" 
              to="building" 
              value={gridToBuilding} 
              active={microgridState.gridConnected} 
              color="rgba(220, 38, 38, 0.8)" 
            />
          </svg>
          
          {/* Energy Nodes */}
          {/* Left side - Sources */}
          <div className="absolute left-6 top-20 space-y-24 z-20">
            <EnergyNode 
              icon={<Sun />}
              label="Solar Panels"
              value={animatedValues.solarProduction}
              unit="kW"
              bgColor="bg-gradient-to-br from-yellow-800/80 via-yellow-900/80 to-black/80 border border-yellow-700/30"
              textColor="text-yellow-400"
              onClick={() => setSelectedNode(selectedNode === 'solar' ? null : 'solar')}
              isSelected={selectedNode === 'solar'}
              detail={`Efficiency: ${(microgridState.solarEfficiency * 100).toFixed(0)}%`}
            />
            
            <EnergyNode 
              icon={<Wind />}
              label="Wind Turbine"
              value={animatedValues.windProduction}
              unit="kW"
              bgColor="bg-gradient-to-br from-blue-800/80 via-blue-900/80 to-black/80 border border-blue-700/30"
              textColor="text-blue-400"
              onClick={() => setSelectedNode(selectedNode === 'wind' ? null : 'wind')}
              isSelected={selectedNode === 'wind'}
              detail={`Wind Speed: ${(microgridState.windSpeed || 12).toFixed(1)} mph`}
            />
            
            <EnergyNode 
              icon={<Cable />}
              label="Grid Connection"
              value={microgridState.gridConnected ? animatedValues.gridExchange : 0}
              unit="kW"
              status={microgridState.gridConnected ? 'active' : 'inactive'}
              bgColor="bg-gradient-to-br from-red-800/80 via-red-900/80 to-black/80 border border-red-700/30"
              textColor="text-red-400"
              onClick={() => setSelectedNode(selectedNode === 'grid' ? null : 'grid')}
              isSelected={selectedNode === 'grid'}
              detail={microgridState.gridConnected ? 'Connected' : 'Disconnected'}
            />
          </div>
          
          {/* Center - Battery */}
          <div className="absolute left-[calc(50%-70px)] top-[calc(50%-60px)] z-20">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-800/80 via-purple-900/80 to-black/80 border border-purple-700/30 backdrop-blur-sm">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="mb-2 p-3 rounded-full bg-black/30 flex items-center justify-center">
                  <Battery className="h-8 w-8 text-purple-400" />
                </div>
                <div className="text-sm font-medium text-white">Battery Storage</div>
                <div className="text-xl font-bold text-white">{animatedValues.batteryLevel.toFixed(0)}%</div>
                
                <div className="w-full h-2 bg-purple-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${animatedValues.batteryLevel}%` }}
                  />
                </div>
                
                <div className="text-xs text-white/70">
                  {microgridState.batteryDischargeEnabled ? 'Discharging' : 'Standby'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Consumption */}
          <div className="absolute right-6 top-80 z-20">
            <EnergyNode 
              icon={<Home />}
              label="Building"
              value={animatedValues.buildingConsumption}
              unit="kW"
              bgColor="bg-gradient-to-br from-green-800/80 via-green-900/80 to-black/80 border border-green-700/30"
              textColor="text-green-400"
              onClick={() => setSelectedNode(selectedNode === 'building' ? null : 'building')}
              isSelected={selectedNode === 'building'}
              detail={`Efficiency: ${(microgridState.buildingEfficiency * 100 || 85).toFixed(0)}%`}
            />
          </div>
          
          {/* System status indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 text-xs border border-slate-700/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-slate-300">System Active</span>
              <span className="text-slate-500 ml-1">
                • Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
        
        {/* Energy metrics */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              <h3 className="text-sm font-medium">Generation</h3>
            </div>
            <div className="text-2xl font-bold">{totalProduction.toFixed(1)} kW</div>
            <div className="text-xs text-muted-foreground mt-1">
              Solar: {animatedValues.solarProduction.toFixed(1)} kW • 
              Wind: {animatedValues.windProduction.toFixed(1)} kW
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Battery className="h-5 w-5 text-purple-500" />
              <h3 className="text-sm font-medium">Storage</h3>
            </div>
            <div className="text-2xl font-bold">{animatedValues.batteryLevel.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Capacity: {microgridState.batteryCapacity} kWh
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <PlugZap className="h-5 w-5 text-green-500" />
              <h3 className="text-sm font-medium">Consumption</h3>
            </div>
            <div className="text-2xl font-bold">{animatedValues.buildingConsumption.toFixed(1)} kW</div>
            <div className="text-xs text-muted-foreground mt-1">
              {isEnergyPositive 
                ? `${((totalProduction - animatedValues.gridExchange) / animatedValues.buildingConsumption * 100).toFixed(0)}% from renewables` 
                : `${(totalProduction / animatedValues.buildingConsumption * 100).toFixed(0)}% from renewables`}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground flex justify-between pt-0">
        <div className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          This visualization represents the current energy flow in your microgrid system.
        </div>
        <Button variant="link" size="sm" className="text-xs h-auto p-0">View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default EnergyFlowVisualization;
