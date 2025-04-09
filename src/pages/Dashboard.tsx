
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { MetricsCard, MetricData } from "@/components/ui/dashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Gauge, Calendar, BarChart3, Activity, Zap } from 'lucide-react';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import { supabase } from '@/integrations/supabase/client';
import { Device } from '@/types/device';
import { Alert, SystemRecommendation } from '@/types/energy';
import EnergyUsageWidget from '@/components/dashboard/EnergyUsageWidget';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import DeviceStatusWidget from '@/components/dashboard/DeviceStatusWidget';
import SystemAlertsWidget from '@/components/dashboard/SystemAlertsWidget';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recommendations, setRecommendations] = useState<SystemRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Fetch data from Supabase
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch devices
        const { data: devicesData, error: devicesError } = await supabase
          .from('devices')
          .select('*');
          
        if (devicesError) throw devicesError;
        
        // Fetch alerts
        const { data: alertsData, error: alertsError } = await supabase
          .from('alerts')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);
          
        if (alertsError) throw alertsError;
        
        // Fetch recommendations
        const { data: recommendationsData, error: recommendationsError } = await supabase
          .from('ai_recommendations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recommendationsError) throw recommendationsError;
        
        setDevices(devicesData as Device[]);
        setAlerts(alertsData as Alert[]);
        setRecommendations(recommendationsData as SystemRecommendation[]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Set up real-time subscriptions
    const devicesSubscription = supabase
      .channel('public:devices')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'devices' 
      }, payload => {
        // Handle device updates
        if (payload.eventType === 'INSERT') {
          setDevices(prev => [...prev, payload.new as Device]);
        } else if (payload.eventType === 'UPDATE') {
          setDevices(prev => prev.map(device => 
            device.id === payload.new.id ? payload.new as Device : device
          ));
        } else if (payload.eventType === 'DELETE') {
          setDevices(prev => prev.filter(device => device.id !== payload.old.id));
        }
      })
      .subscribe();
      
    const alertsSubscription = supabase
      .channel('public:alerts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'alerts'
      }, payload => {
        // Handle alert updates
        if (payload.eventType === 'INSERT') {
          setAlerts(prev => [payload.new as Alert, ...prev].slice(0, 10));
        } else if (payload.eventType === 'UPDATE') {
          setAlerts(prev => prev.map(alert => 
            alert.id === payload.new.id ? payload.new as Alert : alert
          ));
        }
      })
      .subscribe();
    
    // Clean up subscriptions
    return () => {
      supabase.removeChannel(devicesSubscription);
      supabase.removeChannel(alertsSubscription);
    };
  }, []);

  // Count online devices
  const onlineDevices = devices.filter(device => device.status === 'online').length;
  const totalCapacity = devices.reduce((sum, device) => sum + device.capacity, 0);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.acknowledged).length;
  
  // Sample recommendations data for display
  const mappedRecommendations = recommendations.map(rec => ({
    id: rec.id,
    title: rec.title,
    description: rec.description,
    potentialSavings: parseFloat(rec.potential_savings || '0'),
    impact: rec.priority === 'high' ? 'high' : rec.priority === 'medium' ? 'medium' : 'low',
    type: rec.type === 'energy' ? 'energy' : rec.type === 'cost' ? 'cost' : rec.type === 'maintenance' ? 'maintenance' : 'carbon',
    createdAt: rec.created_at,
    priority: rec.priority === 'high' ? 'high' : rec.priority === 'medium' ? 'medium' : 'low',
    status: rec.applied ? 'applied' : 'pending',
    confidence: rec.confidence
  }));
  
  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Welcome to your Energy Management System"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard 
          title="Online Devices"
          metrics={[{
            value: onlineDevices,
            label: `of ${devices.length} devices`
          }]}
          icon={<Gauge className="w-5 h-5" />}
        />
        <MetricsCard 
          title="Total Capacity"
          metrics={[{
            value: totalCapacity,
            label: "kW"
          }]}
          icon={<Zap className="w-5 h-5" />}
        />
        <MetricsCard 
          title="Critical Alerts"
          metrics={[{
            value: criticalAlerts,
            label: "unresolved alerts",
            positive: criticalAlerts === 0
          }]}
          icon={<Activity className="w-5 h-5" />}
        />
        <MetricsCard 
          title="Energy Savings"
          metrics={[{
            value: 23.5,
            label: "kWh today",
            positive: true
          }]}
          icon={<BarChart3 className="w-5 h-5" />}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="energy" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Energy</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Devices</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EnergyUsageWidget className="md:col-span-2" />
            <WeatherWidget />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DeviceStatusWidget devices={devices} />
            <SystemAlertsWidget alerts={alerts} />
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <DashboardSummary 
                devices={devices} 
                recommendations={mappedRecommendations} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="energy">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Energy Flow</h3>
                {/* Energy flow diagram will go here */}
                <div className="bg-gray-100 dark:bg-gray-800 h-80 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Energy flow visualization</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Energy Analytics</h3>
                {/* Analytics content will go here */}
                <div className="bg-gray-100 dark:bg-gray-800 h-80 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Analytics dashboard</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="devices">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">All Devices</h3>
                {/* Device list will go here */}
                <div className="bg-gray-100 dark:bg-gray-800 h-80 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Device management dashboard</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Energy Schedule</h3>
                {/* Calendar/schedule will go here */}
                <div className="bg-gray-100 dark:bg-gray-800 h-80 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Energy scheduling calendar</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
