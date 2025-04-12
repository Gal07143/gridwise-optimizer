
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Home, Zap, Wind, Sun, Gauge, Droplet, Building, Factory } from 'lucide-react';

interface SmartGridComponentProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  status: 'active' | 'inactive' | 'warning' | 'error';
  type: 'source' | 'consumer' | 'storage' | 'grid';
}

const SmartGridComponent: React.FC<SmartGridComponentProps> = ({
  title,
  icon,
  value,
  status,
  type
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return type === 'source' ? 'text-green-500' : type === 'consumer' ? 'text-red-500' : 'text-blue-500';
      case 'inactive':
        return 'text-gray-400';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getBgColor = () => {
    switch (status) {
      case 'active':
        return type === 'source' ? 'bg-green-500/10' : type === 'consumer' ? 'bg-red-500/10' : 'bg-blue-500/10';
      case 'warning':
        return 'bg-yellow-500/10';
      case 'error':
        return 'bg-red-600/10';
      default:
        return 'bg-gray-200/20 dark:bg-gray-700/20';
    }
  };

  return (
    <div className={`flex flex-col items-center p-3 rounded-lg ${getBgColor()} transition-all hover:scale-105`}>
      <div className={`p-3 rounded-full ${getStatusColor()} mb-2`}>
        {icon}
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className={`text-lg font-bold ${getStatusColor()}`}>{value}</p>
    </div>
  );
};

interface SmartGridVisualizationProps {
  className?: string;
}

const SmartGridVisualization: React.FC<SmartGridVisualizationProps> = ({ className }) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Smart Grid Energy System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Central Management System */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg">
              <div className="text-center">
                <Gauge className="h-8 w-8 mx-auto text-primary" />
                <p className="text-xs mt-1">Grid Management</p>
              </div>
            </div>
          </div>

          {/* Connection lines - using SVG for better control */}
          <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: -1 }}>
            {/* Grid to Management */}
            <line x1="50%" y1="24" x2="50%" y2="80" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4" />
            
            {/* Management to Components */}
            <line x1="50%" y1="128" x2="25%" y2="180" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4" />
            <line x1="50%" y1="128" x2="50%" y2="180" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4" />
            <line x1="50%" y1="128" x2="75%" y2="180" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4" />
            
            {/* Components to Sub-components */}
            <line x1="25%" y1="240" x2="17%" y2="280" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4" />
            <line x1="25%" y1="240" x2="33%" y2="280" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4" />
            
            <line x1="75%" y1="240" x2="67%" y2="280" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4" />
            <line x1="75%" y1="240" x2="83%" y2="280" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4" />
          </svg>

          {/* Energy sources */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <SmartGridComponent 
              title="Solar Power" 
              icon={<Sun className="h-6 w-6" />} 
              value="3.2 kW" 
              status="active"
              type="source"
            />
            <SmartGridComponent 
              title="Battery" 
              icon={<Battery className="h-6 w-6" />} 
              value="76%" 
              status="active"
              type="storage"
            />
            <SmartGridComponent 
              title="Grid Supply" 
              icon={<Zap className="h-6 w-6" />} 
              value="2.1 kW" 
              status="active"
              type="source"
            />
          </div>

          {/* Energy consumers */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-4">
              <SmartGridComponent 
                title="Smart Home" 
                icon={<Home className="h-6 w-6" />} 
                value="1.2 kW" 
                status="active"
                type="consumer"
              />
              <SmartGridComponent 
                title="Wind Power" 
                icon={<Wind className="h-6 w-6" />} 
                value="0.0 kW" 
                status="inactive"
                type="source"
              />
            </div>
            <div className="space-y-4">
              <SmartGridComponent 
                title="Hydro Plant" 
                icon={<Droplet className="h-6 w-6" />} 
                value="0.5 kW" 
                status="active"
                type="source"
              />
            </div>
            <div className="space-y-4">
              <SmartGridComponent 
                title="Factory" 
                icon={<Factory className="h-6 w-6" />} 
                value="4.8 kW" 
                status="active"
                type="consumer"
              />
              <SmartGridComponent 
                title="Building" 
                icon={<Building className="h-6 w-6" />} 
                value="3.1 kW" 
                status="active"
                type="consumer"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartGridVisualization;
