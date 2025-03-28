
import React from 'react';

export interface LiveChartProps {
  data: { time: string | Date; value: number }[];
  height?: number;
  color?: string;
  type?: 'line' | 'area' | 'bar';
  gradientFrom?: string;
  gradientTo?: string;
  animate?: boolean;
  animated?: boolean; // Alias for animate for backward compatibility
  showAxis?: boolean;
  showGrid?: boolean;
}

const LiveChart: React.FC<LiveChartProps> = ({
  data,
  height = 200,
  color = '#10b981',
  type = 'line',
  gradientFrom,
  gradientTo,
  animate = true,
  animated, // This is an alias for animate
  showAxis = true,
  showGrid = true
}) => {
  // Use animated prop if provided (for backward compatibility)
  const shouldAnimate = animated !== undefined ? animated : animate;

  // Placeholder implementation
  return (
    <div 
      className="w-full bg-muted/10 rounded-md overflow-hidden" 
      style={{ height: `${height}px` }}
    >
      <div className="text-center p-4 text-sm text-muted-foreground">
        Live Chart Component (Placeholder)
        <p>Data points: {data.length}</p>
        <p>Type: {type}</p>
        <p>Color: {color}</p>
        <p>Animated: {shouldAnimate ? 'Yes' : 'No'}</p>
        <p>Show Axis: {showAxis ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default LiveChart;
