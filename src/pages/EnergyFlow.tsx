
import React from 'react';
import { Zap } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import EnergyFlowChart from '@/components/dashboard/EnergyFlowChart';
import { useSite } from '@/contexts/SiteContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const EnergyFlow = () => {
  const { currentSite } = useSite();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Energy Flow</h1>
            <p className="text-muted-foreground">Visualize real-time energy distribution across your system</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              className="h-9"
              onClick={() => navigate('/analytics')}
              as={Link}
              to="/analytics"
            >
              View Analytics
            </Button>
            <Button 
              variant="default"
              className="h-9"
              onClick={() => navigate('/microgrid-control')}
              as={Link}
              to="/microgrid-control"
            >
              Control System
            </Button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mb-6">
          <Card className="shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
            <CardContent className="p-6">
              <EnergyFlowChart />
            </CardContent>
          </Card>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Zap className="mr-2 h-5 w-5 text-primary" />
            Energy Sources & Consumption Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Energy Source Details */}
            <Card className="shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
              <CardContent className="p-4">
                <h3 className="text-md font-medium mb-2 flex items-center">
                  <div className="w-3 h-3 bg-energy-green rounded-full mr-2"></div>
                  Energy Sources
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Solar Production</span>
                    <span className="font-semibold text-energy-green">75.2 kW</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Wind Production</span>
                    <span className="font-semibold text-energy-blue">45.8 kW</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Grid Import</span>
                    <span className="font-semibold text-slate-500">32.1 kW</span>
                  </li>
                  <li className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50 mt-2">
                    <span className="text-sm font-medium">Total Generation</span>
                    <span className="font-semibold text-primary">153.1 kW</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Storage Details */}
            <Card className="shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
              <CardContent className="p-4">
                <h3 className="text-md font-medium mb-2 flex items-center">
                  <div className="w-3 h-3 bg-energy-blue rounded-full mr-2"></div>
                  Energy Storage
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Battery Charge</span>
                    <span className="font-semibold text-energy-blue">68%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Stored Energy</span>
                    <span className="font-semibold text-energy-blue">120 kWh</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Input/Output</span>
                    <span className="font-semibold text-energy-green">+6.9 kW</span>
                  </li>
                  <li className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50 mt-2">
                    <span className="text-sm font-medium">Remaining Capacity</span>
                    <span className="font-semibold text-primary">57 kWh</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Consumption Details */}
            <Card className="shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/70 dark:border-slate-700/70">
              <CardContent className="p-4">
                <h3 className="text-md font-medium mb-2 flex items-center">
                  <div className="w-3 h-3 bg-energy-purple rounded-full mr-2"></div>
                  Energy Consumption
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Building Load</span>
                    <span className="font-semibold text-energy-purple">102.7 kW</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">EV Charging</span>
                    <span className="font-semibold text-energy-purple">48.3 kW</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm">Grid Export</span>
                    <span className="font-semibold text-slate-500">8.1 kW</span>
                  </li>
                  <li className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-700/50 mt-2">
                    <span className="text-sm font-medium">Total Consumption</span>
                    <span className="font-semibold text-primary">159.1 kW</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EnergyFlow;
