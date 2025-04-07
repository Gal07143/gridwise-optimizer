
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Lightbulb, BarChart3, Battery } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-8 max-w-4xl">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full text-primary mb-4">
          <Zap size={28} />
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Energy Management System
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Monitor, control, and optimize your energy usage with our comprehensive AI-powered energy management solution.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Link to="/auth">
            <Button size="lg" className="font-medium gap-2 px-8 py-6 text-lg">
              Sign in
              <ArrowRight size={20} />
            </Button>
          </Link>
          
          <Link to="/auth" state={{ signUp: true }}>
            <Button variant="outline" size="lg" className="font-medium px-8 py-6 text-lg">
              Create an account
            </Button>
          </Link>
        </div>
        
        <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card border rounded-lg p-8 shadow-sm hover:shadow-md transition-all">
            <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Battery className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Smart Energy Storage</h3>
            <p className="text-muted-foreground">Optimize battery charging and discharging based on energy prices, weather, and your usage patterns.</p>
          </div>
          
          <div className="bg-card border rounded-lg p-8 shadow-sm hover:shadow-md transition-all">
            <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Lightbulb className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">AI-Driven Efficiency</h3>
            <p className="text-muted-foreground">Machine learning algorithms that continually improve energy efficiency across all your devices and systems.</p>
          </div>
          
          <div className="bg-card border rounded-lg p-8 shadow-sm hover:shadow-md transition-all">
            <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <BarChart3 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Detailed Analytics</h3>
            <p className="text-muted-foreground">Comprehensive insights into your energy consumption, production, and savings with actionable recommendations.</p>
          </div>
        </div>
      </div>
      
      <footer className="mt-24 text-center text-sm text-muted-foreground">
        <p>© 2025 Energy Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
