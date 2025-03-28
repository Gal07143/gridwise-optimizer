
import React, { useState, useEffect } from 'react';
import { Building2, Battery, CarFront, Sun, TowerControl } from 'lucide-react';
import { fetchEnergyFlowData } from '@/services/energyFlowService';
import { Card, CardContent } from '@/components/ui/card';
import { useTelemetryHistory } from '@/hooks/useTelemetryHistory';
import { useDevices } from '@/hooks/useDevices';
import { toast } from 'sonner';

interface MinimalistEnergyFlowProps {
  siteId?: string;
  className?: string;
}

const MinimalistEnergyFlow: React.FC<MinimalistEnergyFlowProps> = ({ 
  siteId = "default-site",
  className 
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    solar: { value: 0, unit: 'W', status: 'inactive' },
    grid: { value: 0, unit: 'W', status: 'inactive' },
    battery: { value: 0, unit: 'W', percentage: 0, status: 'inactive' },
    house: { value: 0, unit: 'W', status: 'inactive' },
    ev: { value: 0, unit: 'kW', status: 'inactive', mode: 'Off' }
  });

  // Fetch devices for the current site
  const { devices, loading: loadingDevices } = useDevices(siteId);
  
  // Effect to load the real device data
  useEffect(() => {
    const loadRealTimeData = async () => {
      try {
        setLoading(true);
        
        if (loadingDevices || !devices.length) {
          return; // Wait for devices to load
        }

        // Find specific device types
        const solarDevice = devices.find(d => d.type === 'solar');
        const batteryDevice = devices.find(d => d.type === 'battery');
        const gridDevice = devices.find(d => d.type === 'grid');
        const evDevice = devices.find(d => d.type === 'ev_charger');
        
        // Fallback to energy flow service if we don't have the right devices
        if (!solarDevice && !batteryDevice && !gridDevice) {
          const flowData = await fetchEnergyFlowData(siteId);
          
          // Map the API data to our component structure
          const updatedData = { ...data };
          
          // Extract data from nodes
          const solarNode = flowData.nodes.find(n => n.deviceType === 'solar');
          const batteryNode = flowData.nodes.find(n => n.deviceType === 'battery');
          const gridNode = flowData.nodes.find(n => n.deviceType === 'grid');
          const evNode = flowData.nodes.find(n => n.deviceType === 'ev');
          
          // House consumption is the total consumption minus EV if present
          const homeConsumption = flowData.totalConsumption - (evNode?.power || 0);
          
          if (solarNode) {
            updatedData.solar = { 
              value: Math.round(solarNode.power * 1000), // Convert kW to W
              unit: 'W',
              status: solarNode.status
            };
          }
          
          if (gridNode) {
            updatedData.grid = { 
              value: Math.round(gridNode.power * 1000), 
              unit: 'W',
              status: flowData.gridDependencyRate > 50 ? 'import' : 'export'
            };
          }
          
          if (batteryNode) {
            updatedData.battery = { 
              value: Math.round(batteryNode.power * 1000), 
              unit: 'W',
              percentage: batteryNode.batteryLevel || 0,
              status: batteryNode.power > 0 ? 'discharging' : (batteryNode.power < 0 ? 'charging' : 'idle')
            };
          }
          
          updatedData.house = { 
            value: Math.round(homeConsumption * 1000), 
            unit: 'W',
            status: 'consuming'
          };
          
          if (evNode) {
            updatedData.ev = { 
              value: evNode.power.toFixed(1), 
              unit: 'kW',
              status: evNode.power > 0 ? 'charging' : 'idle',
              mode: flowData.selfConsumptionRate > 70 ? 'Solar Mode' : 'Grid Mode'
            };
          }
          
          setData(updatedData);
          setLoading(false);
          return;
        }
        
        // Get latest telemetry for each device
        const newData = { ...data };
        
        // Calculate house consumption (total of all consumption devices)
        let houseConsumption = 0;
        
        // Process solar data
        if (solarDevice) {
          try {
            // Using device service to get latest reading
            const solarReading = await fetchDeviceData(solarDevice.id);
            if (solarReading) {
              const solarValue = Math.round(solarReading.power || 0);
              newData.solar = {
                value: solarValue,
                unit: 'W',
                status: solarValue > 10 ? 'active' : 'inactive'
              };
            }
          } catch (err) {
            console.error("Error fetching solar data:", err);
          }
        }
        
        // Process battery data
        if (batteryDevice) {
          try {
            const batteryReading = await fetchDeviceData(batteryDevice.id);
            if (batteryReading) {
              const batteryValue = Math.round(batteryReading.power || 0);
              const batteryStatus = 
                batteryValue > 10 ? 'discharging' : 
                (batteryValue < -10 ? 'charging' : 'inactive');
              
              newData.battery = {
                value: Math.abs(batteryValue),
                unit: 'W',
                percentage: batteryReading.state_of_charge || 0,
                status: batteryStatus
              };
            }
          } catch (err) {
            console.error("Error fetching battery data:", err);
          }
        }
        
        // Process grid data
        if (gridDevice) {
          try {
            const gridReading = await fetchDeviceData(gridDevice.id);
            if (gridReading) {
              const gridValue = Math.round(gridReading.power || 0);
              const gridStatus = gridValue >= 0 ? 'import' : 'export';
              
              newData.grid = {
                value: Math.abs(gridValue),
                unit: 'W',
                status: gridStatus
              };
              
              // Add to house consumption if importing
              if (gridStatus === 'import') {
                houseConsumption += Math.abs(gridValue);
              }
            }
          } catch (err) {
            console.error("Error fetching grid data:", err);
          }
        }
        
        // Process EV charger data
        if (evDevice) {
          try {
            const evReading = await fetchDeviceData(evDevice.id);
            if (evReading) {
              const evValue = parseFloat((evReading.power / 1000).toFixed(1)) || 0; // Convert to kW
              
              newData.ev = {
                value: evValue,
                unit: 'kW',
                status: evValue > 0.1 ? 'charging' : 'idle',
                mode: newData.solar.value > (evValue * 1000) ? 'Solar Mode' : 'Grid Mode'
              };
              
              // Add to house consumption
              houseConsumption += (evValue * 1000);
            }
          } catch (err) {
            console.error("Error fetching EV data:", err);
          }
        }
        
        // Update house consumption
        // If it's too low, compute from solar + grid - battery
        if (houseConsumption < 10) {
          houseConsumption = 
            newData.solar.value + 
            (newData.grid.status === 'import' ? newData.grid.value : 0) - 
            (newData.battery.status === 'discharging' ? newData.battery.value : 0);
        }
        
        newData.house = {
          value: Math.max(0, Math.round(houseConsumption)),
          unit: 'W',
          status: 'consuming'
        };
        
        setData(newData);
      } catch (error) {
        console.error("Error loading real-time energy flow data:", error);
        toast.error('Could not load energy flow data');
      } finally {
        setLoading(false);
      }
    };
    
    loadRealTimeData();
    
    // Set up polling interval for real-time updates
    const intervalId = setInterval(loadRealTimeData, 15000); // Update every 15 seconds
    
    return () => clearInterval(intervalId);
  }, [siteId, devices, loadingDevices]);

  // Helper function to fetch device data
  const fetchDeviceData = async (deviceId: string) => {
    try {
      // First attempt to get from the telemetry service
      const response = await fetch(`/api/devices/${deviceId}/telemetry/latest`);
      if (response.ok) {
        return await response.json();
      }
      
      // Fall back to our device readings service
      const readings = await fetch(`/api/devices/${deviceId}/readings?limit=1`);
      if (readings.ok) {
        const data = await readings.json();
        return data[0];
      }
      
      throw new Error('Could not fetch device data');
    } catch (err) {
      console.error(`Error fetching data for device ${deviceId}:`, err);
      return null;
    }
  };

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
              <Sun className={`w-10 h-10 ${data.solar.status === 'active' ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-400'} mb-2`} />
              <div className="text-sm text-gray-500 dark:text-gray-400">Solar</div>
              <div className={`text-2xl font-bold ${data.solar.value > 0 ? 'text-green-500' : 'text-gray-400'} mt-1`}>
                {data.solar.value} {data.solar.unit}
              </div>
            </div>
          </div>
          
          {/* Grid - Top Right */}
          <div className="absolute right-[15%] top-[25%]">
            <div className="flex flex-col items-center">
              <TowerControl className={`w-10 h-10 ${data.grid.status === 'import' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'} mb-2`} />
              <div className="text-sm text-gray-500 dark:text-gray-400">Grid {data.grid.status}</div>
              <div className={`text-2xl font-bold ${data.grid.status === 'import' ? 'text-yellow-500' : 'text-green-500'} mt-1`}>
                {data.grid.value} {data.grid.unit}
              </div>
            </div>
          </div>
          
          {/* Battery - Bottom Left */}
          <div className="absolute left-[15%] bottom-[25%]">
            <div className="flex flex-col items-center">
              <Battery className={`w-10 h-10 ${data.battery.status !== 'inactive' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'} mb-2`} />
              <div className="text-sm text-gray-500 dark:text-gray-400">Battery</div>
              <div className={`text-2xl font-bold ${data.battery.status === 'discharging' ? 'text-green-500' : (data.battery.status === 'charging' ? 'text-blue-500' : 'text-gray-400')} mt-1`}>
                {data.battery.value} {data.battery.unit}
              </div>
              <div className="text-sm font-medium text-green-500">{data.battery.percentage}%</div>
            </div>
          </div>
          
          {/* EV - Bottom Right */}
          <div className="absolute right-[15%] bottom-[25%]">
            <div className="flex flex-col items-center">
              <CarFront className={`w-10 h-10 ${data.ev.status === 'charging' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'} mb-2`} />
              <div className="text-sm text-gray-500 dark:text-gray-400">EV</div>
              <div className={`text-2xl font-bold ${data.ev.status === 'charging' ? 'text-yellow-500' : 'text-gray-400'} mt-1`}>
                {data.ev.value} {data.ev.unit}
              </div>
              {data.ev.status === 'charging' && (
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full ${data.ev.mode.includes('Solar') ? 'bg-green-500' : 'bg-yellow-500'} mr-1`}></div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Charging in {data.ev.mode}</div>
                </div>
              )}
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
            {/* Solar to House - Green when active */}
            <path
              d="M200,100 H400 V200"
              stroke={data.solar.value > 0 ? "#10B981" : "#e5e7eb"}
              strokeWidth="2"
              fill="none"
            />
            
            {/* Grid to House - Yellow when importing */}
            <path
              d="M600,100 H400 V200"
              stroke={data.grid.status === 'import' ? "#F59E0B" : "#e5e7eb"}
              strokeWidth="2"
              fill="none"
            />
            
            {/* Battery to House - Green when discharging */}
            <path
              d="M200,300 H400 V200"
              stroke={data.battery.status === 'discharging' ? "#10B981" : "#e5e7eb"}
              strokeWidth="2"
              fill="none"
            />
            
            {/* House to EV - Yellow when charging */}
            <path
              d="M400,200 V300 H600"
              stroke={data.ev.status === 'charging' ? "#F59E0B" : "#e5e7eb"}
              strokeWidth="2"
              fill="none"
            />
            
            {/* House to Consumption - Red for power consumption */}
            <path
              d="M400,200 H550"
              stroke={data.house.value > 0 ? "#EF4444" : "#e5e7eb"}
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
