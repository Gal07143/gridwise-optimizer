import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { Device, EnergyMetrics, ForecastData } from '@/types/device';

interface EnergyDashboardProps {
  devices: Device[];
}

export const EnergyDashboard: React.FC<EnergyDashboardProps> = ({ devices }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [energyData, setEnergyData] = useState<{
    consumption: number;
    production: number;
    gridImport: number;
    gridExport: number;
    batteryLevel: number;
  }>({
    consumption: 0,
    production: 0,
    gridImport: 0,
    gridExport: 0,
    batteryLevel: 0,
  });

  const [forecastData, setForecastData] = useState<ForecastData[]>([]);

  // Calculate total energy metrics from all devices
  const calculateEnergyMetrics = () => {
    const pvPanels = devices.filter(d => d.type === 'pv_panel');
    const batteries = devices.filter(d => d.type === 'battery');
    const smartMeters = devices.filter(d => d.type === 'smart_meter');

    const totalProduction = pvPanels.reduce((sum, panel) => 
      sum + (panel.currentMetrics?.currentPower || 0), 0);
    
    const batteryLevel = batteries.reduce((sum, battery) => 
      sum + (battery.currentMetrics?.currentPower || 0), 0);

    const gridMetrics = smartMeters.reduce((acc, meter) => ({
      import: acc.import + (meter.currentMetrics?.currentPower || 0),
      export: acc.export + (meter.currentMetrics?.currentPower || 0),
    }), { import: 0, export: 0 });

    setEnergyData({
      production: totalProduction,
      consumption: totalProduction + gridMetrics.import - gridMetrics.export,
      gridImport: gridMetrics.import,
      gridExport: gridMetrics.export,
      batteryLevel,
    });
  };

  useEffect(() => {
    calculateEnergyMetrics();
    // Set up polling interval
    const interval = setInterval(calculateEnergyMetrics, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [devices]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Energy Management Dashboard</h2>
      
      {/* Time Range Selector */}
      <div className="mb-6">
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value as '24h' | '7d' | '30d')}
          className="p-2 border rounded"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* Current Energy Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Current Production"
          value={energyData.production}
          unit="kW"
          trend={1.5}
        />
        <MetricCard
          title="Current Consumption"
          value={energyData.consumption}
          unit="kW"
          trend={-0.8}
        />
        <MetricCard
          title="Grid Exchange"
          value={energyData.gridImport - energyData.gridExport}
          unit="kW"
          trend={0.3}
        />
        <MetricCard
          title="Battery Level"
          value={energyData.batteryLevel}
          unit="%"
          trend={0}
        />
      </div>

      {/* Energy Flow Chart */}
      <div className="h-96 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(time) => format(new Date(time), 'HH:mm')}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="predictedPower"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  trend: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, trend }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="text-2xl font-bold">
      {value.toFixed(2)} {unit}
    </div>
    <div className={`text-sm ${trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
      {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}%
    </div>
  </div>
); 