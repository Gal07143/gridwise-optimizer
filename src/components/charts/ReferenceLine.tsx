
import React from 'react';
import { Line, ReferenceLine as RechartReferenceLine } from 'recharts';

interface ReferenceLineProps {
  value: number | string;
  stroke?: string;
  strokeDasharray?: string;
  label?: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'middle';
}

const ReferenceLine: React.FC<ReferenceLineProps> = ({
  value,
  stroke = '#ff7300',
  strokeDasharray = '3 3',
  label,
  position = 'right'
}) => {
  return (
    <RechartReferenceLine 
      y={value} 
      stroke={stroke} 
      strokeDasharray={strokeDasharray}
      label={{ value: label, position }}
    />
  );
};

export default ReferenceLine;
