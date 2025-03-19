
import React from 'react';
import { 
  Sun, 
  Wind, 
  Battery, 
  Home, 
  Cable,
  MonitorSmartphone,
  Zap
} from 'lucide-react';
import { MicrogridState } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EnergyFlowVisualizationProps {
  microgridState: MicrogridState;
}

interface FlowLineProps {
  start: string;
  end: string;
  value: number;
  active: boolean;
  color: string;
}

const FlowLine: React.FC<FlowLineProps> = ({ start, end, value, active, color }) => {
  // Get connection path based on start and end points
  const getPath = () => {
    switch (`${start}-${end}`) {
      case 'solar-battery':
        return "M110,80 C160,80 160,160 210,160";
      case 'solar-building':
        return "M110,80 C180,80 270,120 410,120";
      case 'wind-battery':
        return "M110,160 C135,160 185,160 210,160";
      case 'wind-building':
        return "M110,160 C180,160 270,160 410,160";
      case 'grid-building':
        return "M110,240 C180,240 270,200 410,200";
      case 'battery-building':
        return "M290,160 C320,160 390,180 410,180";
      case 'battery-grid':
        return "M290,160 C320,160 350,240 410,240";
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

  return (
    <g>
      {/* Base connection line */}
      <path 
        d={path} 
        fill="none" 
        stroke={color}
        strokeWidth={strokeWidth} 
        opacity={active ? 0.5 : 0.1}
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
          className="animate-flow"
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
              {value.toFixed(1)} kW
            </textPath>
          </text>
        </>
      )}
    </g>
  );
};

const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = ({ microgridState }) => {
  // Calculate all energy flows
  const solarToBattery = microgridState.solarProduction * 0.4;
  const solarToBuilding = microgridState.solarProduction * 0.6;
  const windToBattery = microgridState.windProduction * 0.2;
  const windToBuilding = microgridState.windProduction * 0.8;
  const gridToBuilding = microgridState.gridImport;
  const batteryToBuilding = microgridState.batteryDischargeEnabled ? 3.5 : 0;
  const batteryToGrid = microgridState.gridExport;

  return (
    <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60 shadow-lg">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
        <CardTitle className="flex items-center text-lg">
          <Zap className="mr-2 h-5 w-5 text-primary" />
          Energy Flow Visualization
        </CardTitle>
        <CardDescription>
          Real-time visualization of energy flows in your microgrid
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 pb-4">
        <div className="relative w-full h-[360px] rounded-xl backdrop-blur-sm bg-gradient-to-br from-slate-50/80 to-slate-100/50 dark:from-slate-800/30 dark:to-slate-900/20 border border-slate-200/50 dark:border-slate-700/50 p-4 overflow-hidden shadow-sm">
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          {/* SVG for energy flows */}
          <svg className="absolute inset-0 w-full h-full z-10" style={{ overflow: 'visible' }}>
            {/* Energy flow lines */}
            <FlowLine start="solar" end="battery" value={solarToBattery} active={microgridState.solarProduction > 0} color="rgba(234, 179, 8, 0.6)" />
            <FlowLine start="solar" end="building" value={solarToBuilding} active={microgridState.solarProduction > 0} color="rgba(234, 179, 8, 0.6)" />
            <FlowLine start="wind" end="battery" value={windToBattery} active={microgridState.windProduction > 0} color="rgba(59, 130, 246, 0.6)" />
            <FlowLine start="wind" end="building" value={windToBuilding} active={microgridState.windProduction > 0} color="rgba(59, 130, 246, 0.6)" />
            <FlowLine start="grid" end="building" value={gridToBuilding} active={microgridState.gridImport > 0} color="rgba(100, 116, 139, 0.6)" />
            <FlowLine start="battery" end="building" value={batteryToBuilding} active={microgridState.batteryDischargeEnabled} color="rgba(168, 85, 247, 0.6)" />
            <FlowLine start="battery" end="grid" value={batteryToGrid} active={microgridState.gridExport > 0} color="rgba(168, 85, 247, 0.6)" />
          </svg>
          
          {/* Sources */}
          <div className="absolute left-6 top-16 space-y-16 z-20">
            {/* Solar */}
            <div className={cn(
              "w-[100px] p-3 rounded-lg backdrop-blur-sm flex flex-col items-center transition-all",
              microgridState.solarProduction > 0 
                ? "bg-yellow-500/10 border border-yellow-400/30 shadow-md"
                : "bg-slate-100/30 dark:bg-slate-800/30 border border-slate-200/30 dark:border-slate-700/30"
            )}>
              <Sun className={cn(
                "h-10 w-10 mb-1",
                microgridState.solarProduction > 0 ? "text-yellow-500" : "text-slate-400"
              )} />
              <div className="text-sm font-medium">Solar</div>
              <div className="text-lg font-semibold">{microgridState.solarProduction.toFixed(1)} kW</div>
            </div>
            
            {/* Wind */}
            <div className={cn(
              "w-[100px] p-3 rounded-lg backdrop-blur-sm flex flex-col items-center transition-all",
              microgridState.windProduction > 0 
                ? "bg-blue-500/10 border border-blue-400/30 shadow-md"
                : "bg-slate-100/30 dark:bg-slate-800/30 border border-slate-200/30 dark:border-slate-700/30"
            )}>
              <Wind className={cn(
                "h-10 w-10 mb-1",
                microgridState.windProduction > 0 ? "text-blue-500" : "text-slate-400"
              )} />
              <div className="text-sm font-medium">Wind</div>
              <div className="text-lg font-semibold">{microgridState.windProduction.toFixed(1)} kW</div>
            </div>
            
            {/* Grid */}
            <div className={cn(
              "w-[100px] p-3 rounded-lg backdrop-blur-sm flex flex-col items-center transition-all",
              microgridState.gridImport > 0 
                ? "bg-slate-500/10 border border-slate-400/30 shadow-md"
                : "bg-slate-100/30 dark:bg-slate-800/30 border border-slate-200/30 dark:border-slate-700/30"
            )}>
              <Cable className={cn(
                "h-10 w-10 mb-1",
                microgridState.gridImport > 0 ? "text-slate-500" : "text-slate-400"
              )} />
              <div className="text-sm font-medium">Grid</div>
              <div className="text-lg font-semibold">{microgridState.gridImport.toFixed(1)} kW</div>
            </div>
          </div>
          
          {/* Battery */}
          <div className="absolute left-[calc(50%-80px)] top-[calc(50%-60px)] z-20">
            <div className="w-[160px] p-4 rounded-lg bg-purple-500/10 border border-purple-400/30 backdrop-blur-sm flex flex-col items-center shadow-md">
              <Battery className="h-12 w-12 mb-1 text-purple-500" />
              <div className="text-sm font-medium">Battery Storage</div>
              <div className="text-lg font-semibold">{microgridState.batteryCharge}%</div>
              
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                <div 
                  className={cn(
                    "h-full",
                    microgridState.batteryCharge > 80 ? "bg-green-500" : 
                    microgridState.batteryCharge > 40 ? "bg-purple-500" : 
                    microgridState.batteryCharge > 20 ? "bg-yellow-500" : "bg-red-500"
                  )}
                  style={{ width: `${microgridState.batteryCharge}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Consumption */}
          <div className="absolute right-6 top-16 space-y-16 z-20">
            {/* Building */}
            <div className="w-[100px] p-3 rounded-lg bg-green-500/10 border border-green-400/30 backdrop-blur-sm flex flex-col items-center shadow-md">
              <Home className="h-10 w-10 mb-1 text-green-500" />
              <div className="text-sm font-medium">Building</div>
              <div className="text-lg font-semibold">{microgridState.loadConsumption.toFixed(1)} kW</div>
            </div>
            
            {/* EV Charging */}
            <div className="w-[100px] p-3 rounded-lg bg-slate-100/30 dark:bg-slate-800/30 border border-slate-200/30 dark:border-slate-700/30 backdrop-blur-sm flex flex-col items-center">
              <MonitorSmartphone className="h-10 w-10 mb-1 text-slate-400" />
              <div className="text-sm font-medium">Devices</div>
              <div className="text-lg font-semibold">2.8 kW</div>
            </div>
            
            {/* Grid Export */}
            <div className={cn(
              "w-[100px] p-3 rounded-lg backdrop-blur-sm flex flex-col items-center transition-all",
              microgridState.gridExport > 0 
                ? "bg-emerald-500/10 border border-emerald-400/30 shadow-md"
                : "bg-slate-100/30 dark:bg-slate-800/30 border border-slate-200/30 dark:border-slate-700/30"
            )}>
              <Cable className={cn(
                "h-10 w-10 mb-1 rotate-180",
                microgridState.gridExport > 0 ? "text-emerald-500" : "text-slate-400"
              )} />
              <div className="text-sm font-medium">Export</div>
              <div className="text-lg font-semibold">{microgridState.gridExport.toFixed(1)} kW</div>
            </div>
          </div>
          
          {/* System status */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>System Active</span>
              <span className="text-muted-foreground ml-1">• Updated just now</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyFlowVisualization;
