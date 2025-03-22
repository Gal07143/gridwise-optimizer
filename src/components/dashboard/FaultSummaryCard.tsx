import React from 'react';
import { AlertCircle } from 'lucide-react';
import MetricsCard from '@/components/dashboard/MetricsCard';

interface FaultSummaryCardProps {
  faults: {
    id: string;
    device_id: string;
    timestamp: string;
    description: string;
    severity: string;
    status: string;
  }[];
}

const FaultSummaryCard = ({ faults }: FaultSummaryCardProps) => {
  const faultCount = faults.length;

  return (
    <MetricsCard
      title="Active Faults"
      value={faultCount}
      unit=""
      changeType={faultCount > 0 ? 'increase' : 'neutral'}
      description={faultCount > 0 ? `${faultCount} active faults detected` : 'No active faults'}
      icon={<AlertCircle className="h-5 w-5 text-red-500" />}
      status={faultCount > 0 ? 'error' : 'success'}
      tooltipContent="Shows number of current active faults."
      animationDelay="250ms"
    />
  );
};

export default FaultSummaryCard;
