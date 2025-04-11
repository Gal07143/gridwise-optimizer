
import React from 'react';
import { cn } from '@/lib/utils';

interface FlowLineProps {
  line: {
    id: string;
    source: { x: number; y: number };
    target: { x: number; y: number };
    animated: boolean;
    value: number;
    strokeWidth: number;
    active?: boolean;
  };
}

export const EnergyFlowLine: React.FC<FlowLineProps> = ({ line }) => {
  if (!line) return null;
  
  const { source, target, animated, strokeWidth, active = true } = line;
  
  // Adjust the line to connect to node edges instead of centers
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate the path for the line
  const path = `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
  
  // Calculate the direction for the animated flow
  const isRightToLeft = source.x > target.x;
  
  return (
    <g>
      {/* Base line */}
      <path
        d={path}
        stroke={active ? '#94a3b8' : '#cbd5e1'}
        strokeWidth={strokeWidth}
        fill="none"
      />
      
      {/* Animated overlay if line is animated */}
      {animated && active && (
        <path
          d={path}
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray="4 4"
          strokeLinecap="round"
          className={cn(
            "transition-all",
            isRightToLeft ? "animate-flow-backwards" : "animate-flow"
          )}
        />
      )}
      
      {/* Energy value indicator */}
      {line.value > 0 && (
        <text
          x={(source.x + target.x) / 2}
          y={(source.y + target.y) / 2 - 10}
          textAnchor="middle"
          fill="#64748b"
          fontSize="10"
          fontWeight="500"
          className="select-none pointer-events-none"
        >
          {line.value.toFixed(1)} kW
        </text>
      )}
    </g>
  );
};
