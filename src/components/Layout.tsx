
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { 
  Home, 
  Settings, 
  LayoutGrid, 
  Activity,
  BarChart2, 
  Zap,
  Bell,
  Menu,
  Search,
  User
} from 'lucide-react';
import { Button } from './ui/button';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          {sidebarOpen ? (
            <Link to="/" className="flex items-center">
              <Zap className="h-6 w-6 text-blue-600" />
              <span className="ml-2 font-bold text-xl">EnergyIoT</span>
            </Link>
          ) : (
            <Zap className="h-6 w-6 text-blue-600 mx-auto" />
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col flex-1 pt-5">
          <nav className="space-y-1 px-3">
            {[
              { icon: <Home />, label: 'Dashboard', path: '/' },
              { icon: <LayoutGrid />, label: 'Devices', path: '/devices' },
              { icon: <Activity />, label: 'Energy', path: '/energy-management' },
              { icon: <BarChart2 />, label: 'Analytics', path: '/analytics' },
              { icon: <Settings />, label: 'Settings', path: '/settings' },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md 
                  ${location.pathname === item.path 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200' 
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50'}`}
              >
                <span className="mr-3 text-slate-400">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center px-4 py-2">
            <div className="flex">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-700 dark:text-slate-200 dark:ring-slate-600"
                  placeholder="Search..."
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <Outlet />
        </main>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};
