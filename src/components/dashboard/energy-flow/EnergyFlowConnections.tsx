
import React, { useMemo } from 'react';
import { EnergyConnection } from './types';

interface EnergyFlowConnectionsProps {
  connections: EnergyConnection[];
}

const EnergyFlowConnections: React.FC<EnergyFlowConnectionsProps> = ({ connections }) => {
  // Define paths for each connection
  const connectionPaths = useMemo(() => {
    return connections.map(connection => {
      // Get path between nodes based on their IDs
      const path = getConnectionPath(connection.from, connection.to);
      return {
        ...connection,
        path,
        strokeWidth: Math.max(2, Math.min(8, 2 + (connection.value * 0.5))),
        color: getConnectionColor(connection.from),
      };
    });
  }, [connections]);

  return (
    <svg className="absolute inset-0 w-full h-full">
      {connectionPaths.map((connection, index) => (
        connection.active && connection.path && (
          <g key={`${connection.from}-${connection.to}-${index}`} className="energy-flow-connection">
            {/* Base path */}
            <path
              d={connection.path}
              fill="none"
              stroke={connection.color || "#6366f1"}
              strokeWidth={connection.strokeWidth}
              strokeLinecap="round"
              opacity={0.6}
            />
            
            {/* Animated flow */}
            <path
              d={connection.path}
              fill="none"
              stroke="white"
              strokeWidth={connection.strokeWidth * 0.6}
              strokeDasharray="5,15"
              opacity={0.7}
              className="animate-flow"
            />
            
            {/* Value label */}
            {connection.value > 0.1 && (
              <>
                <path
                  id={`path-${connection.from}-${connection.to}-${index}`}
                  d={connection.path}
                  fill="none"
                  stroke="none"
                />
                <text className="text-[10px] fill-white font-medium drop-shadow-md">
                  <textPath
                    href={`#path-${connection.from}-${connection.to}-${index}`}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {connection.value.toFixed(1)} kW
                  </textPath>
                </text>
              </>
            )}
          </g>
        )
      ))}
    </svg>
  );
};

// Helper function to get path between nodes
const getConnectionPath = (from: string, to: string): string => {
  // Define connection paths based on predefined positions
  switch (`${from}-${to}`) {
    case 'solar-battery':
      return "M110,80 C160,80 160,160 210,160";
    case 'solar-home':
      return "M110,80 C160,80 290,80 390,120";
    case 'wind-battery':
      return "M110,180 C160,180 160,160 210,160";
    case 'wind-home':
      return "M110,180 C160,180 290,140 390,140";
    case 'battery-ev':
      return "M290,160 C330,160 350,240 390,240";
    case 'battery-home':
      return "M290,160 C330,160 350,140 390,140";
    case 'grid-battery':
      return "M110,280 C160,280 160,200 210,180";
    case 'grid-home':
      return "M110,280 C160,280 290,200 390,160";
    case 'grid-ev':
      return "M110,280 C160,280 290,240 390,240";
    default:
      return "";
  }
};

// Helper function to get color for a specific connection based on source
const getConnectionColor = (source: string): string => {
  switch (source) {
    case 'solar':
      return "rgba(234, 179, 8, 0.8)"; // yellow
    case 'wind':
      return "rgba(59, 130, 246, 0.8)"; // blue
    case 'battery':
      return "rgba(168, 85, 247, 0.8)"; // purple
    case 'grid':
      return "rgba(220, 38, 38, 0.8)"; // red
    default:
      return "rgba(99, 102, 241, 0.8)"; // indigo
  }
};

export default EnergyFlowConnections;
