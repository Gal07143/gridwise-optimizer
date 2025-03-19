
import React from 'react';
import { Activity } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import EnergyFlowChart from '@/components/dashboard/EnergyFlowChart';
import { useSite } from '@/contexts/SiteContext';
import { Card, CardContent } from '@/components/ui/card';

const EnergyFlow = () => {
  const { currentSite } = useSite();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">Energy Flow</h1>
            <p className="text-muted-foreground">Visualize real-time energy distribution across your system</p>
          </div>
          
          <div className="max-w-6xl mx-auto mb-6">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <EnergyFlowChart />
              </CardContent>
            </Card>
          </div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Energy Source Details */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-md font-medium mb-2">Energy Sources</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>Solar Production</span>
                    <span className="font-semibold text-energy-green">75.2 kW</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Wind Production</span>
                    <span className="font-semibold text-energy-blue">45.8 kW</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Grid Import</span>
                    <span className="font-semibold text-slate-500">32.1 kW</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Storage Details */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-md font-medium mb-2">Energy Storage</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>Battery Charge</span>
                    <span className="font-semibold text-energy-blue">68%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Stored Energy</span>
                    <span className="font-semibold text-energy-blue">120 kWh</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Input/Output</span>
                    <span className="font-semibold text-energy-green">+6.9 kW</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Consumption Details */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-md font-medium mb-2">Energy Consumption</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>Building Load</span>
                    <span className="font-semibold text-energy-purple">102.7 kW</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>EV Charging</span>
                    <span className="font-semibold text-energy-purple">48.3 kW</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Grid Export</span>
                    <span className="font-semibold text-slate-500">8.1 kW</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyFlow;
