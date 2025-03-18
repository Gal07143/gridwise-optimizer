
import React from 'react';
import { Bell, Search, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  return (
    <header className="w-full h-16 px-6 border-b border-border flex items-center justify-between bg-background/80 backdrop-blur-sm z-10">
      <div className="flex items-center">
        <div className="mr-2 text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-energy-blue to-energy-teal">
          GridWise
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <Search size={18} />
          </div>
          <input
            type="search"
            className="w-full py-2 pl-10 pr-4 border border-border rounded-full bg-background focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            placeholder="Search devices, metrics, reports..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <button className={cn(
          "p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition duration-200",
        )}>
          <Bell size={20} />
        </button>
        <button className={cn(
          "p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition duration-200",
        )}>
          <Settings size={20} />
        </button>
        <button className="ml-2 p-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition duration-200">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
