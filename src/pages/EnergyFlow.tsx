
import React from 'react';
import { Zap, Info } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import EnergyFlowChart from '@/components/dashboard/EnergyFlowChart';
import { useSite } from '@/contexts/SiteContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Main } from '@/components/ui/main';

const EnergyFlow = () => {
  const { currentSite } = useSite();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <Main className="bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1 text-white">Energy Flow</h1>
            <p className="text-slate-400">Visualize real-time energy distribution across your system</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              className="h-9 bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white"
              onClick={() => navigate('/analytics')}
            >
              View Analytics
            </Button>
            <Button 
              variant="default"
              className="h-9 bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/microgrid-control')}
            >
              Control System
            </Button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mb-6">
          <Card className="shadow-lg bg-slate-900/50 border-slate-800/50">
            <CardContent className="p-6">
              <EnergyFlowChart />
            </CardContent>
          </Card>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-medium mb-4 flex items-center text-white">
            <Zap className="mr-2 h-5 w-5 text-blue-400" />
            Energy Sources & Consumption Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Energy Source Details */}
            <Card className="shadow-lg bg-slate-900/50 border-slate-800/50">
              <CardContent className="p-4">
                <h3 className="text-md font-medium mb-2 flex items-center text-slate-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Energy Sources
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Solar Production</span>
                    <span className="font-semibold text-yellow-400">5.2 kW</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Wind Production</span>
                    <span className="font-semibold text-blue-400">1.8 kW</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Grid Import</span>
                    <span className="font-semibold text-red-400">0.3 kW</span>
                  </li>
                  <li className="flex justify-between items-center pt-2 border-t border-slate-800 mt-2">
                    <span className="text-sm font-medium text-slate-300">Total Generation</span>
                    <span className="font-semibold text-white">7.0 kW</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Storage Details */}
            <Card className="shadow-lg bg-slate-900/50 border-slate-800/50">
              <CardContent className="p-4">
                <h3 className="text-md font-medium mb-2 flex items-center text-slate-200">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Energy Storage
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Battery Charge</span>
                    <span className="font-semibold text-purple-400">65%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Stored Energy</span>
                    <span className="font-semibold text-purple-400">3.5 kW</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Input/Output</span>
                    <span className="font-semibold text-green-400">+2.2 kW</span>
                  </li>
                  <li className="flex justify-between items-center pt-2 border-t border-slate-800 mt-2">
                    <span className="text-sm font-medium text-slate-300">Remaining Capacity</span>
                    <span className="font-semibold text-white">7.1 kWh</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Consumption Details */}
            <Card className="shadow-lg bg-slate-900/50 border-slate-800/50">
              <CardContent className="p-4">
                <h3 className="text-md font-medium mb-2 flex items-center text-slate-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Energy Consumption
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Building Load</span>
                    <span className="font-semibold text-green-400">3.8 kW</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">EV Charging</span>
                    <span className="font-semibold text-green-400">1.5 kW</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Devices</span>
                    <span className="font-semibold text-slate-300">1.2 kW</span>
                  </li>
                  <li className="flex justify-between items-center pt-2 border-t border-slate-800 mt-2">
                    <span className="text-sm font-medium text-slate-300">Total Consumption</span>
                    <span className="font-semibold text-white">6.5 kW</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </AppLayout>
  );
};

export default EnergyFlow;
