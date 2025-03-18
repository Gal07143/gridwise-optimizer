
import React, { useEffect, useState } from 'react';
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
import { useSiteContext } from '@/contexts/SiteContext';
import { getSiteForecasts, getSiteForecastMetrics, generateSampleForecasts, insertEnergyForecasts } from '@/services/forecastService';
import { EnergyForecast } from '@/types/energy';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface EnergyForecastCardProps {
  className?: string;
  animationDelay?: string;
}

const EnergyForecastCard = ({ className, animationDelay }: EnergyForecastCardProps) => {
  const { selectedSite } = useSiteContext();
  const [hasForecastData, setHasForecastData] = useState(false);

  // Fetch forecasts for the selected site
  const { 
    data: forecasts, 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['forecasts', selectedSite?.id],
    queryFn: async () => {
      if (!selectedSite?.id) return [];
      const data = await getSiteForecasts(selectedSite.id);
      setHasForecastData(data.length > 0);
      return data;
    },
    enabled: !!selectedSite?.id,
  });

  // Fetch metrics for the selected site
  const { 
    data: metrics,
    isLoading: isLoadingMetrics
  } = useQuery({
    queryKey: ['forecast-metrics', selectedSite?.id],
    queryFn: async () => {
      if (!selectedSite?.id) return null;
      return await getSiteForecastMetrics(selectedSite.id);
    },
    enabled: !!selectedSite?.id,
  });

  // Generate sample forecasts if needed
  useEffect(() => {
    const checkAndGenerateSampleData = async () => {
      if (!selectedSite?.id || isLoading || hasForecastData) return;
      
      if (Array.isArray(forecasts) && forecasts.length === 0) {
        toast.info('Generating sample forecast data for demonstration');
        const sampleForecasts = generateSampleForecasts(selectedSite.id);
        const success = await insertEnergyForecasts(sampleForecasts);
        if (success) {
          refetch();
        }
      }
    };

    checkAndGenerateSampleData();
  }, [selectedSite?.id, forecasts, isLoading, hasForecastData, refetch]);

  // Process forecast data for the chart
  const processedData = React.useMemo(() => {
    if (!forecasts) return [];
    
    return forecasts.map(forecast => ({
      hour: format(new Date(forecast.forecast_time), 'HH:00'),
      generation: forecast.generation_forecast,
      consumption: forecast.consumption_forecast,
      net: forecast.generation_forecast - forecast.consumption_forecast,
      weather: forecast.weather_condition,
      temp: forecast.temperature,
      windSpeed: forecast.wind_speed
    }));
  }, [forecasts]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const hourData = payload[0]?.payload;
      
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
              <p className="text-muted-foreground">Temp: {hourData.temp ? `${hourData.temp}°C` : 'N/A'}</p>
              <p className="text-muted-foreground">Wind: {hourData.windSpeed ? `${hourData.windSpeed} m/s` : 'N/A'}</p>
            </div>
          )}
        </div>
      );
    }
  
    return null;
  };

  // Handle loading and error states
  if (isLoading || isLoadingMetrics) {
    return (
      <DashboardCard 
        title="24-Hour Energy Forecast" 
        icon={<LineChart size={18} />}
        className={className}
        style={animationDelay ? { animationDelay } : undefined}
      >
        <div className="flex justify-center items-center h-60">
          <p className="text-muted-foreground">Loading forecast data...</p>
        </div>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard 
        title="24-Hour Energy Forecast" 
        icon={<LineChart size={18} />}
        className={className}
        style={animationDelay ? { animationDelay } : undefined}
      >
        <div className="flex justify-center items-center h-60">
          <p className="text-red-500">Error loading forecast data</p>
        </div>
      </DashboardCard>
    );
  }

  // Calculate metrics or use the ones from the query
  const forecastMetrics = metrics || {
    totalGeneration: 0,
    totalConsumption: 0,
    netEnergy: 0,
    peakGeneration: 0,
    peakConsumption: 0,
    confidence: 0
  };

  return (
    <DashboardCard
      title="24-Hour Energy Forecast"
      icon={<LineChart size={18} />}
      className={className}
      style={animationDelay ? { animationDelay } : undefined}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-2 mb-4">
        <div className="glass-panel p-2 rounded-lg">
          <div className="text-xs text-muted-foreground">Forecast Production</div>
          <div className="text-lg font-semibold">{forecastMetrics.totalGeneration.toFixed(1)} kWh</div>
        </div>
        <div className="glass-panel p-2 rounded-lg">
          <div className="text-xs text-muted-foreground">Forecast Consumption</div>
          <div className="text-lg font-semibold">{forecastMetrics.totalConsumption.toFixed(1)} kWh</div>
        </div>
        <div className="glass-panel p-2 rounded-lg">
          <div className="text-xs text-muted-foreground">Net Energy</div>
          <div className={`text-lg font-semibold ${forecastMetrics.netEnergy >= 0 ? 'text-energy-green' : 'text-energy-red'}`}>
            {forecastMetrics.netEnergy > 0 ? '+' : ''}{forecastMetrics.netEnergy.toFixed(1)} kWh
          </div>
        </div>
        <div className="glass-panel p-2 rounded-lg">
          <div className="text-xs text-muted-foreground">Peak Times</div>
          <div className="flex justify-between">
            <div className="text-xs">
              <span className="text-energy-green">Gen: </span>
              <span className="font-medium">{forecastMetrics.peakGeneration.toFixed(1)} kW</span>
            </div>
            <div className="text-xs">
              <span className="text-energy-purple">Use: </span>
              <span className="font-medium">{forecastMetrics.peakConsumption.toFixed(1)} kW</span>
            </div>
          </div>
        </div>
      </div>
      
      {processedData.length > 0 ? (
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={processedData}
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
      ) : (
        <div className="flex justify-center items-center h-60">
          <p className="text-muted-foreground">No forecast data available</p>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <div className="flex items-center">
          <CloudSun size={14} className="mr-1" />
          <span>Weather data updated: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center">
          <Zap size={14} className="mr-1" />
          <span>AI forecast model: {forecastMetrics.confidence.toFixed(1)}% accuracy</span>
        </div>
      </div>
    </DashboardCard>
  );
};

export default EnergyForecastCard;
