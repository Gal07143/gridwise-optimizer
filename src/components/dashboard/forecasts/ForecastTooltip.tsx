
import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const ForecastTooltip = ({ active, payload, label }: CustomTooltipProps) => {
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

export default ForecastTooltip;
