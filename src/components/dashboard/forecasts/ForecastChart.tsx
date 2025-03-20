
import React from 'react';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis,
  YAxis,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import ForecastTooltip from './ForecastTooltip';

interface ForecastChartProps {
  data: any[];
  height?: number;
}

const ForecastChart = ({ data, height = 240 }: ForecastChartProps) => {
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center" style={{ height }}>
        <p className="text-muted-foreground">No forecast data available</p>
      </div>
    );
  }
  
  // Process data to show time in a more readable format
  const processedData = data.map(item => {
    const date = new Date(item.time);
    return {
      ...item,
      hour: date.getHours(),
      displayTime: date.getHours().toString().padStart(2, '0') + ':00',
      // Adding a third series to represent net energy for the chart
      netEnergy: item.generation - item.consumption
    };
  });
  
  // Find day/night periods for shading
  const sunriseHour = 6; // 6 AM
  const sunsetHour = 18; // 6 PM
  
  // Find the current hour for reference line
  const currentHour = new Date().getHours();
  
  // Calculate peak generation/consumption times
  const maxGeneration = Math.max(...processedData.map(item => item.generation));
  const maxConsumption = Math.max(...processedData.map(item => item.consumption));
  const peakGenerationPoint = processedData.find(item => item.generation === maxGeneration);
  const peakConsumptionPoint = processedData.find(item => item.consumption === maxConsumption);
  
  return (
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
            <linearGradient id="nightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0, 0, 0, 0.05)" stopOpacity={1}/>
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0.05)" stopOpacity={1}/>
            </linearGradient>
          </defs>
          
          {/* Day/night background shading */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
          
          {/* Reference rectangles for night periods (0-6 and 18-24) */}
          {processedData.length > 0 && (
            <>
              <ReferenceLine x={sunriseHour} stroke="rgba(255, 177, 60, 0.5)" />
              <ReferenceLine x={sunsetHour} stroke="rgba(107, 114, 128, 0.5)" />
            </>
          )}
          
          {/* Reference line for current time */}
          <ReferenceLine 
            x={currentHour} 
            stroke="rgba(220, 38, 38, 0.7)" 
            strokeWidth={2} 
            strokeDasharray="3 3" 
            label={{ 
              value: 'Now', 
              position: 'insideTopRight', 
              fill: 'rgba(220, 38, 38, 0.9)',
              fontSize: 10 
            }} 
          />
          
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 10 }} 
            tickLine={false}
            axisLine={{ stroke: 'rgba(100, 116, 139, 0.2)' }}
            tickFormatter={(hour) => `${hour}:00`}
            interval="preserveStartEnd"
            minTickGap={15}
          />
          <YAxis 
            tick={{ fontSize: 10 }} 
            tickLine={false}
            axisLine={{ stroke: 'rgba(100, 116, 139, 0.2)' }}
            label={{ value: 'kW', angle: -90, position: 'insideLeft', fontSize: 10, dy: 50 }}
          />
          <Tooltip content={<ForecastTooltip />} />
          
          {/* Area charts for generation and consumption */}
          <Area 
            type="monotone" 
            dataKey="generation" 
            name="Generation"
            stroke="rgba(45, 211, 111, 1)" 
            fillOpacity={1} 
            fill="url(#colorGen)" 
            strokeWidth={2}
            activeDot={{ r: 5, stroke: 'rgba(45, 211, 111, 1)', strokeWidth: 2 }}
          />
          <Area 
            type="monotone" 
            dataKey="consumption" 
            name="Consumption"
            stroke="rgba(122, 90, 248, 1)" 
            fillOpacity={1} 
            fill="url(#colorCons)" 
            strokeWidth={2}
            activeDot={{ r: 5, stroke: 'rgba(122, 90, 248, 1)', strokeWidth: 2 }}
          />
          
          {/* Add reference points for peak generation and consumption */}
          {peakGenerationPoint && (
            <ReferenceLine 
              x={peakGenerationPoint.hour} 
              stroke="rgba(45, 211, 111, 0.8)" 
              label={{ 
                value: 'Peak Gen', 
                position: 'insideTopRight', 
                fill: 'rgba(45, 211, 111, 0.8)',
                fontSize: 9
              }} 
              strokeDasharray="3 3"
            />
          )}
          
          {peakConsumptionPoint && (
            <ReferenceLine 
              x={peakConsumptionPoint.hour} 
              stroke="rgba(122, 90, 248, 0.8)" 
              label={{ 
                value: 'Peak Use', 
                position: 'insideBottomRight', 
                fill: 'rgba(122, 90, 248, 0.8)',
                fontSize: 9
              }} 
              strokeDasharray="3 3"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
