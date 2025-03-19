
import React from 'react';
import { EnergyConnection } from './types';

interface EnergyFlowConnectionsProps {
  connections: EnergyConnection[];
}

const EnergyFlowConnections: React.FC<EnergyFlowConnectionsProps> = ({ connections }) => {
  return (
    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(14, 165, 233, 0)">
            <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="rgba(14, 165, 233, 0.3)">
            <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="rgba(14, 165, 233, 0)">
            <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      
      {/* Solar to Battery */}
      <path 
        d="M145,70 C200,70 200,150 260,150" 
        fill="none" 
        stroke="url(#flowGradient)" 
        strokeWidth="3" 
        strokeDasharray="5,5"
      />
      
      {/* Solar to Building */}
      <path 
        d="M145,70 C250,70 350,70 450,70" 
        fill="none" 
        stroke="url(#flowGradient)" 
        strokeWidth="3" 
        strokeDasharray="5,5"
      />
      
      {/* Wind to Building */}
      <path 
        d="M145,150 C250,150 350,150 450,150" 
        fill="none" 
        stroke="url(#flowGradient)" 
        strokeWidth="3" 
        strokeDasharray="5,5"
      />
      
      {/* Wind to Battery */}
      <path 
        d="M145,150 C180,150 220,150 260,150" 
        fill="none" 
        stroke="url(#flowGradient)" 
        strokeWidth="3" 
        strokeDasharray="5,5"
      />
      
      {/* Grid to Building */}
      <path 
        d="M145,230 C250,230 350,230 450,230" 
        fill="none" 
        stroke="url(#flowGradient)" 
        strokeWidth="3" 
        strokeDasharray="5,5"
      />
      
      {/* Battery to EV */}
      <path 
        d="M330,180 C380,200 420,230 450,230" 
        fill="none" 
        stroke="url(#flowGradient)" 
        strokeWidth="3" 
        strokeDasharray="5,5"
      />
    </svg>
  );
};

export default EnergyFlowConnections;
