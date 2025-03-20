
import React from 'react';
import { EnergyNode as EnergyNodeType } from './types';
import { Sun, Wind, Battery, Home, Laptop, Building, Cpu } from 'lucide-react';

interface EnergyNodeProps {
  node: EnergyNodeType;
  showDetails?: boolean;
}

const EnergyNode: React.FC<EnergyNodeProps> = ({ node, showDetails = true }) => {
  // Get the appropriate icon based on node type and ID
  const getNodeIcon = () => {
    switch (node.id) {
      case 'solar':
        return <Sun className="h-10 w-10 mb-2 text-yellow-500" />;
      case 'wind':
        return <Wind className="h-10 w-10 mb-2 text-blue-500" />;
      case 'battery':
        return <Battery className="h-12 w-12 mb-2 text-purple-500" />;
      case 'building':
        return <Building className="h-10 w-10 mb-2 text-green-500" />;
      case 'devices':
        return <Laptop className="h-10 w-10 mb-2 text-slate-500" />;
      default:
        if (node.type === 'source') return <Sun className="h-10 w-10 mb-2 text-yellow-500" />;
        if (node.type === 'storage') return <Battery className="h-10 w-10 mb-2 text-purple-500" />;
        if (node.type === 'consumption') return <Home className="h-10 w-10 mb-2 text-green-500" />;
        return <Cpu className="h-10 w-10 mb-2 text-gray-500" />;
    }
  };

  // Get background color based on node type
  const getNodeBackgroundColor = () => {
    switch (node.type) {
      case 'source':
        return node.id === 'solar'
          ? 'bg-yellow-100/70 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50'
          : 'bg-blue-100/70 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50';
      case 'storage':
        return 'bg-purple-100/70 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50';
      case 'consumption':
        return node.id === 'building'
          ? 'bg-green-100/70 dark:bg-green-900/20 border-green-200 dark:border-green-800/50'
          : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50';
      default:
        return 'bg-gray-100/70 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700/50';
    }
  };

  // Get extra content for specific node types
  const getNodeExtraContent = () => {
    if (node.type === 'storage') {
      // Calculate battery percentage (now correctly using the batteryLevel or defaulting to 73.6)
      const batteryPercentage = node.batteryLevel || 73.6;
      
      return (
        <>
          <div className="w-full h-4 bg-purple-200/50 dark:bg-purple-800/30 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-purple-500"
              style={{ width: `${batteryPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
            {batteryPercentage}% Charged
          </div>
        </>
      );
    }
    
    return null;
  };

  return (
    <div className={`w-full p-4 rounded-lg ${getNodeBackgroundColor()} backdrop-blur-sm flex flex-col items-center shadow-sm transition-all duration-300 hover:shadow-md`}>
      {getNodeIcon()}
      <div className="text-sm font-medium">{node.label}</div>
      <div className="text-xl font-bold">{node.power.toFixed(1)} kW</div>
      {showDetails && getNodeExtraContent()}
      
      {node.status !== 'active' && (
        <div className="mt-2 text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300">
          {node.status === 'error' ? 'Error' : 'Offline'}
        </div>
      )}
    </div>
  );
};

export default EnergyNode;
