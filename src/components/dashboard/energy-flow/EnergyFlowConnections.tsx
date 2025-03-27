
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
      case 'solar-home':
        return "M110,80 C200,50 350,50 410,120";
      case 'solar-devices':
        return "M110,80 C200,80 300,180 410,220";
      case 'wind-battery':
        return "M110,240 C135,240 185,200 210,180";
      case 'wind-building':
      case 'wind-home':
        return "M110,240 C180,240 270,200 410,160";
      case 'wind-devices':
        return "M110,240 C180,240 270,220 410,220";
      case 'battery-building':
      case 'battery-home':
        return "M290,160 C320,160 390,140 410,140";
      case 'battery-devices':
        return "M290,160 C320,170 350,220 410,220";
      case 'battery-ev':
        return "M290,160 C320,190 350,260 410,280";
      case 'grid-building':
      case 'grid-home':
        return "M110,320 C180,320 270,200 410,180";
      case 'grid-battery':
        return "M110,320 C140,320 180,240 210,200";
      case 'grid-devices':
        return "M110,320 C200,320 300,260 410,240";
      case 'grid-ev':
        return "M110,320 C200,320 300,280 410,290";
      default:
        return "";
    }
  };

  // Calculate stroke width based on energy value
  const getStrokeWidth = (value: number): number => {
    const baseWidth = 2;
    const maxValue = 12;
    // Scale width between baseWidth and 10 based on value
    return Math.max(baseWidth, Math.min(10, baseWidth + (value / maxValue) * 8));
  };

  // Get the color for the connection based on the source
  const getConnectionColor = (from: string): string => {
    switch (from) {
      case 'solar':
        return "#FDCB40"; // Bright yellow for solar
      case 'wind':
        return "#38BDF8"; // Bright blue for wind
      case 'battery':
        return "#A78BFA"; // Vibrant purple for battery
      case 'grid':
        return "#F87171"; // Bright red for grid
      default:
        return "#94A3B8"; // Default slate for unknown sources
    }
  };

  // Get a glow effect for the connection
  const getGlowFilter = (from: string): string => {
    const id = `glow-${from}`;
    return id;
  };

  return (
    <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
      {/* Define filters for glow effects */}
      <defs>
        <filter id="glow-solar" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="#FDCB40" floodOpacity="0.3" />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="glow-wind" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="#38BDF8" floodOpacity="0.3" />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="glow-battery" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="#A78BFA" floodOpacity="0.3" />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="glow-grid" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="#F87171" floodOpacity="0.3" />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      
      {connections.map((connection, index) => {
        const path = getConnectionPath(connection.from, connection.to);
        const strokeWidth = getStrokeWidth(connection.value);
        const color = getConnectionColor(connection.from);
        const glowFilter = getGlowFilter(connection.from);
        
        if (!path || !connection.active) return null;
        
        return (
          <g key={`${connection.from}-${connection.to}-${index}`} className="energy-flow-connection">
            {/* Background glow effect */}
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth + 4}
              opacity={0.15}
              strokeLinecap="round"
              filter={`url(#${glowFilter})`}
            />
            
            {/* Main connection line */}
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              opacity={0.8}
              strokeLinecap="round"
            />
            
            {/* Animated flow pattern - faster and more visible */}
            <path
              d={path}
              fill="none"
              stroke="white"
              strokeWidth={strokeWidth * 0.6}
              strokeDasharray={`${5 + Math.min(10, connection.value * 0.8)},${15 + Math.min(20, connection.value * 1.2)}`}
              opacity={0.9}
              className="animate-flow"
              style={{ 
                animation: `flow ${Math.max(3, 12 - connection.value)}s linear infinite`,
                filter: `drop-shadow(0 0 3px ${color})`
              }}
              strokeLinecap="round"
            />
            
            {/* Energy value indicator with improved visibility */}
            {connection.value > 0.5 && (
              <>
                <path
                  id={`flow-path-${connection.from}-${connection.to}-${index}`}
                  d={path}
                  fill="none"
                  stroke="none"
                />
                <text dy={-8} className="text-[10px] font-bold drop-shadow-lg">
                  <textPath
                    href={`#flow-path-${connection.from}-${connection.to}-${index}`}
                    startOffset="50%"
                    textAnchor="middle"
                    className="fill-white"
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
