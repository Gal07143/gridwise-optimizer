
import React from 'react';
import { 
  Sun, 
  Wind, 
  Battery, 
  Bolt, 
  Cable,
  Clock,
  ArrowRightLeft,
} from 'lucide-react';
import { MicrogridState } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface StatusOverviewProps {
  microgridState: MicrogridState;
}

const StatusOverview: React.FC<StatusOverviewProps> = ({ microgridState }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center text-lg">
          <Bolt className="mr-2 h-5 w-5 text-primary" />
          Microgrid Status Overview
        </CardTitle>
        <CardDescription>
          Real-time energy flow and system status
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="text-center">
              <Sun className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold">Solar</h3>
              <div className="text-2xl font-bold">{microgridState.solarProduction.toFixed(1)} kW</div>
              <div className="text-sm text-muted-foreground">Production</div>
            </div>
            
            <div className="text-center">
              <Wind className="h-10 w-10 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold">Wind</h3>
              <div className="text-2xl font-bold">{microgridState.windProduction.toFixed(1)} kW</div>
              <div className="text-sm text-muted-foreground">Production</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 border-4 border-primary/30 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary" 
                   style={{ 
                     clipPath: `inset(${100 - microgridState.batteryCharge}% 0 0 0)`,
                     transition: 'clip-path 1s ease-in-out'
                   }}></div>
              <div className="text-center">
                <Battery className="h-8 w-8 text-primary mx-auto mb-1" />
                <div className="text-2xl font-bold">{microgridState.batteryCharge.toFixed(0)}%</div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <h3 className="font-semibold">Battery Storage</h3>
              <div className="text-sm text-muted-foreground">
                {microgridState.batteryDischargeEnabled ? 'Discharge Enabled' : 'Discharge Disabled'}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <Bolt className="h-10 w-10 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold">Load</h3>
              <div className="text-2xl font-bold">{microgridState.loadConsumption.toFixed(1)} kW</div>
              <div className="text-sm text-muted-foreground">Consumption</div>
            </div>
            
            <div className="text-center">
              <Cable className="h-10 w-10 text-slate-500 mx-auto mb-2" />
              <h3 className="font-semibold">Grid</h3>
              <div className="flex justify-center gap-2">
                <div>
                  <div className="text-xl font-bold">{microgridState.gridImport.toFixed(1)} kW</div>
                  <div className="text-xs text-muted-foreground">Import</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{microgridState.gridExport.toFixed(1)} kW</div>
                  <div className="text-xs text-muted-foreground">Export</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-sm">Last updated: {new Date(microgridState.lastUpdated).toLocaleTimeString()}</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
            <ArrowRightLeft className="h-4 w-4 text-slate-500" />
            <span className="text-sm">Frequency: {microgridState.frequency.toFixed(2)} Hz</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
            <Bolt className="h-4 w-4 text-slate-500" />
            <span className="text-sm">Voltage: {microgridState.voltage.toFixed(1)} V</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusOverview;
