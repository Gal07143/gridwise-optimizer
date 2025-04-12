
import React from 'react';
import { EnergyNodeProps } from './types';

export const EnergyNodeCard: React.FC<EnergyNodeProps> = ({ node, onClick }) => {
  // Get icon based on device type
  const getIcon = () => {
    switch (node.deviceType) {
      case 'solar':
        return (
          <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </div>
        );
      case 'battery':
        return (
          <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="7" width="12" height="14" rx="2" />
              <line x1="10" y1="4" x2="14" y2="4" />
              <line x1="12" y1="2" x2="12" y2="4" />
              <line x1="9" y1="11" x2="15" y2="11" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
        );
      case 'grid':
        return (
          <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
              <line x1="12" y1="2" x2="12" y2="12" />
            </svg>
          </div>
        );
      case 'ev':
        return (
          <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 17h2v-6h-6M5 17h10v-6H5v6ZM16 6h-5v4" />
              <circle cx="7" cy="18.5" r="1.5" />
              <circle cx="16" cy="18.5" r="1.5" />
            </svg>
          </div>
        );
      case 'load':
      case 'home':
        return (
          <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
            <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </div>
        );
    }
  };
  
  // Get status color based on node status
  const getStatusColor = () => {
    switch (node.status) {
      case 'active':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'charging':
        return 'bg-blue-500';
      case 'discharging':
        return 'bg-amber-500';
      default:
        return 'bg-gray-400';
    }
  };
  
  return (
    <div 
      className={`flex flex-col items-center p-2 rounded-lg ${onClick ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        {getIcon()}
        <span className={`absolute -top-1 -right-1 h-3 w-3 ${getStatusColor()} border-2 border-white dark:border-slate-900 rounded-full`}></span>
      </div>
      
      <div className="mt-2 text-center">
        <p className="font-medium text-sm">{node.name}</p>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{node.power.toFixed(1)} kW</p>
        
        {node.batteryLevel !== undefined && (
          <div className="w-full mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div 
              className="bg-blue-600 h-1 rounded-full" 
              style={{ width: `${node.batteryLevel}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergyNodeCard;
