
import React from 'react';

interface LabelProps {
  value: string;
  position: 'insideTopRight' | 'insideBottomRight' | 'insideTopLeft' | 'insideBottomLeft';
}

const Label: React.FC<LabelProps> = ({ value, position }) => {
  // This is just a stub component for compatibility with recharts
  // In a real implementation, Label would come from recharts
  return null;
};

export default Label;
