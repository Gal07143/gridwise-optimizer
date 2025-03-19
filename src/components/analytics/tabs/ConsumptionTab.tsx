
import React from 'react';
import { Calendar, TrendingUp, Zap, PieChart, History, BarChartHorizontal } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import LiveChart from '@/components/dashboard/LiveChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from '@/components/ui/chart';
import { 
  AreaChart as RechartsAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ConsumptionTabProps {
  weeklyEnergyData: any[];
  peakDemandData: any[];
  energySourcesData: any[];
  topConsumersData: any[];
  costBreakdownData: any[];
  dataComparisonEnabled: boolean;
}

const ConsumptionTab = ({
  weeklyEnergyData,
  peakDemandData,
  energySourcesData,
  topConsumersData,
  costBreakdownData,
  dataComparisonEnabled
}: ConsumptionTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard 
          title="Daily Energy Consumption (kWh)"
          icon={<Calendar size={18} />}
        >
          <div className="h-[250px]">
            <ChartContainer
              config={{
                current: { 
                  label: "This Week", 
                  color: "rgba(122, 90, 248, 1)" 
                },
                previous: { 
                  label: "Last Week", 
                  color: "rgba(122, 90, 248, 0.3)" 
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart 
                  data={weeklyEnergyData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(122, 90, 248, 0.8)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="rgba(122, 90, 248, 0.1)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(122, 90, 248, 0.3)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="rgba(122, 90, 248, 0)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="current"
                    stroke="rgba(122, 90, 248, 1)"
                    fillOpacity={1}
                    fill="url(#colorCurrent)"
                  />
                  {dataComparisonEnabled && (
                    <Area 
                      type="monotone" 
                      dataKey="comparison" 
                      name="previous"
                      stroke="rgba(122, 90, 248, 0.3)"
                      fillOpacity={1}
                      fill="url(#colorPrevious)"
                    />
                  )}
                </RechartsAreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Peak Power Demand (kW)"
          icon={<TrendingUp size={18} />}
        >
          <LiveChart
            data={peakDemandData}
            height={250}
            color="rgba(255, 153, 0, 1)"
            type="area"
            gradientFrom="rgba(255, 153, 0, 0.5)"
            gradientTo="rgba(255, 153, 0, 0)"
            animated={false}
          />
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Energy Sources Breakdown"
          icon={<PieChart size={18} />}
        >
          <div className="flex flex-col items-center justify-center h-[220px] pt-4">
            <div className="w-40 h-40 relative">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Solar - 45% */}
                <circle
                  className="fill-[#fbbf24]"
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="0"
                  strokeDasharray="251.2"
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                {/* Wind - 30% */}
                <circle
                  className="fill-[#22c55e]"
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="0"
                  strokeDasharray="251.2"
                  strokeDashoffset="138.2"
                  transform="rotate(-90 50 50)"
                />
                {/* Grid - 15% */}
                <circle
                  className="fill-[#3b82f6]"
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="0"
                  strokeDasharray="251.2"
                  strokeDashoffset="188.4"
                  transform="rotate(-90 50 50)"
                />
                {/* Battery - 10% */}
                <circle
                  className="fill-[#8b5cf6]"
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="0"
                  strokeDasharray="251.2"
                  strokeDashoffset="213.5"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  className="fill-white dark:fill-slate-800"
                  cx="50"
                  cy="50"
                  r="25"
                />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
              {energySourcesData.map((source) => (
                <div key={source.name} className="flex items-center gap-2">
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      source.name === 'Solar' ? 'bg-[#fbbf24]' : 
                      source.name === 'Wind' ? 'bg-[#22c55e]' : 
                      source.name === 'Grid' ? 'bg-[#3b82f6]' : 
                      'bg-[#8b5cf6]'
                    }`}
                  />
                  <span className="text-xs">{source.name}: {source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard
          title="Top Consumers"
          icon={<Zap size={18} />}
        >
          <div className="h-[220px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead className="text-right">kWh</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topConsumersData.map((consumer) => (
                  <TableRow key={consumer.device}>
                    <TableCell className="font-medium">{consumer.device}</TableCell>
                    <TableCell className="text-right">{consumer.consumption}</TableCell>
                    <TableCell className={`text-right ${
                      consumer.change.startsWith('+') ? 'text-energy-red' : 'text-energy-green'
                    }`}>
                      {consumer.change}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DashboardCard>
        
        <DashboardCard
          title="Consumption by Time"
          icon={<History size={18} />}
        >
          <div className="h-[220px] flex flex-col justify-center">
            {costBreakdownData.map((item) => (
              <div key={item.category} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>{item.category}</span>
                  <span className="font-medium">{item.cost.toFixed(2)} $ ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      item.category === 'Peak Hours' ? 'bg-energy-red' : 
                      item.category === 'Off-Peak Hours' ? 'bg-energy-green' : 
                      'bg-energy-blue'
                    }`} 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default ConsumptionTab;
