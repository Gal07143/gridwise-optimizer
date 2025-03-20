
import React from 'react';
import { EnergyConnection } from './types';

interface EnergyFlowConnectionsProps {
  connections: EnergyConnection[];
}

const EnergyFlowConnections: React.FC<EnergyFlowConnectionsProps> = ({ connections }) => {
  // Get path coordinates based on connection points
  const getConnectionPath = (from: string, to: string): string => {
    // Define connection paths based on the source and target node IDs
    switch (`${from}-${to}`) {
      case 'solar-battery':
        return "M110,80 C160,80 160,160 210,160";
      case 'solar-building':
        return "M110,80 C200,50 350,50 410,120";
      case 'wind-battery':
        return "M110,240 C135,240 185,200 210,180";
      case 'wind-building':
        return "M110,240 C180,240 270,200 410,160";
      case 'battery-building':
        return "M290,160 C320,160 390,140 410,140";
      case 'battery-devices':
        return "M290,160 C320,170 350,220 410,220";
      default:
        return "";
    }
  };

  // Calculate stroke width based on energy value
  const getStrokeWidth = (value: number): number => {
    const baseWidth = 2;
    const maxValue = 20;
    // Scale width between baseWidth and 8 based on value
    return Math.max(baseWidth, Math.min(8, baseWidth + (value / maxValue) * 6));
  };

  // Get the color for the connection based on the source
  const getConnectionColor = (from: string): string => {
    switch (from) {
      case 'solar':
        return "var(--energy-solar, rgba(234, 179, 8, 0.6))";
      case 'wind':
        return "var(--energy-wind, rgba(59, 130, 246, 0.6))";
      case 'battery':
        return "var(--energy-battery, rgba(168, 85, 247, 0.6))";
      default:
        return "rgba(100, 116, 139, 0.6)";
    }
  };

  return (
    <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
      {connections.map((connection, index) => {
        const path = getConnectionPath(connection.from, connection.to);
        const strokeWidth = getStrokeWidth(connection.value);
        const color = getConnectionColor(connection.from);
        
        if (!path || !connection.active) return null;
        
        return (
          <g key={`${connection.from}-${connection.to}`}>
            {/* Background connection line */}
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              opacity={0.7}
            />
            
            {/* Animated flow pattern */}
            <path
              d={path}
              fill="none"
              stroke="white"
              strokeWidth={strokeWidth * 0.6}
              strokeDasharray="10,15"
              opacity={0.7}
              className="animate-flow"
            />
            
            {/* Energy value indicator */}
            {connection.value > 0.5 && (
              <>
                <path
                  id={`flow-path-${connection.from}-${connection.to}`}
                  d={path}
                  fill="none"
                  stroke="none"
                />
                <text dy={-5} className="text-[10px] font-medium fill-slate-700 dark:fill-slate-200">
                  <textPath
                    href={`#flow-path-${connection.from}-${connection.to}`}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {connection.value.toFixed(1)} kW
                  </textPath>
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default EnergyFlowConnections;
