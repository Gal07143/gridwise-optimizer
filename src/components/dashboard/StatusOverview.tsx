
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemStatus {
  category: string;
  status: 'operational' | 'maintenance' | 'issue' | 'critical';
  lastUpdated: string;
  details?: string;
}

// Mock system status data
const initialStatuses: SystemStatus[] = [
  { 
    category: 'Microgrid Controller', 
    status: 'operational', 
    lastUpdated: '2 minutes ago',
    details: 'All systems operational'
  },
  { 
    category: 'Energy Storage', 
    status: 'operational', 
    lastUpdated: '5 minutes ago',
    details: 'Battery at 68% capacity'
  },
  { 
    category: 'Solar Production', 
    status: 'operational', 
    lastUpdated: '2 minutes ago',
    details: 'Producing at 92% efficiency'
  },
  { 
    category: 'Grid Connection', 
    status: 'maintenance', 
    lastUpdated: '15 minutes ago',
    details: 'Scheduled maintenance in progress'
  },
  { 
    category: 'EV Charging', 
    status: 'operational', 
    lastUpdated: '3 minutes ago',
    details: '3/5 charging stations in use'
  },
  { 
    category: 'Building Distribution', 
    status: 'operational', 
    lastUpdated: '7 minutes ago',
    details: 'All circuits normal'
  },
];

const StatusOverview = () => {
  const [statuses, setStatuses] = useState(initialStatuses);
  
  // Simulate occasional status changes
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance of changing a random status
      if (Math.random() < 0.1) {
        const statusOptions: SystemStatus['status'][] = ['operational', 'maintenance', 'issue', 'critical'];
        const randomIndex = Math.floor(Math.random() * statuses.length);
        const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        
        setStatuses(prev => 
          prev.map((status, idx) => 
            idx === randomIndex 
              ? { ...status, status: randomStatus, lastUpdated: 'Just now' } 
              : status
          )
        );
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [statuses]);
  
  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle size={16} className="text-energy-green" />;
      case 'maintenance':
        return <Clock size={16} className="text-energy-blue" />;
      case 'issue':
        return <AlertTriangle size={16} className="text-energy-orange" />;
      case 'critical':
        return <AlertTriangle size={16} className="text-energy-red" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-energy-green/10 text-energy-green border-energy-green/20';
      case 'maintenance':
        return 'bg-energy-blue/10 text-energy-blue border-energy-blue/20';
      case 'issue':
        return 'bg-energy-orange/10 text-energy-orange border-energy-orange/20';
      case 'critical':
        return 'bg-energy-red/10 text-energy-red border-energy-red/20';
      default:
        return '';
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <Shield size={18} className="mr-2 text-primary" />
        <h3 className="font-medium">System Status</h3>
      </div>
      
      <div className="space-y-3 staggered-fade-in">
        {statuses.map((item, index) => (
          <div key={index} className="glass-panel p-3 rounded-lg flex items-center justify-between group transition-all hover:bg-white/15">
            <div className="flex-1">
              <div className="text-sm font-medium">{item.category}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.details}</div>
            </div>
            
            <div className="flex items-center">
              <div className={cn(
                "py-1 px-2 rounded-full text-xs font-medium flex items-center mr-3",
                getStatusColor(item.status)
              )}>
                {getStatusIcon(item.status)}
                <span className="ml-1.5 capitalize">{item.status}</span>
              </div>
              <div className="text-xs text-muted-foreground">{item.lastUpdated}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusOverview;
