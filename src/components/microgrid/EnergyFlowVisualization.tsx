
import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Wind, 
  Battery, 
  Home, 
  Cable,
  MonitorSmartphone,
  Zap,
  MoreHorizontal
} from 'lucide-react';
import { MicrogridState } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnergyFlowVisualizationProps {
  microgridState: MicrogridState;
}

interface FlowLineProps {
  start: string;
  end: string;
  value: number;
  active: boolean;
  color: string;
  label?: string;
  direction?: 'forward' | 'reverse';
}

const FlowLine: React.FC<FlowLineProps> = ({ 
  start, 
  end, 
  value, 
  active, 
  color, 
  label,
  direction = 'forward'
}) => {
  // Get connection path based on start and end points
  const getPath = () => {
    switch (`${start}-${end}`) {
      case 'solar-battery':
        return "M110,80 C160,80 160,160 210,160";
      case 'solar-building':
        return "M110,80 C200,50 350,50 410,120";
      case 'wind-battery':
        return "M110,240 C135,240 185,200 210,180";
      case 'wind-building':
        return "M110,240 C180,240 270,200 410,160";
      case 'battery-building':
        return "M290,160 C320,160 390,140 410,140";
      case 'battery-devices':
        return "M290,160 C320,170 350,220 410,220";
      case 'grid-building':
        return "M110,320 C180,320 270,200 410,180";
      case 'grid-battery':
        return "M110,320 C140,320 180,240 210,200";
      default:
        return "";
    }
  };

  const path = getPath();
  if (!path) return null;

  // Calculate stroke width based on energy value
  const baseWidth = 2;
  const maxValue = 20;
  const strokeWidth = Math.max(baseWidth, Math.min(8, baseWidth + (value / maxValue) * 6));

  // Animation direction
  const animationClass = direction === 'reverse' ? 'animate-flow-reverse' : 'animate-flow';

  return (
    <g>
      {/* Base connection line */}
      <path 
        d={path} 
        fill="none" 
        stroke={color}
        strokeWidth={strokeWidth} 
        opacity={active ? 0.7 : 0.1}
        strokeDasharray={active ? "" : "5,5"}
      />
      
      {/* Animated flow pattern */}
      {active && (
        <path 
          d={path} 
          fill="none" 
          stroke="white"
          strokeWidth={strokeWidth * 0.6} 
          strokeDasharray="10,15"
          opacity={0.7}
          className={animationClass}
        />
      )}
      
      {/* Energy value indicator */}
      {active && value > 0.5 && (
        <>
          <path 
            id={`flow-path-${start}-${end}`}
            d={path} 
            fill="none" 
            stroke="none"
          />
          <text dy={-5} className="text-[10px] font-medium fill-slate-700 dark:fill-slate-200">
            <textPath 
              href={`#flow-path-${start}-${end}`} 
              startOffset="50%" 
              textAnchor="middle"
            >
              {label || `${value.toFixed(1)} kW`}
            </textPath>
          </text>
        </>
      )}
    </g>
  );
};

const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = ({ microgridState }) => {
  const [animatedValues, setAnimatedValues] = useState({
    solarProduction: 0,
    windProduction: 0,
    batteryLevel: 0,
    buildingConsumption: 0,
    deviceConsumption: 0,
    gridExport: 0,
    gridImport: 0
  });
  
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  
  // Animation for smooth value transitions
  useEffect(() => {
    const targetValues = {
      solarProduction: microgridState.solarProduction,
      windProduction: microgridState.windProduction,
      batteryLevel: microgridState.batteryLevel,
      buildingConsumption: 11.1,
      deviceConsumption: 2.8,
      gridExport: microgridState.gridConnected ? 3.2 : 0,
      gridImport: microgridState.gridConnected ? 2.1 : 0
    };
    
    const animationFrame = setInterval(() => {
      setAnimatedValues(prev => {
        const newValues = {...prev};
        let allReached = true;
        
        // For each value, move it closer to the target
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
  
  // Calculate energy flows with realistic values
  const solarToBattery = animatedValues.solarProduction * 0.35;
  const solarToBuilding = animatedValues.solarProduction * 0.65;
  const windToBattery = animatedValues.windProduction * 0.25;
  const windToBuilding = animatedValues.windProduction * 0.75;
  const batteryToBuilding = microgridState.batteryDischargeEnabled ? 3.5 : 0;
  const batteryToDevices = microgridState.batteryDischargeEnabled ? 2.8 : 0;
  const gridToBuilding = microgridState.gridConnected ? animatedValues.gridImport : 0;
  const gridToBattery = microgridState.gridConnected && microgridState.batteryLevel < 50 ? 1.8 : 0;
  const batteryToGrid = microgridState.gridConnected && microgridState.batteryLevel > 90 ? 2.2 : 0;
  
  // Update last updated time periodically
  useEffect(() => {
    const updateTimer = setInterval(() => {
      setLastUpdated(new Date().toISOString());
    }, 15000);
    
    return () => clearInterval(updateTimer);
  }, []);
  
  // Format the last updated time
  const formattedTime = new Date(lastUpdated).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Calculate total generation and consumption
  const totalGeneration = animatedValues.solarProduction + animatedValues.windProduction;
  const totalConsumption = animatedValues.buildingConsumption + animatedValues.deviceConsumption;
  const netEnergy = totalGeneration - totalConsumption;
  const isEnergyPositive = netEnergy >= 0;

  return (
    <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60 shadow-lg">
      <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/5 dark:from-primary/10 dark:to-primary/5 flex-row justify-between items-center">
        <div>
          <div className="flex items-center text-lg">
            <Zap className="mr-2 h-5 w-5 text-primary" />
            Energy Flow Visualization
          </div>
          <CardDescription>
            Real-time visualization of energy flows in your microgrid
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <span className="mr-1">View</span>
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode('simple')}>
                Simple View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('detailed')}>
                Detailed View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 pb-4">
        <div className="relative w-full h-[360px] rounded-xl backdrop-blur-sm bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50 p-4 overflow-hidden shadow-sm">
          {/* Net energy indicator */}
          <div className="absolute top-4 right-4 z-30">
            <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${
              isEnergyPositive 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isEnergyPositive ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-sm font-medium">
                {isEnergyPositive ? 'Energy Surplus' : 'Energy Deficit'}: 
                {' '}{Math.abs(netEnergy).toFixed(1)} kW
              </span>
            </div>
          </div>
          
          {/* SVG for energy flows */}
          <svg className="absolute inset-0 w-full h-full z-10" style={{ overflow: 'visible' }}>
            {/* Energy flow lines */}
            <FlowLine start="solar" end="battery" value={solarToBattery} active={animatedValues.solarProduction > 0} color="rgba(234, 179, 8, 0.6)" />
            <FlowLine start="solar" end="building" value={solarToBuilding} active={animatedValues.solarProduction > 0} color="rgba(234, 179, 8, 0.6)" />
            <FlowLine start="wind" end="battery" value={windToBattery} active={animatedValues.windProduction > 0} color="rgba(59, 130, 246, 0.6)" />
            <FlowLine start="wind" end="building" value={windToBuilding} active={animatedValues.windProduction > 0} color="rgba(59, 130, 246, 0.6)" />
            <FlowLine start="battery" end="building" value={batteryToBuilding} active={microgridState.batteryDischargeEnabled} color="rgba(168, 85, 247, 0.6)" />
            <FlowLine start="battery" end="devices" value={batteryToDevices} active={microgridState.batteryDischargeEnabled} color="rgba(168, 85, 247, 0.6)" />
            <FlowLine start="grid" end="building" value={gridToBuilding} active={microgridState.gridConnected} color="rgba(220, 38, 38, 0.6)" />
            <FlowLine start="grid" end="battery" value={gridToBattery} active={microgridState.gridConnected && microgridState.batteryLevel < 50} color="rgba(220, 38, 38, 0.6)" />
            {/* Export to grid (reverse direction) */}
            <FlowLine 
              start="battery" 
              end="grid" 
              value={batteryToGrid} 
              active={microgridState.gridConnected && microgridState.batteryLevel > 90} 
              color="rgba(168, 85, 247, 0.6)"
              direction="reverse"
            />
          </svg>
          
          {/* Sources */}
          <div className="absolute left-6 top-16 space-y-24 z-20">
            {/* Solar */}
            <div className="w-[140px] p-4 rounded-lg bg-yellow-100/70 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 backdrop-blur-sm flex flex-col items-center shadow-sm">
              <Sun className="h-10 w-10 mb-2 text-yellow-500" />
              <div className="text-sm font-medium">Solar</div>
              <div className="text-xl font-bold">{animatedValues.solarProduction.toFixed(1)} kW</div>
              {viewMode === 'detailed' && (
                <div className="text-xs text-muted-foreground mt-1">
                  Efficiency: {(microgridState.solarEfficiency * 100).toFixed(0)}%
                </div>
              )}
            </div>
            
            {/* Wind */}
            <div className="w-[140px] p-4 rounded-lg bg-blue-100/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 backdrop-blur-sm flex flex-col items-center shadow-sm">
              <Wind className="h-10 w-10 mb-2 text-blue-500" />
              <div className="text-sm font-medium">Wind</div>
              <div className="text-xl font-bold">{animatedValues.windProduction.toFixed(1)} kW</div>
              {viewMode === 'detailed' && (
                <div className="text-xs text-muted-foreground mt-1">
                  Wind Speed: {(microgridState.windSpeed || 12).toFixed(1)} mph
                </div>
              )}
            </div>
            
            {/* Grid (below Wind) */}
            <div className={`w-[140px] p-4 rounded-lg backdrop-blur-sm flex flex-col items-center shadow-sm ${
              microgridState.gridConnected 
                ? 'bg-red-100/70 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50' 
                : 'bg-gray-100/70 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800/50'
            }`}>
              <Cable className={`h-10 w-10 mb-2 ${microgridState.gridConnected ? 'text-red-500' : 'text-gray-400'}`} />
              <div className="text-sm font-medium">Grid</div>
              <div className="text-xl font-bold">
                {microgridState.gridConnected ? (
                  <>
                    {isEnergyPositive ? '+' : '-'}{Math.abs(netEnergy).toFixed(1)} kW
                  </>
                ) : (
                  <span className="text-gray-400">Disconnected</span>
                )}
              </div>
              {viewMode === 'detailed' && microgridState.gridConnected && (
                <div className="flex justify-between w-full text-xs mt-1">
                  <span>Import: {animatedValues.gridImport.toFixed(1)}</span>
                  <span>Export: {animatedValues.gridExport.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Battery */}
          <div className="absolute left-[calc(50%-80px)] top-[calc(50%-60px)] z-20">
            <div className="w-[160px] p-4 rounded-lg bg-purple-100/70 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 backdrop-blur-sm flex flex-col items-center shadow-sm">
              <Battery className="h-12 w-12 mb-2 text-purple-500" />
              <div className="text-sm font-medium">Battery Storage</div>
              <div className="text-lg font-bold">{animatedValues.batteryLevel.toFixed(1)}%</div>
              
              <div className="w-full h-4 bg-purple-200/50 dark:bg-purple-800/30 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${animatedValues.batteryLevel}%` }}
                ></div>
              </div>
              
              {viewMode === 'detailed' && (
                <div className="w-full flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>
                    {microgridState.batteryDischargeEnabled ? 'Discharging' : 'Standby'}
                  </span>
                  <span>
                    {microgridState.batteryCapacity} kWh
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Consumption */}
          <div className="absolute right-6 top-16 space-y-24 z-20">
            {/* Building */}
            <div className="w-[140px] p-4 rounded-lg bg-green-100/70 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 backdrop-blur-sm flex flex-col items-center shadow-sm">
              <Home className="h-10 w-10 mb-2 text-green-500" />
              <div className="text-sm font-medium">Building</div>
              <div className="text-xl font-bold">{animatedValues.buildingConsumption.toFixed(1)} kW</div>
              {viewMode === 'detailed' && (
                <div className="text-xs text-muted-foreground mt-1">
                  Efficiency: {(microgridState.buildingEfficiency * 100 || 82).toFixed(0)}%
                </div>
              )}
            </div>
            
            {/* Devices */}
            <div className="w-[140px] p-4 rounded-lg bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm flex flex-col items-center shadow-sm">
              <MonitorSmartphone className="h-10 w-10 mb-2 text-slate-500" />
              <div className="text-sm font-medium">Devices</div>
              <div className="text-xl font-bold">{animatedValues.deviceConsumption.toFixed(1)} kW</div>
              {viewMode === 'detailed' && (
                <div className="text-xs text-muted-foreground mt-1">
                  Active: {5} devices
                </div>
              )}
            </div>
          </div>
          
          {/* System status */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>System Active</span>
              <span className="text-muted-foreground ml-1">• Updated {formattedTime}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyFlowVisualization;
