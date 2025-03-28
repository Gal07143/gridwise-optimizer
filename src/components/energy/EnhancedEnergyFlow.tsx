
import React, { useState, useEffect } from 'react';
import { 
  Battery, Sun, Wind, Zap, ArrowRight, 
  Home, Info, BarChart2, Maximize2,
  Clock, Calendar, RefreshCcw, Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMicrogrid } from '@/components/microgrid/MicrogridProvider';
import { MicrogridState } from '@/components/microgrid/types';
import { useSiteContext } from '@/contexts/SiteContext';

// Power flow line component
interface PowerFlowLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  power: number;
  color: string;
  direction: 'right' | 'left' | 'up' | 'down';
  label?: string;
}

const PowerFlowLine: React.FC<PowerFlowLineProps> = ({ 
  startX, startY, endX, endY, power, color, direction, label 
}) => {
  const strokeWidth = Math.max(2, Math.min(8, power * 0.5));
  const isHorizontal = direction === 'right' || direction === 'left';
  
  // Arrow marker
  const getArrowPoints = () => {
    switch (direction) {
      case 'right':
        return `${endX - 10},${endY - 5} ${endX},${endY} ${endX - 10},${endY + 5}`;
      case 'left':
        return `${endX + 10},${endY - 5} ${endX},${endY} ${endX + 10},${endY + 5}`;
      case 'up':
        return `${endX - 5},${endY + 10} ${endX},${endY} ${endX + 5},${endY + 10}`;
      case 'down':
        return `${endX - 5},${endY - 10} ${endX},${endY} ${endX + 5},${endY - 10}`;
      default:
        return '';
    }
  };
  
  // Power animation
  const animationDuration = Math.max(2, Math.min(10, 10 / (power ? power : 1)));
  
  return (
    <g>
      {/* Main line */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      
      {/* Arrow */}
      <polygon
        points={getArrowPoints()}
        fill={color}
      />
      
      {/* Power dots animation */}
      {power > 0 && (
        <circle
          r={strokeWidth / 2 + 1}
          fill="white"
        >
          <animateMotion
            path={`M${startX},${startY} L${endX},${endY}`}
            dur={`${animationDuration}s`}
            repeatCount="indefinite"
          />
        </circle>
      )}
      
      {/* Label */}
      {label && (
        <text
          x={isHorizontal ? (startX + endX) / 2 : endX + 15}
          y={isHorizontal ? startY - 10 : (startY + endY) / 2}
          fontSize="12"
          textAnchor="middle"
          fill="currentColor"
        >
          {label}
        </text>
      )}
      
      {/* Power value */}
      <text
        x={isHorizontal ? (startX + endX) / 2 : endX + 15}
        y={isHorizontal ? startY + 20 : (startY + endY) / 2 + 15}
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        fill="currentColor"
      >
        {power.toFixed(1)} kW
      </text>
    </g>
  );
};

// Energy node component
interface EnergyNodeProps {
  x: number;
  y: number;
  type: 'solar' | 'wind' | 'battery' | 'grid' | 'home';
  label: string;
  value: number;
  capacity: number;
  state?: string;
  onClick?: () => void;
}

const EnergyNode: React.FC<EnergyNodeProps> = ({ 
  x, y, type, label, value, capacity, state, onClick 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'solar': return <Sun className="h-12 w-12 text-yellow-500" />;
      case 'wind': return <Wind className="h-12 w-12 text-blue-500" />;
      case 'battery': return <Battery className="h-12 w-12 text-green-500" />;
      case 'grid': return <Zap className="h-12 w-12 text-purple-500" />;
      case 'home': return <Home className="h-12 w-12 text-orange-500" />;
      default: return null;
    }
  };
  
  const getStatusColor = () => {
    if (type === 'battery') {
      if (value / capacity > 0.8) return 'bg-green-500';
      if (value / capacity > 0.3) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    
    if (value > 0) return 'bg-green-500';
    return 'bg-gray-500';
  };
  
  return (
    <g 
      transform={`translate(${x}, ${y})`} 
      className="cursor-pointer"
      onClick={onClick}
    >
      {/* Background circle */}
      <circle
        r="40"
        fill="currentColor"
        className="text-muted fill-current opacity-20"
      />
      
      {/* Status indicator */}
      <circle
        r="5"
        cx="30"
        cy="-30"
        className={getStatusColor()}
      />
      
      {/* Icon */}
      <foreignObject x="-20" y="-20" width="40" height="40">
        <div className="flex items-center justify-center h-full">
          {getIcon()}
        </div>
      </foreignObject>
      
      {/* Label */}
      <text
        y="60"
        fontSize="14"
        textAnchor="middle"
        fontWeight="bold"
        fill="currentColor"
      >
        {label}
      </text>
      
      {/* Value */}
      <text
        y="80"
        fontSize="12"
        textAnchor="middle"
        fill="currentColor"
      >
        {type === 'battery' 
          ? `${value.toFixed(1)}% / ${capacity} kWh`
          : `${value.toFixed(1)} kW / ${capacity} kW`
        }
      </text>
      
      {/* State */}
      {state && (
        <text
          y="-50"
          fontSize="12"
          textAnchor="middle"
          fill="currentColor"
        >
          {state}
        </text>
      )}
    </g>
  );
};

export const EnhancedEnergyFlow: React.FC = () => {
  const { state: microgridState } = useMicrogrid();
  const { activeSite } = useSiteContext();
  const [timeframe, setTimeframe] = useState<'realtime' | 'daily' | 'weekly' | 'monthly'>('realtime');
  const [viewMode, setViewMode] = useState<'sankey' | 'flow' | 'radar'>('flow');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Calculate power flows from microgrid state
  const calculatePowerFlows = (state: MicrogridState) => {
    // Solar to battery
    const solarToBattery = state.batteryCharging && state.solarOutput > 0 
      ? Math.min(state.solarOutput, state.batteryChargeRate || 0) 
      : 0;
      
    // Solar to load
    const solarToLoad = state.solarOutput > solarToBattery 
      ? Math.min(state.solarOutput - solarToBattery, state.loadDemand) 
      : 0;
      
    // Solar to grid (export)
    const solarToGrid = state.solarOutput > (solarToBattery + solarToLoad)
      ? state.solarOutput - solarToBattery - solarToLoad
      : 0;
      
    // Wind to battery
    const windToBattery = state.batteryCharging && state.windOutput > 0
      ? Math.min(state.windOutput, Math.max(0, state.batteryChargeRate || 0 - solarToBattery))
      : 0;
      
    // Wind to load
    const windToLoad = state.windOutput > windToBattery
      ? Math.min(state.windOutput - windToBattery, Math.max(0, state.loadDemand - solarToLoad))
      : 0;
      
    // Wind to grid (export)
    const windToGrid = state.windOutput > (windToBattery + windToLoad)
      ? state.windOutput - windToBattery - windToLoad
      : 0;
      
    // Battery to load
    const batteryToLoad = state.batteryDischargeEnabled && state.batteryCurrent < 0
      ? Math.min(Math.abs(state.batteryCurrent), Math.max(0, state.loadDemand - solarToLoad - windToLoad))
      : 0;
      
    // Grid to load
    const gridToLoad = Math.max(0, state.loadDemand - solarToLoad - windToLoad - batteryToLoad);
    
    // Grid to battery (charging from grid)
    const gridToBattery = state.batteryCharging && state.gridConnection
      ? Math.max(0, (state.batteryChargeRate || 0) - solarToBattery - windToBattery)
      : 0;
      
    return {
      solarToBattery,
      solarToLoad,
      solarToGrid,
      windToBattery,
      windToLoad,
      windToGrid,
      batteryToLoad,
      gridToLoad,
      gridToBattery,
      totalExport: solarToGrid + windToGrid,
      totalImport: gridToLoad + gridToBattery,
      selfConsumption: (solarToLoad + windToLoad + batteryToLoad) / 
        (state.solarOutput + state.windOutput + batteryToLoad) * 100 || 0
    };
  };
  
  const powerFlows = calculatePowerFlows(microgridState);
  
  // Node positions
  const solarX = 100;
  const solarY = 100;
  
  const windX = 100;
  const windY = 300;
  
  const batteryX = 300;
  const batteryY = 200;
  
  const gridX = 500;
  const gridY = 100;
  
  const loadX = 500;
  const loadY = 300;
  
  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Node details for selected node
  const renderNodeDetails = () => {
    if (!selectedNode) return null;
    
    const getDetails = () => {
      switch (selectedNode) {
        case 'solar':
          return {
            title: 'Solar Generation',
            metrics: [
              { label: 'Current Output', value: `${microgridState.solarOutput.toFixed(1)} kW` },
              { label: 'Peak Today', value: `${(microgridState.solarOutput * 1.2).toFixed(1)} kW` },
              { label: 'Efficiency', value: `${microgridState.solarEfficiency * 100}%` },
              { label: 'To Battery', value: `${powerFlows.solarToBattery.toFixed(1)} kW` },
              { label: 'To Load', value: `${powerFlows.solarToLoad.toFixed(1)} kW` },
              { label: 'To Grid', value: `${powerFlows.solarToGrid.toFixed(1)} kW` },
            ]
          };
        case 'wind':
          return {
            title: 'Wind Generation',
            metrics: [
              { label: 'Current Output', value: `${microgridState.windOutput.toFixed(1)} kW` },
              { label: 'Wind Speed', value: `${microgridState.windSpeed.toFixed(1)} m/s` },
              { label: 'To Battery', value: `${powerFlows.windToBattery.toFixed(1)} kW` },
              { label: 'To Load', value: `${powerFlows.windToLoad.toFixed(1)} kW` },
              { label: 'To Grid', value: `${powerFlows.windToGrid.toFixed(1)} kW` },
            ]
          };
        case 'battery':
          return {
            title: 'Battery Storage',
            metrics: [
              { label: 'Charge Level', value: `${microgridState.batteryCharge.toFixed(1)}%` },
              { label: 'Current', value: `${microgridState.batteryCurrent.toFixed(1)} A` },
              { label: 'Capacity', value: `${microgridState.batteryCapacity.toFixed(1)} kWh` },
              { label: 'Charging', value: microgridState.batteryCharging ? 'Yes' : 'No' },
              { label: 'Charge Rate', value: `${(microgridState.batteryChargeRate || 0).toFixed(1)} kW` },
              { label: 'To Load', value: `${powerFlows.batteryToLoad.toFixed(1)} kW` },
            ]
          };
        case 'grid':
          return {
            title: 'Grid Connection',
            metrics: [
              { label: 'Status', value: microgridState.gridConnection ? 'Connected' : 'Disconnected' },
              { label: 'Import', value: `${powerFlows.totalImport.toFixed(1)} kW` },
              { label: 'Export', value: `${powerFlows.totalExport.toFixed(1)} kW` },
              { label: 'Net', value: `${(powerFlows.totalImport - powerFlows.totalExport).toFixed(1)} kW` },
              { label: 'To Battery', value: `${powerFlows.gridToBattery.toFixed(1)} kW` },
              { label: 'To Load', value: `${powerFlows.gridToLoad.toFixed(1)} kW` },
            ]
          };
        case 'load':
          return {
            title: 'Load Consumption',
            metrics: [
              { label: 'Current Demand', value: `${microgridState.loadDemand.toFixed(1)} kW` },
              { label: 'From Solar', value: `${powerFlows.solarToLoad.toFixed(1)} kW` },
              { label: 'From Wind', value: `${powerFlows.windToLoad.toFixed(1)} kW` },
              { label: 'From Battery', value: `${powerFlows.batteryToLoad.toFixed(1)} kW` },
              { label: 'From Grid', value: `${powerFlows.gridToLoad.toFixed(1)} kW` },
              { label: 'Building Efficiency', value: `${microgridState.buildingEfficiency * 100}%` },
            ]
          };
        default:
          return { title: '', metrics: [] };
      }
    };
    
    const details = getDetails();
    
    return (
      <div className="absolute right-4 top-16 w-64 bg-background/90 backdrop-blur-sm border rounded-lg shadow-lg p-4">
        <h3 className="font-semibold mb-2">{details.title}</h3>
        <dl className="space-y-1">
          {details.metrics.map((metric, index) => (
            <div key={index} className="flex justify-between text-sm">
              <dt className="text-muted-foreground">{metric.label}</dt>
              <dd className="font-medium">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  };
  
  return (
    <Card className={isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : ''}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">
          Energy Flow Visualization
        </CardTitle>
        <div className="flex items-center gap-2">
          <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="realtime" className="text-xs h-7">
                <Clock className="h-3 w-3 mr-1" />
                Real-time
              </TabsTrigger>
              <TabsTrigger value="daily" className="text-xs h-7">
                Day
              </TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs h-7">
                Week
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs h-7">
                Month
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flow">Flow View</SelectItem>
              <SelectItem value="sankey">Sankey View</SelectItem>
              <SelectItem value="radar">Radar View</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="relative p-0">
        <div className="absolute top-2 left-2 z-10 flex gap-1 flex-wrap max-w-[200px]">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString()}
          </Badge>
          {activeSite && (
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              <Info className="h-3 w-3 mr-1" />
              {activeSite.name}
            </Badge>
          )}
          <Badge className="bg-green-500/20 text-green-600 border-green-500">
            Self-consumption: {powerFlows.selfConsumption.toFixed(0)}%
          </Badge>
        </div>
        
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <Button variant="outline" size="sm" className="h-7">
            <RefreshCcw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="h-7">
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="h-7">
            <BarChart2 className="h-3 w-3 mr-1" />
            Details
          </Button>
        </div>
        
        <div className={`relative w-full ${isFullscreen ? 'h-[calc(100vh-64px)]' : 'h-[500px]'}`}>
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 600 400" 
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Power flow lines */}
            {/* Solar connections */}
            {powerFlows.solarToBattery > 0 && (
              <PowerFlowLine
                startX={solarX + 40}
                startY={solarY}
                endX={batteryX - 40}
                endY={batteryY - 30}
                power={powerFlows.solarToBattery}
                color="#10b981"
                direction="right"
              />
            )}
            
            {powerFlows.solarToLoad > 0 && (
              <PowerFlowLine
                startX={solarX + 40}
                startY={solarY + 20}
                endX={loadX - 40}
                endY={loadY - 30}
                power={powerFlows.solarToLoad}
                color="#f59e0b"
                direction="right"
              />
            )}
            
            {powerFlows.solarToGrid > 0 && (
              <PowerFlowLine
                startX={solarX + 40}
                startY={solarY - 20}
                endX={gridX - 40}
                endY={gridY}
                power={powerFlows.solarToGrid}
                color="#8b5cf6"
                direction="right"
              />
            )}
            
            {/* Wind connections */}
            {powerFlows.windToBattery > 0 && (
              <PowerFlowLine
                startX={windX + 40}
                startY={windY}
                endX={batteryX - 40}
                endY={batteryY + 30}
                power={powerFlows.windToBattery}
                color="#10b981"
                direction="right"
              />
            )}
            
            {powerFlows.windToLoad > 0 && (
              <PowerFlowLine
                startX={windX + 40}
                startY={windY + 20}
                endX={loadX - 40}
                endY={loadY}
                power={powerFlows.windToLoad}
                color="#f59e0b"
                direction="right"
              />
            )}
            
            {powerFlows.windToGrid > 0 && (
              <PowerFlowLine
                startX={windX + 40}
                startY={windY - 20}
                endX={gridX - 40}
                endY={gridY + 30}
                power={powerFlows.windToGrid}
                color="#8b5cf6"
                direction="right"
              />
            )}
            
            {/* Battery connections */}
            {powerFlows.batteryToLoad > 0 && (
              <PowerFlowLine
                startX={batteryX + 40}
                startY={batteryY}
                endX={loadX - 40}
                endY={loadY - 20}
                power={powerFlows.batteryToLoad}
                color="#f59e0b"
                direction="right"
              />
            )}
            
            {/* Grid connections */}
            {powerFlows.gridToLoad > 0 && (
              <PowerFlowLine
                startX={gridX}
                startY={gridY + 40}
                endX={loadX}
                endY={loadY - 40}
                power={powerFlows.gridToLoad}
                color="#f59e0b"
                direction="down"
              />
            )}
            
            {powerFlows.gridToBattery > 0 && (
              <PowerFlowLine
                startX={gridX - 20}
                startY={gridY + 40}
                endX={batteryX + 40}
                endY={batteryY - 20}
                power={powerFlows.gridToBattery}
                color="#10b981"
                direction="left"
              />
            )}
            
            {/* Energy nodes */}
            <EnergyNode
              x={solarX}
              y={solarY}
              type="solar"
              label="Solar"
              value={microgridState.solarOutput}
              capacity={(activeSite?.capacity || 0) * 0.6}
              state={microgridState.solarConnected ? "Connected" : "Disconnected"}
              onClick={() => handleNodeClick('solar')}
            />
            
            <EnergyNode
              x={windX}
              y={windY}
              type="wind"
              label="Wind"
              value={microgridState.windOutput}
              capacity={(activeSite?.capacity || 0) * 0.4}
              state={microgridState.windConnected ? "Connected" : "Disconnected"}
              onClick={() => handleNodeClick('wind')}
            />
            
            <EnergyNode
              x={batteryX}
              y={batteryY}
              type="battery"
              label="Battery"
              value={microgridState.batteryCharge}
              capacity={microgridState.batteryCapacity}
              state={microgridState.batteryCharging ? "Charging" : "Discharging"}
              onClick={() => handleNodeClick('battery')}
            />
            
            <EnergyNode
              x={gridX}
              y={gridY}
              type="grid"
              label="Grid"
              value={powerFlows.totalImport - powerFlows.totalExport}
              capacity={100}
              state={microgridState.gridConnection ? "Connected" : "Disconnected"}
              onClick={() => handleNodeClick('grid')}
            />
            
            <EnergyNode
              x={loadX}
              y={loadY}
              type="home"
              label="Load"
              value={microgridState.loadDemand}
              capacity={50}
              state={microgridState.loadConnected ? "Connected" : "Disconnected"}
              onClick={() => handleNodeClick('load')}
            />
          </svg>
          
          {/* Node details panel */}
          {renderNodeDetails()}
          
          {/* Summary stats */}
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap justify-between gap-2">
            <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
              <Sun className="h-3 w-3 mr-1 text-yellow-500" />
              Solar: {microgridState.solarOutput.toFixed(1)} kW
            </Badge>
            
            <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
              <Wind className="h-3 w-3 mr-1 text-blue-500" />
              Wind: {microgridState.windOutput.toFixed(1)} kW
            </Badge>
            
            <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
              <Battery className="h-3 w-3 mr-1 text-green-500" />
              Battery: {microgridState.batteryCharge.toFixed(1)}%
            </Badge>
            
            <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
              <ArrowRight className="h-3 w-3 mr-1 text-purple-500" />
              Grid import: {powerFlows.totalImport.toFixed(1)} kW
            </Badge>
            
            <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
              <Home className="h-3 w-3 mr-1 text-orange-500" />
              Load: {microgridState.loadDemand.toFixed(1)} kW
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedEnergyFlow;
