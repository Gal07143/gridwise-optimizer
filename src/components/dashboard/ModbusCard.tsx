import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

export interface ModbusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const ModbusCard: React.FC<ModbusCardProps> = ({
  title,
  value,
  unit,
  icon = <Zap className="h-4 w-4" />,
  className,
  isLoading = false
}) => {
  return (
    <Card className={cn("h-full border shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-1 bg-primary/10 rounded">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse h-8 bg-muted rounded" />
        ) : (
          <div className="text-2xl font-bold">
            {value}
            {unit && <span className="text-sm font-normal ml-1 text-muted-foreground">{unit}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModbusCard;
