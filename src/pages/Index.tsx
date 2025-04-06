
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Energy Management System
        </h1>
        <p className="text-xl text-slate-600">
          Monitor, control and optimize your energy usage
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/auth">
            <Button size="lg">
              Sign In
            </Button>
          </Link>
          <a href="https://grid.com/en/energy" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
