import React, { useState, useEffect } from 'react';
import { Building2, Battery, CarFront, Sun, TowerControl } from 'lucide-react';
import { fetchEnergyFlowData } from '@/services/energyFlowService';
import { Card, CardContent } from '@/components/ui/card';

interface MinimalistEnergyFlowProps {
  siteId?: string;
  className?: string;
}

const MinimalistEnergyFlow: React.FC<MinimalistEnergyFlowProps> = ({ 
  siteId = "default-site",
  className 
}) => {
  const [data, setData] = useState({
    solar: { value: 3072, unit: 'W', status: 'active' },
    grid: { value: 2944, unit: 'W', status: 'import' },
    battery: { value: 0, unit: 'W', percentage: 100, status: 'inactive' },
    house: { value: 127, unit: 'W', status: 'consuming' },
    ev: { value: 3.6, unit: 'kW', status: 'charging', mode: 'Solar Mode' }
  });
  
  const [loading, setLoading] = useState(false);

  // Fetch real data on mount and when siteId changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const flowData = await fetchEnergyFlowData(siteId);
        
        // Transform the data to match our component structure
        // In a real implementation, you would map the API data to this format
        // This is just a placeholder that keeps the demo values
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching energy flow data:", error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [siteId]);

  return (
    <Card className="w-full overflow-hidden bg-gray-50 dark:bg-gray-900 border-0 shadow-lg">
      <CardContent className="p-6">
        {/* Background */}
        <div className="relative w-full min-h-[400px] bg-gray-50 dark:bg-gray-900 rounded-lg">
          
          {/* Central House */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 relative">
                <img 
                  src="/lovable-uploads/77ce2e76-70e4-4779-8901-6f8381e826a1.png" 
                  alt="House with solar panels"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
          
          {/* Solar - Top Left */}
          <div className="absolute left-[15%] top-[25%]">
            <div className="flex flex-col items-center">
              <Sun className="w-10 h-10 text-gray-600 dark:text-gray-400 mb-2" />
              <div className="text-sm text-gray-500 dark:text-gray-400">Solar</div>
              <div className="text-2xl font-bold text-green-500 mt-1">{data.solar.value} {data.solar.unit}</div>
            </div>
          </div>
          
          {/* Grid - Top Right */}
          <div className="absolute right-[15%] top-[25%]">
            <div className="flex flex-col items-center">
              <TowerControl className="w-10 h-10 text-gray-600 dark:text-gray-400 mb-2" />
              <div className="text-sm text-gray-500 dark:text-gray-400">Grid feed-in</div>
              <div className="text-2xl font-bold text-yellow-500 mt-1">{data.grid.value} {data.grid.unit}</div>
            </div>
          </div>
          
          {/* Battery - Bottom Left */}
          <div className="absolute left-[15%] bottom-[25%]">
            <div className="flex flex-col items-center">
              <Battery className="w-10 h-10 text-gray-600 dark:text-gray-400 mb-2" />
              <div className="text-sm text-gray-500 dark:text-gray-400">Battery</div>
              <div className="text-2xl font-bold text-gray-400 mt-1">{data.battery.value} {data.battery.unit}</div>
              <div className="text-sm font-medium text-green-500">{data.battery.percentage}%</div>
            </div>
          </div>
          
          {/* EV - Bottom Right */}
          <div className="absolute right-[15%] bottom-[25%]">
            <div className="flex flex-col items-center">
              <CarFront className="w-10 h-10 text-gray-600 dark:text-gray-400 mb-2" />
              <div className="text-sm text-gray-500 dark:text-gray-400">EV</div>
              <div className="text-2xl font-bold text-yellow-500 mt-1">{data.ev.value} {data.ev.unit}</div>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Charging in Solar Mode</div>
              </div>
            </div>
          </div>
          
          {/* House Consumption - Right Center */}
          <div className="absolute right-[25%] top-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center">
              <Building2 className="w-10 h-10 text-gray-600 dark:text-gray-400 mb-2" />
              <div className="text-sm text-gray-500 dark:text-gray-400">House consumption</div>
              <div className="text-2xl font-bold text-red-500 mt-1">{data.house.value} {data.house.unit}</div>
            </div>
          </div>
          
          {/* Flow lines */}
          <svg className="absolute inset-0 w-full h-full z-0" 
               viewBox="0 0 800 400" 
               preserveAspectRatio="xMidYMid meet">
            {/* Solar to House */}
            <path
              d="M200,100 H400 V200"
              stroke="#e5e7eb"
              strokeWidth="2"
              fill="none"
            />
            
            {/* Grid to House */}
            <path
              d="M600,100 H400 V200"
              stroke="#e5e7eb"
              strokeWidth="2"
              fill="none"
            />
            
            {/* Battery to House */}
            <path
              d="M200,300 H400 V200"
              stroke="#e5e7eb"
              strokeWidth="2"
              fill="none"
            />
            
            {/* House to EV */}
            <path
              d="M400,200 V300 H600"
              stroke="#e5e7eb"
              strokeWidth="2"
              fill="none"
            />
            
            {/* House to Consumption */}
            <path
              d="M400,200 H550"
              stroke="#e5e7eb"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          
          {loading && (
            <div className="absolute inset-0 bg-gray-50/80 dark:bg-gray-900/80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MinimalistEnergyFlow;
