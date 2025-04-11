
import React from 'react';
import { ReferenceLine as RechartReferenceLine } from 'recharts';

interface ReferenceLineProps {
  value: number | string;
  stroke?: string;
  strokeDasharray?: string;
  label?: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'middle';
  y?: number | string;
  x?: number | string;
}

const ReferenceLine: React.FC<ReferenceLineProps> = ({
  value,
  stroke = '#ff7300',
  strokeDasharray = '3 3',
  label,
  position = 'right',
  y,
  x
}) => {
  // Use either explicit y/x props or default to value
  const yValue = y !== undefined ? y : value;
  const xValue = x !== undefined ? x : undefined;
  
  return (
    <RechartReferenceLine 
      y={yValue} 
      x={xValue}
      stroke={stroke} 
      strokeDasharray={strokeDasharray}
      label={label ? { value: label, position } : undefined}
    />
  );
};

export default ReferenceLine;
