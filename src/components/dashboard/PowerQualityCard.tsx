
import React from 'react';
import { Activity, AlertTriangle, Check } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { cn } from '@/lib/utils';

interface PowerQualityCardProps {
  frequency?: number;
  voltage?: number;
  powerFactor?: number;
  thd?: number;
  className?: string;
}

const PowerQualityCard = ({
  frequency = 60.01,
  voltage = 239.8,
  powerFactor = 0.97,
  thd = 2.7,
  className
}: PowerQualityCardProps) => {
  const getFrequencyStatus = () => {
    if (frequency >= 59.95 && frequency <= 60.05) return 'normal';
    if (frequency >= 59.8 && frequency <= 60.2) return 'warning';
    return 'critical';
  };

  const getVoltageStatus = () => {
    if (voltage >= 235 && voltage <= 245) return 'normal';
    if (voltage >= 220 && voltage <= 250) return 'warning';
    return 'critical';
  };
  
  const getPowerFactorStatus = () => {
    if (powerFactor >= 0.95) return 'normal';
    if (powerFactor >= 0.9) return 'warning';
    return 'critical';
  };
  
  const getThdStatus = () => {
    if (thd <= 3) return 'normal';
    if (thd <= 5) return 'warning';
    return 'critical';
  };
  
  const renderStatusIndicator = (status: 'normal' | 'warning' | 'critical') => {
    if (status === 'normal') {
      return <Check size={16} className="text-energy-green" />;
    } else if (status === 'warning') {
      return <AlertTriangle size={16} className="text-energy-orange" />;
    } else {
      return <AlertTriangle size={16} className="text-energy-red" />;
    }
  };

  return (
    <DashboardCard
      title="Power Quality Metrics"
      icon={<Activity size={18} />}
      className={className}
    >
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">Frequency</div>
            {renderStatusIndicator(getFrequencyStatus())}
          </div>
          <div className="text-xl font-semibold">{frequency} Hz</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Nominal: 60.00 Hz</div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">Voltage</div>
            {renderStatusIndicator(getVoltageStatus())}
          </div>
          <div className="text-xl font-semibold">{voltage} V</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Nominal: 240 V</div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">Power Factor</div>
            {renderStatusIndicator(getPowerFactorStatus())}
          </div>
          <div className="text-xl font-semibold">{powerFactor}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: ≥0.95</div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-slate-500 dark:text-slate-400">THD</div>
            {renderStatusIndicator(getThdStatus())}
          </div>
          <div className="text-xl font-semibold">{thd}%</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Target: ≤3%</div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default PowerQualityCard;
