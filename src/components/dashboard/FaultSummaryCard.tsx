
import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import MetricsCard from '@/components/dashboard/MetricsCard';
import { useFaults } from '@/hooks/useFaults';

const FaultSummaryCard = () => {
  const { faults, loading } = useFaults();
  const faultCount = faults.length;
  
  // Determine status message based on fault count
  const getFaultDescription = () => {
    if (loading) return 'Loading fault information...';
    if (faultCount === 0) return 'No active faults detected';
    if (faultCount === 1) return '1 active fault detected';
    return `${faultCount} active faults detected`;
  };
  
  // Determine badge color based on fault count
  const getFaultStatus = () => {
    if (faultCount === 0) return 'success';
    if (faultCount < 3) return 'warning';
    return 'error';
  };

  return (
    <MetricsCard
      title="Active Faults"
      value={faultCount}
      unit=""
      changeType={faultCount > 0 ? 'increase' : 'neutral'}
      description={getFaultDescription()}
      icon={<ShieldAlert className={`h-5 w-5 ${faultCount > 0 ? 'text-red-500' : 'text-green-500'}`} />}
      status={getFaultStatus()}
      tooltipContent="Shows number of current active faults in the system that require attention."
      animationDelay="250ms"
      isLoading={loading}
    />
  );
};

export default FaultSummaryCard;
