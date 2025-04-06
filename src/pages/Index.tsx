
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-8 max-w-3xl">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full text-primary mb-4">
          <Zap size={24} />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Smart Energy Management System
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Monitor, control, and optimize your energy usage with our comprehensive management solution.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link to="/auth">
            <Button size="lg" className="font-medium gap-2">
              Sign in to get started
              <ArrowRight size={18} />
            </Button>
          </Link>
          
          <Link to="/auth" state={{ signUp: true }}>
            <Button variant="outline" size="lg" className="font-medium">
              Create an account
            </Button>
          </Link>
        </div>
        
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Real-time Monitoring</h3>
            <p className="text-muted-foreground">Track energy consumption and production with live data visualization.</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Smart Optimization</h3>
            <p className="text-muted-foreground">AI-powered recommendations to maximize efficiency and reduce costs.</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Device Integration</h3>
            <p className="text-muted-foreground">Connect and control all your energy devices from one dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
