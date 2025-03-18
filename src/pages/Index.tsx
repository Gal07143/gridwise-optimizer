
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Battery, Bolt, LineChart, Shield, Zap } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-green-400 to-emerald-500">
          EdgeControl Energy Management System
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10">
          The ultimate platform for real-time energy monitoring, microgrid control, and advanced analytics
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link to="/dashboard">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/analytics">View Analytics</Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="h-8 w-8 text-blue-500" />}
            title="Real-Time Monitoring"
            description="Track energy production, consumption, and storage with live data updates and intuitive visualizations."
          />
          <FeatureCard 
            icon={<Bolt className="h-8 w-8 text-emerald-500" />}
            title="Microgrid Control"
            description="Automate and optimize energy flows between renewable sources, storage systems, and grid connections."
          />
          <FeatureCard 
            icon={<LineChart className="h-8 w-8 text-violet-500" />}
            title="Advanced Analytics"
            description="Leverage AI-powered insights to forecast demand, detect anomalies, and maximize efficiency."
          />
          <FeatureCard 
            icon={<Battery className="h-8 w-8 text-amber-500" />}
            title="Storage Management"
            description="Extend battery life and optimize charging/discharging cycles with intelligent algorithms."
          />
          <FeatureCard 
            icon={<Shield className="h-8 w-8 text-red-500" />}
            title="Security & Compliance"
            description="Enterprise-grade security with role-based access control and regulatory compliance features."
          />
          <FeatureCard 
            icon={<Bolt className="h-8 w-8 text-teal-500" />}
            title="Device Management"
            description="Configure and monitor all connected devices from a centralized interface with automated updates."
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 text-center">
        <GlassPanel className="p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to transform your energy management?</h2>
          <p className="text-muted-foreground mb-6">
            Start monitoring and optimizing your energy systems in real-time today.
          </p>
          <Button size="lg" asChild>
            <Link to="/dashboard">
              Enter Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </GlassPanel>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-auto border-t border-border/50">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} EdgeControl EMS. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Link to="/analytics" className="text-sm text-muted-foreground hover:text-foreground">Analytics</Link>
            <Link to="/devices" className="text-sm text-muted-foreground hover:text-foreground">Devices</Link>
            <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <GlassPanel className="p-6 h-full flex flex-col" intensity="low">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </GlassPanel>
  );
};

export default Index;
