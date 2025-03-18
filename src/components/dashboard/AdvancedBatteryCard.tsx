
import React from 'react';
import { Battery, Clock, Thermometer, Zap } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { cn } from '@/lib/utils';

interface AdvancedBatteryCardProps {
  stateOfCharge?: number;
  stateOfHealth?: number;
  temperature?: number;
  cycleCount?: number;
  className?: string;
}

const AdvancedBatteryCard = ({
  stateOfCharge = 68,
  stateOfHealth = 94,
  temperature = 25.3,
  cycleCount = 342,
  className
}: AdvancedBatteryCardProps) => {
  // Calculate remaining cycles (assuming 3000 cycle lifetime)
  const totalCycles = 3000;
  const remainingCycles = totalCycles - cycleCount;
  const remainingLifePercent = (remainingCycles / totalCycles) * 100;
  
  // Battery health indicators
  const getHealthStatus = () => {
    if (stateOfHealth >= 90) return 'excellent';
    if (stateOfHealth >= 80) return 'good';
    if (stateOfHealth >= 70) return 'fair';
    return 'poor';
  };
  
  const getTemperatureStatus = () => {
    if (temperature >= 15 && temperature <= 30) return 'optimal';
    if (temperature > 30 && temperature <= 40) return 'high';
    if (temperature > 40) return 'critical';
    return 'low';
  };
  
  const getTempColorClass = () => {
    const status = getTemperatureStatus();
    if (status === 'optimal') return 'text-energy-green';
    if (status === 'high') return 'text-energy-orange';
    if (status === 'critical') return 'text-energy-red';
    return 'text-energy-blue';
  };

  return (
    <DashboardCard
      title="Advanced Battery Management"
      icon={<Battery size={18} />}
      className={className}
    >
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-primary" />
            <div className="text-xs text-muted-foreground">State of Charge</div>
          </div>
          <div className="text-xl font-semibold">{stateOfCharge}%</div>
          <div className="mt-2 bg-secondary/50 rounded-full h-1.5 overflow-hidden">
            <div 
              className={cn(
                "h-full", 
                stateOfCharge > 80 ? "bg-energy-green" : 
                stateOfCharge > 40 ? "bg-energy-blue" : 
                stateOfCharge > 20 ? "bg-energy-orange" : "bg-energy-red"
              )} 
              style={{ width: `${stateOfCharge}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Est. remaining: {Math.round(stateOfCharge * 1.2)} kWh
          </div>
        </div>
        
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer size={14} className="text-primary" />
            <div className="text-xs text-muted-foreground">Temperature</div>
          </div>
          <div className={cn("text-xl font-semibold", getTempColorClass())}>
            {temperature}°C
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Min: 18.2°C</span>
            <span>Max: 27.8°C</span>
          </div>
          <div className="text-xs mt-1">
            Status: <span className={getTempColorClass()}>{getTemperatureStatus()}</span>
          </div>
        </div>
        
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Battery size={14} className="text-primary" />
            <div className="text-xs text-muted-foreground">State of Health</div>
          </div>
          <div className="text-xl font-semibold">
            {stateOfHealth}%
          </div>
          <div className="mt-1 bg-secondary/50 rounded-full h-1.5 overflow-hidden">
            <div 
              className={cn(
                "h-full", 
                stateOfHealth > 90 ? "bg-energy-green" : 
                stateOfHealth > 80 ? "bg-energy-blue" : 
                stateOfHealth > 70 ? "bg-energy-orange" : "bg-energy-red"
              )} 
              style={{ width: `${stateOfHealth}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Status: {getHealthStatus()}
          </div>
        </div>
        
        <div className="glass-panel p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-primary" />
            <div className="text-xs text-muted-foreground">Lifecycle</div>
          </div>
          <div className="text-xl font-semibold">
            {cycleCount} cycles
          </div>
          <div className="mt-1 bg-secondary/50 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-energy-blue" 
              style={{ width: `${100 - remainingLifePercent}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Est. remaining: {remainingCycles} cycles
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default AdvancedBatteryCard;
