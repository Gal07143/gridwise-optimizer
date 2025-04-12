
import React from 'react';
import { ReferenceLine as RechartReferenceLine } from 'recharts';

export interface ReferenceLineProps {
  value?: number | string;
  stroke?: string;
  strokeDasharray?: string;
  label?: string | number | { position: string; value: string };
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
  const yValue = y !== undefined ? y : (x === undefined ? value : undefined);
  const xValue = x !== undefined ? x : (y === undefined ? value : undefined);
  
  // Format the label correctly based on its type
  let labelConfig;
  
  if (typeof label === 'object' && label !== null) {
    // If it's already an object, pass it through
    labelConfig = label;
  } else if (label !== undefined) {
    // If it's a string or number, create a label object
    labelConfig = { 
      value: String(label), 
      position: position 
    };
  }
  
  return (
    <RechartReferenceLine 
      y={yValue} 
      x={xValue}
      stroke={stroke} 
      strokeDasharray={strokeDasharray}
      label={labelConfig}
    />
  );
};

export default ReferenceLine;
