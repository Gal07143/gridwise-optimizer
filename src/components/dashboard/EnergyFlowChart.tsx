
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Mock data for energy flow connections
interface EnergyNode {
  id: string;
  label: string;
  type: 'source' | 'consumption' | 'storage';
  power: number; // in kW
  status: 'active' | 'inactive' | 'warning';
}

interface EnergyConnection {
  from: string;
  to: string;
  value: number; // in kW
  active: boolean;
}

interface EnergyFlowChartProps {
  className?: string;
  animationDelay?: string;
}

const INITIAL_NODES: EnergyNode[] = [
  { id: 'solar', label: 'Solar Power', type: 'source', power: 75.2, status: 'active' },
  { id: 'wind', label: 'Wind Power', type: 'source', power: 45.8, status: 'active' },
  { id: 'grid', label: 'Grid', type: 'source', power: 32.1, status: 'active' },
  { id: 'battery', label: 'Battery Storage', type: 'storage', power: 120, status: 'active' },
  { id: 'building', label: 'Main Building', type: 'consumption', power: 102.7, status: 'active' },
  { id: 'ev', label: 'EV Charging', type: 'consumption', power: 48.3, status: 'active' },
];

const INITIAL_CONNECTIONS: EnergyConnection[] = [
  { from: 'solar', to: 'battery', value: 35.2, active: true },
  { from: 'solar', to: 'building', value: 40.0, active: true },
  { from: 'wind', to: 'building', value: 25.8, active: true },
  { from: 'wind', to: 'battery', value: 20, active: true },
  { from: 'grid', to: 'building', value: 32.1, active: true },
  { from: 'battery', to: 'ev', value: 48.3, active: true },
];

const EnergyFlowChart = ({ className, animationDelay }: EnergyFlowChartProps = {}) => {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  
  // Simulating live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prevNodes => {
        return prevNodes.map(node => ({
          ...node,
          power: Math.max(0, node.power * (1 + (Math.random() - 0.5) * 0.08)) // +/- 4% change
        }));
      });
      
      setConnections(prevConnections => {
        return prevConnections.map(conn => ({
          ...conn,
          value: Math.max(0, conn.value * (1 + (Math.random() - 0.5) * 0.1)) // +/- 5% change
        }));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getNodeColor = (type: string, status: string) => {
    if (status !== 'active') return 'bg-energy-orange/50 border-energy-orange';
    
    switch (type) {
      case 'source': 
        return 'bg-gradient-to-br from-energy-green/10 to-energy-green/20 border-energy-green/50';
      case 'storage': 
        return 'bg-gradient-to-br from-energy-blue/10 to-energy-blue/20 border-energy-blue/50';
      case 'consumption': 
        return 'bg-gradient-to-br from-energy-purple/10 to-energy-purple/20 border-energy-purple/50';
      default: 
        return 'bg-white dark:bg-slate-800';
    }
  };
  
  return (
    <div className={cn("w-full h-full min-h-[350px]", className)} style={animationDelay ? { animationDelay } : undefined}>
      <div className="relative w-full h-[300px] overflow-hidden rounded-lg bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 p-4 grid-pattern">
        {/* Energy Sources */}
        <div className="absolute left-6 top-4 w-[140px] h-[calc(100%-32px)] flex flex-col justify-around">
          {nodes.filter(n => n.type === 'source').map(node => (
            <div 
              key={node.id} 
              className={cn(
                "p-3 rounded-lg border shadow-sm backdrop-blur-sm transition-all",
                getNodeColor(node.type, node.status)
              )}
            >
              <div className="text-sm font-medium">{node.label}</div>
              <div className="text-lg font-semibold flex items-center gap-1 mt-1">
                <div className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  node.status === 'active' ? 'bg-energy-green' : 'bg-energy-orange'
                )}></div>
                {node.power.toFixed(1)} kW
              </div>
            </div>
          ))}
        </div>
        
        {/* Battery Storage */}
        <div className="absolute left-[calc(50%-70px)] top-[calc(50%-60px)]">
          {nodes.filter(n => n.type === 'storage').map(node => (
            <div 
              key={node.id} 
              className={cn(
                "p-4 rounded-lg border w-[140px] shadow-sm backdrop-blur-sm transition-all",
                getNodeColor(node.type, node.status)
              )}
            >
              <div className="text-sm font-medium">{node.label}</div>
              <div className="text-lg font-semibold flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full animate-pulse bg-energy-blue"></div>
                {node.power.toFixed(1)} kW
              </div>
              <div className="mt-2 bg-slate-100 dark:bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div className="bg-energy-blue h-full animate-pulse" style={{ width: '68%' }}></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Energy Consumption */}
        <div className="absolute right-6 top-4 w-[140px] h-[calc(100%-32px)] flex flex-col justify-around">
          {nodes.filter(n => n.type === 'consumption').map(node => (
            <div 
              key={node.id} 
              className={cn(
                "p-3 rounded-lg border shadow-sm backdrop-blur-sm transition-all",
                getNodeColor(node.type, node.status)
              )}
            >
              <div className="text-sm font-medium">{node.label}</div>
              <div className="text-lg font-semibold flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full animate-pulse bg-energy-purple"></div>
                {node.power.toFixed(1)} kW
              </div>
            </div>
          ))}
        </div>
        
        {/* Energy flow lines - enhanced with animated gradient flows */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(14, 165, 233, 0)">
                <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="rgba(14, 165, 233, 0.3)">
                <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="rgba(14, 165, 233, 0)">
                <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          
          {/* Solar to Battery */}
          <path 
            d="M145,70 C200,70 200,150 260,150" 
            fill="none" 
            stroke="url(#flowGradient)" 
            strokeWidth="3" 
            strokeDasharray="5,5"
          />
          
          {/* Solar to Building */}
          <path 
            d="M145,70 C250,70 350,70 450,70" 
            fill="none" 
            stroke="url(#flowGradient)" 
            strokeWidth="3" 
            strokeDasharray="5,5"
          />
          
          {/* Wind to Building */}
          <path 
            d="M145,150 C250,150 350,150 450,150" 
            fill="none" 
            stroke="url(#flowGradient)" 
            strokeWidth="3" 
            strokeDasharray="5,5"
          />
          
          {/* Wind to Battery */}
          <path 
            d="M145,150 C180,150 220,150 260,150" 
            fill="none" 
            stroke="url(#flowGradient)" 
            strokeWidth="3" 
            strokeDasharray="5,5"
          />
          
          {/* Grid to Building */}
          <path 
            d="M145,230 C250,230 350,230 450,230" 
            fill="none" 
            stroke="url(#flowGradient)" 
            strokeWidth="3" 
            strokeDasharray="5,5"
          />
          
          {/* Battery to EV */}
          <path 
            d="M330,180 C380,200 420,230 450,230" 
            fill="none" 
            stroke="url(#flowGradient)" 
            strokeWidth="3" 
            strokeDasharray="5,5"
          />
        </svg>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400">Total Generation</div>
          <div className="text-xl font-medium text-energy-green">
            {(nodes.filter(n => n.type === 'source').reduce((sum, node) => sum + node.power, 0)).toFixed(1)} kW
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400">Storage Capacity</div>
          <div className="text-xl font-medium text-energy-blue">
            {(nodes.find(n => n.id === 'battery')?.power || 0).toFixed(1)} kW
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400">Total Consumption</div>
          <div className="text-xl font-medium text-energy-purple">
            {(nodes.filter(n => n.type === 'consumption').reduce((sum, node) => sum + node.power, 0)).toFixed(1)} kW
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyFlowChart;
