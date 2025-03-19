
import React from 'react';
import { Grid, Settings } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

const MicrogridControl = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">Microgrid Control</h1>
            <p className="text-muted-foreground">Monitor and control your energy microgrid system</p>
          </div>
          
          <div className="max-w-4xl mx-auto text-center py-12">
            <Grid className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Microgrid Control Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              We're currently building out our microgrid control interface. Check back soon for 
              advanced management tools for your energy microgrid.
            </p>
            <div className="p-4 border rounded-lg bg-muted/20 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2">
                <Settings className="text-primary animate-spin-slow" />
                <span className="font-medium">Microgrid control panel is under development</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicrogridControl;
