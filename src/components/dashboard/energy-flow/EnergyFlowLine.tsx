
import React from 'react';

interface EnergyFlowLineProps {
  line: {
    id: string;
    points: { x1: number; y1: number; x2: number; y2: number };
    value: number;
    color?: string;
    isActive?: boolean;
  };
}

export const EnergyFlowLine: React.FC<EnergyFlowLineProps> = ({ line }) => {
  const { points, value, color = '#3b82f6', isActive = true } = line;
  const { x1, y1, x2, y2 } = points;

  // Don't render inactive lines
  if (!isActive) {
    return null;
  }

  // Calculate line width based on value (energy flow amount)
  const lineWidth = Math.max(1, Math.min(8, 1 + value / 2));
  
  // Calculate control points for curved line
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const offsetX = (x2 - x1) * 0.2;
  const offsetY = (y2 - y1) * 0.2;
  
  // Path for curved line
  const path = `M${x1},${y1} C${midX - offsetX},${midY - offsetY} ${midX + offsetX},${midY + offsetY} ${x2},${y2}`;
  
  return (
    <g>
      {/* Base line */}
      <path
        d={path}
        stroke={color}
        strokeWidth={lineWidth}
        fill="none"
        opacity={0.6}
      />
      
      {/* Animated flow dots */}
      <circle r={lineWidth * 0.8} fill="#fff">
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={path}
        />
      </circle>
      
      {/* Value label */}
      {value > 0.5 && (
        <text
          x={midX}
          y={midY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#666"
          fontSize="10"
          fontWeight="500"
          className="drop-shadow"
          stroke="#fff"
          strokeWidth="0.5"
          paintOrder="stroke"
        >
          {value.toFixed(1)} kW
        </text>
      )}
    </g>
  );
};

export default EnergyFlowLine;
