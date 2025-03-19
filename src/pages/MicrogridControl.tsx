
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Power, Bolt, LineChart } from 'lucide-react';
import { useSite } from '@/contexts/SiteContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';

// Import the refactored components
import MicrogridNavMenu from '@/components/microgrid/MicrogridNavMenu';
import MicrogridHeader from '@/components/microgrid/MicrogridHeader';
import MicrogridProvider from '@/components/microgrid/MicrogridProvider';
import MicrogridTabContent from '@/components/microgrid/MicrogridTabContent';

const MicrogridControl = () => {
  const { currentSite } = useSite();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Check if site is selected
  useEffect(() => {
    if (!currentSite) {
      toast.error("No site selected", {
        description: "Please select a site to control the microgrid"
      });
      navigate("/settings/sites");
    }
  }, [currentSite, navigate]);
  
  return (
    <AppLayout>
      <div className="animate-in fade-in duration-500">
        <MicrogridProvider>
          <MicrogridHeader />
          
          <div className="mb-6">
            <MicrogridNavMenu />
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="overview" className="text-sm">
                <Bolt className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="control" className="text-sm">
                <Power className="h-4 w-4 mr-2" />
                Controls
              </TabsTrigger>
              <TabsTrigger value="flow" className="text-sm">
                <Grid className="h-4 w-4 mr-2" />
                Energy Flow
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-sm">
                <LineChart className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
            </TabsList>
            
            <MicrogridTabContent activeTab={activeTab} />
          </Tabs>
        </MicrogridProvider>
      </div>
    </AppLayout>
  );
};

export default MicrogridControl;
