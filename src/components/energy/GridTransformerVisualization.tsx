
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Activity } from 'lucide-react';

interface GridComponentProps {
  id: string;
  title: string;
  status: 'normal' | 'warning' | 'error' | 'offline';
  value?: string;
  load?: number; // 0-100
}

interface GridConnectionProps {
  from: string;
  to: string;
  active: boolean;
  load?: number; // 0-100
  direction?: 'down' | 'right' | 'left';
}

const GridComponent: React.FC<GridComponentProps> = ({
  title,
  status,
  value,
  load
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'normal': return 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400';
      case 'warning': return 'bg-yellow-100 border-yellow-500 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-400';
      case 'error': return 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400';
      case 'offline': return 'bg-gray-100 border-gray-500 text-gray-700 dark:bg-gray-900/30 dark:border-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${getStatusColor()} transition-all hover:scale-105 text-center shadow-sm`}>
      <h3 className="text-sm font-medium">{title}</h3>
      {value && <p className="text-lg font-bold mt-1">{value}</p>}
      {typeof load === 'number' && (
        <div className="mt-2">
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full ${status === 'normal' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${load}%` }}></div>
          </div>
          <div className="text-xs mt-1 font-medium">{load}% load</div>
        </div>
      )}
    </div>
  );
};

const GridConnection: React.FC<GridConnectionProps> = ({
  active,
  load = 50,
  direction = 'down'
}) => {
  const getLineDirection = () => {
    switch (direction) {
      case 'down': return 'h-16 border-l-2 mx-auto';
      case 'right': return 'w-16 border-t-2';
      case 'left': return 'w-16 border-t-2';
    }
  };

  const getLoadColor = () => {
    if (!active) return 'border-gray-300 dark:border-gray-600';
    if (load > 80) return 'border-red-500';
    if (load > 60) return 'border-yellow-500';
    return 'border-blue-500';
  };

  return (
    <div className={`${getLineDirection()} ${getLoadColor()} relative flex items-center justify-center`}>
      {active && (
        <div className="absolute flex items-center justify-center">
          <div className={`w-2 h-2 rounded-full ${load > 80 ? 'bg-red-500' : load > 60 ? 'bg-yellow-500' : 'bg-blue-500'} animate-pulse`}></div>
        </div>
      )}
    </div>
  );
};

interface GridTransformerVisualizationProps {
  className?: string;
}

const GridTransformerVisualization: React.FC<GridTransformerVisualizationProps> = ({
  className
}) => {
  // Sample state for the components
  const components = {
    transformer: { status: 'normal' as const, load: 65 },
    mainFuse: { status: 'normal' as const, load: 42 },
    gridMeter: { status: 'normal' as const, value: '37.2 kWh' },
    battery: { status: 'normal' as const, value: '76%' },
    solar: { status: 'normal' as const, value: '3.2 kW' },
    subFuse1: { status: 'normal' as const, load: 35 },
    subFuse2: { status: 'warning' as const, load: 78 },
    subFuse3: { status: 'normal' as const, load: 22 },
    cluster1: { status: 'normal' as const, value: '2.1 kW' },
    cluster2: { status: 'warning' as const, value: '4.8 kW' },
    cluster3: { status: 'normal' as const, value: '1.2 kW' },
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Grid Transformer Visualization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center relative py-4">
          {/* Top tier - Grid connection */}
          <div className="mb-4 w-72">
            <GridComponent id="transformer" title="Transformer" status={components.transformer.status} load={components.transformer.load} />
          </div>
          
          <GridConnection from="transformer" to="mainFuse" active={true} load={components.transformer.load} />
          
          {/* Main fuse */}
          <div className="mb-4 w-72">
            <GridComponent id="mainFuse" title="Main Fuse" status={components.mainFuse.status} load={components.mainFuse.load} />
          </div>
          
          <GridConnection from="mainFuse" to="gridMeter" active={true} load={components.mainFuse.load} />
          
          {/* Grid meter */}
          <div className="mb-4 w-72">
            <GridComponent id="gridMeter" title="Grid Meter" status={components.gridMeter.status} value={components.gridMeter.value} />
          </div>
          
          <GridConnection from="gridMeter" to="central" active={true} load={60} />
          
          {/* Central hub with battery and solar */}
          <div className="mb-4 grid grid-cols-3 gap-4 w-full max-w-2xl">
            <div>
              <GridComponent id="battery" title="Battery" status={components.battery.status} value={components.battery.value} />
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-500 dark:border-blue-700 flex items-center justify-center">
                <Zap className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>
              
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                <GridConnection from="central" to="battery" active={true} load={40} direction="left" />
              </div>
              
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <GridConnection from="central" to="solar" active={true} load={30} direction="right" />
              </div>
            </div>
            <div>
              <GridComponent id="solar" title="Solar PV" status={components.solar.status} value={components.solar.value} />
            </div>
          </div>
          
          <GridConnection from="central" to="subfuses" active={true} load={55} />
          
          {/* Sub fuses */}
          <div className="mb-4 grid grid-cols-3 gap-8 w-full max-w-2xl">
            <GridComponent id="subFuse1" title="Sub-Fuse 1" status={components.subFuse1.status} load={components.subFuse1.load} />
            <GridComponent id="subFuse2" title="Sub-Fuse 2" status={components.subFuse2.status} load={components.subFuse2.load} />
            <GridComponent id="subFuse3" title="Sub-Fuse 3" status={components.subFuse3.status} load={components.subFuse3.load} />
          </div>
          
          {/* Control loops and connections - Show with colored borders */}
          <div className="w-full max-w-2xl relative mt-2">
            <div className="absolute border-2 border-teal-500 rounded-lg" style={{
              top: '-240px',
              left: '10%',
              width: '80%',
              height: '220px',
              borderBottomWidth: 0,
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              zIndex: -1
            }}></div>
            
            <div className="absolute border-2 border-emerald-500 rounded-lg" style={{
              top: '-180px',
              left: '5%',
              height: '300px',
              width: '20%',
              borderTopWidth: 0,
              borderRightWidth: 0,
              borderBottomLeftRadius: '20px',
              zIndex: -1
            }}></div>
            
            <div className="absolute border-2 border-cyan-500 rounded-lg" style={{
              top: '-180px',
              right: '5%',
              height: '300px',
              width: '20%', 
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderBottomRightRadius: '20px',
              zIndex: -1
            }}></div>
            
            <div className="grid grid-cols-3 gap-8">
              <div>
                <GridConnection from="subFuse1" to="cluster1" active={true} load={components.subFuse1.load} />
                <GridComponent id="cluster1" title="Cluster 1" status={components.cluster1.status} value={components.cluster1.value} />
              </div>
              <div>
                <GridConnection from="subFuse2" to="cluster2" active={true} load={components.subFuse2.load} />
                <GridComponent id="cluster2" title="Cluster 2" status={components.cluster2.status} value={components.cluster2.value} />
              </div>
              <div>
                <GridConnection from="subFuse3" to="cluster3" active={true} load={components.subFuse3.load} />
                <GridComponent id="cluster3" title="Cluster 3" status={components.cluster3.status} value={components.cluster3.value} />
              </div>
            </div>
            
            {/* Control loop labels */}
            <div className="absolute text-xs font-medium text-teal-600 dark:text-teal-400" style={{ top: '-230px', left: '5px' }}>
              Top tier<br />control loop
            </div>
            
            <div className="absolute text-xs font-medium text-emerald-600 dark:text-emerald-400" style={{ top: '-90px', left: '5px' }}>
              First tier<br />control loop
            </div>
            
            <div className="absolute text-xs font-medium text-cyan-600 dark:text-cyan-400" style={{ top: '-90px', right: '5px' }}>
              Second tier<br />control loop
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GridTransformerVisualization;
