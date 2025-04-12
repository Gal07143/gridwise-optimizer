
// For the reference line issue in EnergyOptimization.tsx, we need to replace the value prop with a content prop
// Assuming this is for a reference line in a recharts component

import { ReferenceLine } from 'recharts';

// Replace the problematic lines with:
<ReferenceLine 
  y={80} 
  stroke="#8884d8" 
  strokeDasharray="3 3" 
  label={{ position: 'top', value: '80%' }}
/>

<ReferenceLine 
  y={20} 
  stroke="#82ca9d" 
  strokeDasharray="3 3"
  label={{ position: 'top', value: '20%' }}
/>
