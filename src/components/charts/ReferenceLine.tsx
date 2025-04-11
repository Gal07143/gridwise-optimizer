
import React from 'react';

interface ReferenceLineProps {
  y?: number;
  x?: number;
  stroke?: string;
  strokeDasharray?: string;
  strokeWidth?: number;
  label?: {
    value: string;
    position: 'insideTopRight' | 'insideBottomRight' | 'insideTopLeft' | 'insideBottomLeft';
  };
}

const ReferenceLine: React.FC<ReferenceLineProps> = ({
  y,
  x,
  stroke = '#000',
  strokeDasharray,
  strokeWidth = 1,
  label
}) => {
  // This is just a stub component for compatibility with recharts
  // In a real implementation, ReferenceLine would come from recharts
  return null;
};

export default ReferenceLine;
