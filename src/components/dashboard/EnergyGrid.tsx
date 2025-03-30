
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Battery, Home, Zap, Wind, Cable, Laptop } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';

interface EnergyGridProps {
  solarOutput?: number;
  windOutput?: number;
  batteryLevel?: number;
  homeConsumption?: number;
  evConsumption?: number;
  deviceConsumption?: number;
  gridConnection?: 'import' | 'export' | 'disconnected';
}

interface EnergyData {
  solarOutput: number;
  windOutput: number;
  batteryLevel: number;
  homeConsumption: number;
  evConsumption: number;
  deviceConsumption: number;
  gridConnection: 'import' | 'export' | 'disconnected';
  timestamp: string;
}

// Function to fetch energy data from API
const fetchEnergyData = async (): Promise<EnergyData> => {
  try {
    const response = await axios.get('/api/energy-flow');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch energy data:', error);
    // Return fallback data
    return {
      solarOutput: 4.2,
      windOutput: 1.5,
      batteryLevel: 75,
      homeConsumption: 2.7,
      evConsumption: 0,
      deviceConsumption: 1.2,
      gridConnection: 'export',
      timestamp: new Date().toISOString()
    };
  }
};

const EnergyGrid: React.FC<EnergyGridProps> = (props) => {
  // Query for fetching real-time energy data
  const { data, isLoading, error } = useQuery({
    queryKey: ['energy-flow'],
    queryFn: fetchEnergyData,
    refetchInterval: 15000, // Refresh every 15 seconds
    refetchOnWindowFocus: true,
  });

  // Use either the passed props or the data from API
  const {
    solarOutput = props.solarOutput || (data ? data.solarOutput : 0),
    windOutput = props.windOutput || (data ? data.windOutput : 0),
    batteryLevel = props.batteryLevel || (data ? data.batteryLevel : 50),
    homeConsumption = props.homeConsumption || (data ? data.homeConsumption : 0),
    evConsumption = props.evConsumption || (data ? data.evConsumption : 0),
    deviceConsumption = props.deviceConsumption || (data ? data.deviceConsumption : 0),
    gridConnection = props.gridConnection || (data ? data.gridConnection : 'disconnected')
  } = data || props;

  // Animation for energy flow lines (would be implemented with CSS)
  const [animationRunning, setAnimationRunning] = useState(true);

  // Toggle animation on click (could be used for pausing/resuming the visualization)
  const toggleAnimation = () => {
    setAnimationRunning(!animationRunning);
  };

  // This effect could be used to adjust animation speed based on flow rates
  useEffect(() => {
    // Implementation would go here
  }, [solarOutput, windOutput, homeConsumption, evConsumption, deviceConsumption, gridConnection]);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 dark:from-slate-950 dark:to-slate-900 border-slate-700/50 dark:border-slate-800/50 shadow-lg">
      <div className="absolute inset-0 bg-grid-white/5 dark:bg-grid-white/3 [mask-image:linear-gradient(to_bottom_right,white,transparent,white)]"></div>
      <CardContent className="p-6 relative">
        <div className="relative h-[300px]">
          {/* Top status indicators */}
          <div className="absolute top-0 left-0 right-0 flex justify-between px-4">
            <div className="flex items-center space-x-1 text-sm text-slate-300 bg-slate-800/50 backdrop-blur-md px-3 py-1 rounded-full shadow-inner">
              <Zap className="h-4 w-4 text-green-400 drop-shadow-glow-green" />
              <span className="font-semibold text-white">{(solarOutput + windOutput).toFixed(1)} kW</span>
              <span className="text-slate-400">Generation</span>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-slate-300 bg-slate-800/50 backdrop-blur-md px-3 py-1 rounded-full shadow-inner">
              <Home className="h-4 w-4 text-blue-400 drop-shadow-glow-blue" />
              <span className="font-semibold text-white">{(homeConsumption + evConsumption + deviceConsumption).toFixed(1)} kW</span>
              <span className="text-slate-400">Consumption</span>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-slate-300 bg-slate-800/50 backdrop-blur-md px-3 py-1 rounded-full shadow-inner">
              <Battery className="h-4 w-4 text-purple-400 drop-shadow-glow-purple" />
              <span className="font-semibold text-white">{batteryLevel}%</span>
              <span className="text-slate-400">Battery</span>
            </div>
          </div>

          {/* Energy sources nodes */}
          <div className="absolute left-4 top-16">
            <div className="p-3 bg-gradient-to-br from-yellow-900/50 to-yellow-950/80 rounded-lg border border-yellow-700/30 backdrop-blur-sm shadow-lg hover-scale">
              <div className="flex flex-col items-center">
                <div className="mb-1 p-2 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-inner flex items-center justify-center animate-pulse-slow">
                  <Zap className="h-6 w-6 text-yellow-400 drop-shadow-glow-yellow" />
                </div>
                <div className="text-sm font-medium text-slate-200">Solar</div>
                <div className="text-xl font-bold text-white">{solarOutput} kW</div>
              </div>
            </div>
            
            <div className="p-3 mt-8 bg-gradient-to-br from-blue-900/50 to-blue-950/80 rounded-lg border border-blue-700/30 backdrop-blur-sm shadow-lg hover-scale">
              <div className="flex flex-col items-center">
                <div className="mb-1 p-2 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-inner flex items-center justify-center animate-pulse-slow">
                  <Wind className="h-6 w-6 text-blue-400 drop-shadow-glow-blue" />
                </div>
                <div className="text-sm font-medium text-slate-200">Wind</div>
                <div className="text-xl font-bold text-white">{windOutput} kW</div>
              </div>
            </div>
          </div>

          {/* Battery storage node */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="p-3 bg-gradient-to-br from-purple-900/50 to-purple-950/80 rounded-lg border border-purple-700/30 backdrop-blur-sm shadow-lg hover-scale">
              <div className="flex flex-col items-center">
                <div className="mb-1 p-2 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-inner flex items-center justify-center animate-pulse-slow">
                  <Battery className="h-6 w-6 text-purple-400 drop-shadow-glow-purple" />
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
            <div className="p-3 bg-gradient-to-br from-green-900/50 to-green-950/80 rounded-lg border border-green-700/30 backdrop-blur-sm shadow-lg hover-scale">
              <div className="flex flex-col items-center">
                <div className="mb-1 p-2 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-inner flex items-center justify-center animate-pulse-slow">
                  <Home className="h-6 w-6 text-green-400 drop-shadow-glow-green" />
                </div>
                <div className="text-sm font-medium text-slate-200">Home</div>
                <div className="text-xl font-bold text-white">{homeConsumption} kW</div>
              </div>
            </div>
            
            <div className="p-3 mt-4 bg-gradient-to-br from-slate-800/50 to-slate-900/80 rounded-lg border border-slate-700/30 backdrop-blur-sm shadow-lg hover-scale">
              <div className="flex flex-col items-center">
                <div className="mb-1 p-2 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-inner flex items-center justify-center animate-pulse-slow">
                  <Laptop className="h-6 w-6 text-slate-400" />
                </div>
                <div className="text-sm font-medium text-slate-200">Devices</div>
                <div className="text-xl font-bold text-white">{deviceConsumption} kW</div>
              </div>
            </div>

            {evConsumption > 0 && (
              <div className="p-3 mt-4 bg-gradient-to-br from-blue-900/50 to-blue-950/80 rounded-lg border border-blue-700/30 backdrop-blur-sm shadow-lg hover-scale">
                <div className="flex flex-col items-center">
                  <div className="mb-1 p-2 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-inner flex items-center justify-center animate-pulse-slow">
                    <Cable className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-sm font-medium text-slate-200">EV Charger</div>
                  <div className="text-xl font-bold text-white">{evConsumption} kW</div>
                </div>
              </div>
            )}
          </div>

          {/* Grid connection status */}
          <div className="absolute left-4 bottom-4">
            <div className="bg-slate-800/60 backdrop-blur-sm px-3 py-1 rounded-md text-sm border border-slate-700/30">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  gridConnection === 'disconnected' ? 'bg-gray-500' : 
                  gridConnection === 'import' ? 'bg-blue-500 animate-pulse' : 
                  'bg-green-500 animate-pulse'
                }`}></div>
                <span className="text-slate-300">Grid: {
                  gridConnection === 'disconnected' ? 'Disconnected' : 
                  gridConnection === 'import' ? 'Importing' : 
                  'Exporting'
                }</span>
              </div>
            </div>
          </div>

          {/* System status indicator */}
          <div className="absolute bottom-0 right-4">
            <div className="bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs shadow-sm border border-slate-700/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-slate-300">System Active</span>
              <span className="text-slate-500 ml-1">
                • Updated {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Energy flow lines would be implemented with SVG paths and animations */}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyGrid;
