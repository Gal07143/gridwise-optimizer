
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge } from 'lucide-react';

export interface ModbusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  className?: string;
}

const ModbusCard: React.FC<ModbusCardProps> = ({
  title,
  value,
  unit,
  icon = <Gauge className="h-4 w-4" />,
  className = "",
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit && <span className="text-sm ml-1 text-muted-foreground">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModbusCard;
