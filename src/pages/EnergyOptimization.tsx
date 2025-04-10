
import React, { useState } from 'react';
import { DashboardLayout, DashboardGrid, DashboardCard } from '@/components/ui/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ChevronRight,
  Zap,
  Battery,
  Clock,
  Calendar,
  BarChart4,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  Leaf,
  BadgeDollarSign,
  CircuitBoard,
  Cpu,
  PanelTop
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import GlassPanel from '@/components/ui/GlassPanel';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const EnergyOptimization = () => {
  const [optimizationMode, setOptimizationMode] = useState('balanced');
  const [activeAIModels, setActiveAIModels] = useState(['load_forecast', 'peak_shaving', 'price_optimization']);

  // AI Model toggles
  const toggleAIModel = (modelId: string) => {
    if (activeAIModels.includes(modelId)) {
      setActiveAIModels(activeAIModels.filter(id => id !== modelId));
    } else {
      setActiveAIModels([...activeAIModels, modelId]);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Energy Optimization</h1>
          <p className="text-slate-500">AI-powered optimization for your energy system</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={optimizationMode} onValueChange={setOptimizationMode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cost">Cost Saving</SelectItem>
              <SelectItem value="eco">Eco-Friendly</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default">
            Apply Settings
          </Button>
        </div>
      </div>

      <DashboardLayout>
        <DashboardGrid columns={2}>
          {/* Smart Optimization Card */}
          <DashboardCard 
            className="col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border-blue-100 dark:border-blue-900/30"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-3 mr-4 bg-blue-500/10 rounded-lg">
                    <Cpu className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">AI Optimization Active</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Your system is being optimized in real-time
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge active={true}>Load Forecasting</Badge>
                  <Badge active={true}>Peak Shaving</Badge>
                  <Badge active={true}>Price Optimization</Badge>
                  <Badge active={false}>Weather Adaptation</Badge>
                </div>
                <div className="flex items-center gap-6 text-sm mt-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5 text-slate-400" />
                    <span>Updated 5 min ago</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart4 className="h-4 w-4 mr-1.5 text-slate-400" />
                    <span>98% Accuracy</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-24 w-24">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">87%</span>
                  </div>
                  <CircularProgress value={87} />
                </div>
                <span className="text-sm font-medium">Optimization Score</span>
              </div>
            </div>
          </DashboardCard>
        </DashboardGrid>
        
        <DashboardGrid columns={3} className="mt-6">
          {/* Savings Card */}
          <DashboardCard gradient className="flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <BadgeDollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 py-1 px-2 rounded-full text-xs flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12% this month
              </div>
            </div>
            <div className="mt-auto">
              <h3 className="text-2xl font-bold mb-1">$217.45</h3>
              <p className="text-slate-500 text-sm">
                Monthly savings with AI optimization
              </p>
              <Button variant="link" className="text-sm p-0 mt-2 h-auto">
                View Details <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </DashboardCard>
          
          {/* Carbon Savings */}
          <DashboardCard gradient className="flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Leaf className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 py-1 px-2 rounded-full text-xs flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +18% this month
              </div>
            </div>
            <div className="mt-auto">
              <h3 className="text-2xl font-bold mb-1">324 kg</h3>
              <p className="text-slate-500 text-sm">
                CO₂ emissions avoided this month
              </p>
              <Button variant="link" className="text-sm p-0 mt-2 h-auto">
                Environmental Impact <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </DashboardCard>
          
          {/* Self-Consumption */}
          <DashboardCard gradient className="flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 py-1 px-2 rounded-full text-xs flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8% this week
              </div>
            </div>
            <div className="mt-auto">
              <h3 className="text-2xl font-bold mb-1">78%</h3>
              <p className="text-slate-500 text-sm">
                Solar self-consumption ratio
              </p>
              <Button variant="link" className="text-sm p-0 mt-2 h-auto">
                Energy Flow <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </DashboardCard>
        </DashboardGrid>
        
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">AI Optimization Models</h2>
          <DashboardGrid columns={2}>
            <AIModelCard
              title="Load Forecasting"
              description="Predicts your energy consumption patterns"
              icon={<Lightbulb className="h-5 w-5" />}
              accuracy={96}
              lastTraining="2 days ago"
              active={activeAIModels.includes('load_forecast')}
              onToggle={() => toggleAIModel('load_forecast')}
            />
            
            <AIModelCard
              title="Peak Shaving"
              description="Reduces peaks in energy demand to lower costs"
              icon={<BarChart4 className="h-5 w-5" />}
              accuracy={92}
              lastTraining="4 days ago"
              active={activeAIModels.includes('peak_shaving')}
              onToggle={() => toggleAIModel('peak_shaving')}
            />
            
            <AIModelCard
              title="Price Optimization"
              description="Shifts energy use to lower price periods"
              icon={<BadgeDollarSign className="h-5 w-5" />}
              accuracy={94}
              lastTraining="1 day ago"
              active={activeAIModels.includes('price_optimization')}
              onToggle={() => toggleAIModel('price_optimization')}
            />
            
            <AIModelCard
              title="Battery Management"
              description="Extends battery life while maximizing value"
              icon={<Battery className="h-5 w-5" />}
              accuracy={89}
              lastTraining="5 days ago"
              active={activeAIModels.includes('battery_mgmt')}
              onToggle={() => toggleAIModel('battery_mgmt')}
            />
          </DashboardGrid>
        </div>
        
        {/* Recommendations */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">AI Recommendations</h2>
          <DashboardGrid columns={1}>
            <DashboardCard>
              <div className="space-y-4">
                <RecommendationItem
                  title="Schedule EV charging during solar peak"
                  description="Charge your EV between 11 AM and 2 PM to maximize solar usage"
                  icon={<Zap className="h-5 w-5" />}
                  impact="High"
                  savings="$25/month"
                />
                
                <RecommendationItem
                  title="Increase battery reserve for grid outage"
                  description="Weather forecast indicates potential grid instability tomorrow"
                  icon={<Battery className="h-5 w-5" />}
                  impact="Medium"
                  savings="Reliability"
                />
                
                <RecommendationItem
                  title="Shift dishwasher to off-peak hours"
                  description="Run your dishwasher after 9 PM to reduce electricity costs"
                  icon={<Clock className="h-5 w-5" />}
                  impact="Low"
                  savings="$8/month"
                />
              </div>
            </DashboardCard>
          </DashboardGrid>
        </div>
        
        {/* Schedule */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Optimization Schedule</h2>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </div>
          <DashboardCard>
            <div className="space-y-4">
              <ScheduleItem 
                time="06:00 - 10:00"
                title="Battery Charge"
                description="Using excess solar power to charge battery"
                icon={<Battery className="h-5 w-5" />}
                status="Active"
              />
              
              <ScheduleItem 
                time="17:00 - 21:00"
                title="Peak Shaving"
                description="Using battery to reduce grid demand"
                icon={<Zap className="h-5 w-5" />}
                status="Scheduled"
              />
              
              <ScheduleItem 
                time="22:00 - 01:00"
                title="Grid Charging"
                description="Low tariff period grid charging"
                icon={<PanelTop className="h-5 w-5" />}
                status="Scheduled"
              />
            </div>
          </DashboardCard>
        </div>
      </DashboardLayout>
    </div>
  );
};

// Helper components
interface BadgeProps {
  children: React.ReactNode;
  active: boolean;
}

const Badge: React.FC<BadgeProps> = ({ children, active }) => {
  return (
    <div className={`
      px-3 py-1.5 rounded-full text-xs font-medium
      ${active 
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200' 
        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}
    `}>
      {children}
    </div>
  );
};

interface CircularProgressProps {
  value: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ value }) => {
  const circumference = 2 * Math.PI * 36; // r=36 (adjusting for stroke width)
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" className="transform -rotate-90">
      <circle
        cx="40"
        cy="40"
        r="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        className="text-slate-200 dark:text-slate-700"
      />
      <circle
        cx="40"
        cy="40"
        r="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="text-blue-500 transition-all duration-1000 ease-in-out"
      />
    </svg>
  );
};

interface AIModelCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accuracy: number;
  lastTraining: string;
  active: boolean;
  onToggle: () => void;
}

const AIModelCard: React.FC<AIModelCardProps> = ({ 
  title, 
  description, 
  icon, 
  accuracy, 
  lastTraining,
  active,
  onToggle
}) => {
  return (
    <DashboardCard className="flex flex-col">
      <div className="flex justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg ${active ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-slate-500 text-sm">{description}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Switch id={`switch-${title}`} checked={active} onCheckedChange={onToggle} />
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-slate-500 mb-1">Accuracy</div>
            <div className="font-medium">{accuracy}%</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Last Training</div>
            <div className="font-medium">{lastTraining}</div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700">
          View Details
        </Button>
      </div>
    </DashboardCard>
  );
};

interface RecommendationItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  impact: 'High' | 'Medium' | 'Low';
  savings: string;
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({
  title,
  description,
  icon,
  impact,
  savings
}) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };
  
  return (
    <div className="flex items-start p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
      <div className="p-3 mr-4 bg-blue-500/10 rounded-lg text-blue-500">
        {icon}
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-slate-500 text-sm mb-3">{description}</p>
        <div className="flex gap-3">
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getImpactColor(impact)}`}>
            {impact} Impact
          </div>
          <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
            {savings}
          </div>
        </div>
      </div>
      <div>
        <Button size="sm">Apply</Button>
      </div>
    </div>
  );
};

interface ScheduleItemProps {
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'Active' | 'Scheduled' | 'Completed';
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  time,
  title,
  description,
  icon,
  status
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Completed': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      default: return '';
    }
  };
  
  return (
    <div className="flex items-start p-3 border border-slate-100 dark:border-slate-700/30 rounded-lg">
      <div className="w-24 text-slate-500 text-sm font-medium pt-1">{time}</div>
      <div className="p-2 mr-3 bg-blue-500/10 rounded-lg text-blue-500">
        {icon}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{title}</h3>
          <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default EnergyOptimization;
