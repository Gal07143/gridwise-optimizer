
import React from 'react';

interface BatteryOperatingModeInfoProps {
  mode: string;
}

export const BatteryOperatingModeInfo: React.FC<BatteryOperatingModeInfoProps> = ({ mode }) => {
  switch (mode) {
    case 'normal':
      return (
        <p className="text-sm text-muted-foreground">
          Standard operation with balanced charging and discharging.
        </p>
      );
    case 'eco':
      return (
        <p className="text-sm text-muted-foreground">
          Optimizes charging to use excess solar energy and minimize grid usage.
        </p>
      );
    case 'backup':
      return (
        <p className="text-sm text-muted-foreground">
          Maintains a high charge level to ensure backup power is available.
        </p>
      );
    case 'peak':
      return (
        <p className="text-sm text-muted-foreground">
          Discharges during peak rate periods to minimize electricity costs.
        </p>
      );
    case 'grid':
      return (
        <p className="text-sm text-muted-foreground">
          Optimizes for grid stability and response to grid signals.
        </p>
      );
    default:
      return null;
  }
};
