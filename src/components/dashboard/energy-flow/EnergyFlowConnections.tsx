
import React from 'react';
import { EnergyConnection } from './types';

interface EnergyFlowConnectionsProps {
  connections: EnergyConnection[];
}

const EnergyFlowConnections: React.FC<EnergyFlowConnectionsProps> = ({ connections }) => {
  return (
    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <defs>
        {/* Source to Storage gradient (green to blue) */}
        <linearGradient id="sourceToStorageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(45, 211, 111, 0.7)" />
          <stop offset="100%" stopColor="rgba(14, 165, 233, 0.7)" />
        </linearGradient>
        
        {/* Source to Consumption gradient (green to purple) */}
        <linearGradient id="sourceToConsumptionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(45, 211, 111, 0.7)" />
          <stop offset="100%" stopColor="rgba(168, 85, 247, 0.7)" />
        </linearGradient>
        
        {/* Storage to Consumption gradient (blue to purple) */}
        <linearGradient id="storageToConsumptionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(14, 165, 233, 0.7)" />
          <stop offset="100%" stopColor="rgba(168, 85, 247, 0.7)" />
        </linearGradient>
        
        {/* Grid to Consumption gradient (gray to purple) */}
        <linearGradient id="gridToConsumptionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(100, 116, 139, 0.7)" />
          <stop offset="100%" stopColor="rgba(168, 85, 247, 0.7)" />
        </linearGradient>
        
        {/* Flow animation */}
        <pattern id="flowPattern" width="30" height="10" patternUnits="userSpaceOnUse">
          <rect width="20" height="10" fill="rgba(255, 255, 255, 0.3)">
            <animate attributeName="x" from="-20" to="30" dur="2s" repeatCount="indefinite" />
          </rect>
        </pattern>
      </defs>
      
      {connections.map((connection, index) => {
        // Determine connection path and gradient
        let path = '';
        let gradient = 'url(#sourceToConsumptionGradient)';
        
        if (connection.from === 'solar' && connection.to === 'battery') {
          path = "M145,70 C200,70 200,150 260,150";
          gradient = 'url(#sourceToStorageGradient)';
        } else if (connection.from === 'solar' && connection.to === 'building') {
          path = "M145,70 C250,70 350,70 450,70";
          gradient = 'url(#sourceToConsumptionGradient)';
        } else if (connection.from === 'wind' && connection.to === 'building') {
          path = "M145,150 C250,150 350,150 450,150";
          gradient = 'url(#sourceToConsumptionGradient)';
        } else if (connection.from === 'wind' && connection.to === 'battery') {
          path = "M145,150 C180,150 220,150 260,150";
          gradient = 'url(#sourceToStorageGradient)';
        } else if (connection.from === 'grid' && connection.to === 'building') {
          path = "M145,230 C250,230 350,230 450,230";
          gradient = 'url(#gridToConsumptionGradient)';
        } else if (connection.from === 'battery' && connection.to === 'ev') {
          path = "M330,180 C380,200 420,230 450,230";
          gradient = 'url(#storageToConsumptionGradient)';
        } else if (connection.from === 'battery' && connection.to === 'export') {
          path = "M330,120 C380,100 420,50 450,50";
          gradient = 'url(#storageToConsumptionGradient)';
        }
        
        // Skip if no path defined
        if (!path) return null;
        
        // Scale stroke width based on energy value
        const baseWidth = 2;
        const maxValue = 50;
        const strokeWidth = Math.max(baseWidth, Math.min(8, baseWidth + (connection.value / maxValue) * 6));
        
        return (
          <g key={`connection-${index}`}>
            {/* Base connection line */}
            <path 
              d={path} 
              fill="none" 
              stroke={gradient}
              strokeWidth={strokeWidth} 
              opacity={connection.active ? 1 : 0.3}
            />
            
            {/* Animated flow pattern */}
            <path 
              d={path} 
              fill="none" 
              stroke="url(#flowPattern)"
              strokeWidth={strokeWidth} 
              opacity={connection.active ? 1 : 0}
            />
            
            {/* Energy value indicator */}
            {connection.active && connection.value > 0 && (
              <text>
                <textPath 
                  href={`#connection-path-${index}`} 
                  startOffset="50%" 
                  className="text-[10px] fill-white font-medium text-center"
                  dominantBaseline="middle"
                  textAnchor="middle"
                >
                  {connection.value.toFixed(1)} kW
                </textPath>
              </text>
            )}
            
            {/* Hidden path for text */}
            <path 
              id={`connection-path-${index}`}
              d={path} 
              fill="none" 
              stroke="none"
            />
          </g>
        );
      })}
    </svg>
  );
};

export default EnergyFlowConnections;
