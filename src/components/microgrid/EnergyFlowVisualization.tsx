
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
  label?: string;
}

const FlowLine: React.FC<FlowLineProps> = ({ start, end, value, active, color, label }) => {
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
              {label || `${value.toFixed(1)} kW`}
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
  const windToBattery = microgridState.windProduction * 0.3;
  const windToBuilding = microgridState.windProduction * 0.7;
  const batteryToBuilding = microgridState.batteryDischargeEnabled ? 3.5 : 0;
  const batteryToDevices = microgridState.batteryDischargeEnabled ? 2.8 : 0;

  return (
    <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60 shadow-lg">
      <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/5 dark:from-primary/10 dark:to-primary/5">
        <div className="flex items-center text-lg">
          <Zap className="mr-2 h-5 w-5 text-primary" />
          Energy Flow Visualization
        </div>
        <CardDescription>
          Real-time visualization of energy flows in your microgrid
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 pb-4">
        <div className="relative w-full h-[360px] rounded-xl backdrop-blur-sm bg-white dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50 p-4 overflow-hidden shadow-sm">
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          {/* SVG for energy flows */}
          <svg className="absolute inset-0 w-full h-full z-10" style={{ overflow: 'visible' }}>
            {/* Energy flow lines */}
            <FlowLine start="solar" end="battery" value={solarToBattery} active={microgridState.solarProduction > 0} color="rgba(234, 179, 8, 0.6)" label="6.6 kW" />
            <FlowLine start="solar" end="building" value={solarToBuilding} active={microgridState.solarProduction > 0} color="rgba(234, 179, 8, 0.6)" label="9.8 kW" />
            <FlowLine start="wind" end="battery" value={windToBattery} active={microgridState.windProduction > 0} color="rgba(59, 130, 246, 0.6)" label="3.5 kW" />
            <FlowLine start="wind" end="building" value={windToBuilding} active={microgridState.windProduction > 0} color="rgba(59, 130, 246, 0.6)" label="4.7 kW" />
            <FlowLine start="battery" end="building" value={batteryToBuilding} active={microgridState.batteryDischargeEnabled} color="rgba(168, 85, 247, 0.6)" />
            <FlowLine start="battery" end="devices" value={batteryToDevices} active={microgridState.batteryDischargeEnabled} color="rgba(168, 85, 247, 0.6)" />
          </svg>
          
          {/* Sources */}
          <div className="absolute left-6 top-16 space-y-32 z-20">
            {/* Solar */}
            <div className="w-[140px] p-4 rounded-lg bg-yellow-100/70 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 backdrop-blur-sm flex flex-col items-center shadow-sm">
              <Sun className="h-10 w-10 mb-2 text-yellow-500" />
              <div className="text-sm font-medium">Solar</div>
              <div className="text-xl font-bold">16.4 kW</div>
            </div>
            
            {/* Wind */}
            <div className="w-[140px] p-4 rounded-lg bg-blue-100/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 backdrop-blur-sm flex flex-col items-center shadow-sm">
              <Wind className="h-10 w-10 mb-2 text-blue-500" />
              <div className="text-sm font-medium">Wind</div>
              <div className="text-xl font-bold">8.2 kW</div>
            </div>
          </div>
          
          {/* Battery */}
          <div className="absolute left-[calc(50%-80px)] top-[calc(50%-60px)] z-20">
            <div className="w-[160px] p-4 rounded-lg bg-purple-100/70 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 backdrop-blur-sm flex flex-col items-center shadow-sm">
              <Battery className="h-12 w-12 mb-2 text-purple-500" />
              <div className="text-sm font-medium">Battery Storage</div>
              <div className="text-lg font-bold">73.6%</div>
              
              <div className="w-full h-4 bg-purple-200/50 dark:bg-purple-800/30 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-purple-500"
                  style={{ width: '73.6%' }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Consumption */}
          <div className="absolute right-6 top-16 space-y-32 z-20">
            {/* Building */}
            <div className="w-[140px] p-4 rounded-lg bg-green-100/70 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 backdrop-blur-sm flex flex-col items-center shadow-sm">
              <Home className="h-10 w-10 mb-2 text-green-500" />
              <div className="text-sm font-medium">Building</div>
              <div className="text-xl font-bold">11.1 kW</div>
            </div>
            
            {/* Devices */}
            <div className="w-[140px] p-4 rounded-lg bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm flex flex-col items-center shadow-sm">
              <MonitorSmartphone className="h-10 w-10 mb-2 text-slate-500" />
              <div className="text-sm font-medium">Devices</div>
              <div className="text-xl font-bold">2.8 kW</div>
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
