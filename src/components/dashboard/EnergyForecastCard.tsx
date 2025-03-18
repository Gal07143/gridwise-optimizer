
import React from 'react';
import { CloudSun, LineChart, Zap } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis,
  YAxis 
} from 'recharts';

// Mock data for energy forecasting
const forecastData = [
  { hour: '00:00', generation: 10, consumption: 35, net: -25 },
  { hour: '03:00', generation: 5, consumption: 30, net: -25 },
  { hour: '06:00', generation: 20, consumption: 40, net: -20 },
  { hour: '09:00', generation: 95, consumption: 80, net: 15 },
  { hour: '12:00', generation: 120, consumption: 85, net: 35 },
  { hour: '15:00', generation: 110, consumption: 90, net: 20 },
  { hour: '18:00', generation: 60, consumption: 105, net: -45 },
  { hour: '21:00', generation: 20, consumption: 70, net: -50 },
  { hour: '24:00', generation: 15, consumption: 40, net: -25 },
];

const weatherConditions = [
  { hour: '00:00', condition: 'clear', temp: 18.2, windSpeed: 8.0 },
  { hour: '03:00', condition: 'clear', temp: 17.1, windSpeed: 6.5 },
  { hour: '06:00', condition: 'partlyCloudy', temp: 16.8, windSpeed: 8.2 },
  { hour: '09:00', condition: 'sunny', temp: 20.5, windSpeed: 10.4 },
  { hour: '12:00', condition: 'sunny', temp: 24.7, windSpeed: 12.8 },
  { hour: '15:00', condition: 'partlyCloudy', temp: 25.3, windSpeed: 11.2 },
  { hour: '18:00', condition: 'cloudy', temp: 23.8, windSpeed: 9.6 },
  { hour: '21:00', condition: 'cloudy', temp: 21.4, windSpeed: 7.8 },
  { hour: '24:00', condition: 'clear', temp: 19.5, windSpeed: 6.3 },
];

interface EnergyForecastCardProps {
  className?: string;
}

const EnergyForecastCard = ({ className }: EnergyForecastCardProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const hourData = weatherConditions.find(item => item.hour === label);
      
      return (
        <div className="bg-background/90 border border-border p-2 rounded-md shadow-md text-xs">
          <p className="font-semibold mb-1">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} kW`}
            </p>
          ))}
          {hourData && (
            <div className="mt-2 pt-2 border-t border-border/50">
              <p className="text-muted-foreground">Temp: {hourData.temp}°C</p>
              <p className="text-muted-foreground">Wind: {hourData.windSpeed} m/s</p>
            </div>
          )}
        </div>
      );
    }
  
    return null;
  };

  // Calculate forecast metrics
  const totalGeneration = forecastData.reduce((sum, item) => sum + item.generation, 0);
  const totalConsumption = forecastData.reduce((sum, item) => sum + item.consumption, 0);
  const netEnergy = totalGeneration - totalConsumption;
  const peakGeneration = Math.max(...forecastData.map(item => item.generation));
  const peakConsumption = Math.max(...forecastData.map(item => item.consumption));

  return (
    <DashboardCard
      title="24-Hour Energy Forecast"
      icon={<LineChart size={18} />}
      className={className}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-2 mb-4">
        <div className="glass-panel p-2 rounded-lg">
          <div className="text-xs text-muted-foreground">Forecast Production</div>
          <div className="text-lg font-semibold">{totalGeneration} kWh</div>
        </div>
        <div className="glass-panel p-2 rounded-lg">
          <div className="text-xs text-muted-foreground">Forecast Consumption</div>
          <div className="text-lg font-semibold">{totalConsumption} kWh</div>
        </div>
        <div className="glass-panel p-2 rounded-lg">
          <div className="text-xs text-muted-foreground">Net Energy</div>
          <div className={`text-lg font-semibold ${netEnergy >= 0 ? 'text-energy-green' : 'text-energy-red'}`}>
            {netEnergy > 0 ? '+' : ''}{netEnergy} kWh
          </div>
        </div>
        <div className="glass-panel p-2 rounded-lg">
          <div className="text-xs text-muted-foreground">Peak Times</div>
          <div className="flex justify-between">
            <div className="text-xs">
              <span className="text-energy-green">Gen: </span>
              <span className="font-medium">{peakGeneration} kW</span>
            </div>
            <div className="text-xs">
              <span className="text-energy-purple">Use: </span>
              <span className="font-medium">{peakConsumption} kW</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={forecastData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(45, 211, 111, 0.8)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="rgba(45, 211, 111, 0.1)" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(122, 90, 248, 0.8)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="rgba(122, 90, 248, 0.1)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="hour" 
              tick={{ fontSize: 10 }} 
              tickLine={false}
              axisLine={{ stroke: 'rgba(100, 116, 139, 0.2)' }}
            />
            <YAxis 
              tick={{ fontSize: 10 }} 
              tickLine={false}
              axisLine={{ stroke: 'rgba(100, 116, 139, 0.2)' }}
              label={{ value: 'kW', angle: -90, position: 'insideLeft', fontSize: 10, dy: 50 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="generation" 
              name="Generation"
              stroke="rgba(45, 211, 111, 1)" 
              fillOpacity={1} 
              fill="url(#colorGen)" 
            />
            <Area 
              type="monotone" 
              dataKey="consumption" 
              name="Consumption"
              stroke="rgba(122, 90, 248, 1)" 
              fillOpacity={1} 
              fill="url(#colorCons)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <div className="flex items-center">
          <CloudSun size={14} className="mr-1" />
          <span>Weather data updated: 06:30 AM</span>
        </div>
        <div className="flex items-center">
          <Zap size={14} className="mr-1" />
          <span>AI forecast model: 94.2% accuracy</span>
        </div>
      </div>
    </DashboardCard>
  );
};

export default EnergyForecastCard;
