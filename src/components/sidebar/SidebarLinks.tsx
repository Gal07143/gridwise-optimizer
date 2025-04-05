import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Battery, Zap, LineChart, BarChart3, Settings, CircuitBoard, Cloud, Cpu, Brain, CloudLightning } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

export const navLinks = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: 'Devices',
    href: '/devices/manage',
    icon: <Cpu className="h-5 w-5" />,
  },
  {
    title: 'Energy Flow',
    href: '/energy-flow',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: 'Advanced Energy Flow',
    href: '/energy-flow-advanced',
    icon: <CloudLightning className="h-5 w-5" />,
  },
  {
    title: 'Battery Management',
    href: '/battery-management',
    icon: <Battery className="h-5 w-5" />,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: 'AI Overview',
    href: '/ai-overview',
    icon: <Brain className="h-5 w-5" />,
  },
  {
    title: 'Optimization',
    href: '/optimization',
    icon: <CircuitBoard className="h-5 w-5" />,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: <LineChart className="h-5 w-5" />,
  },
  {
    title: 'Weather',
    href: '/weather',
    icon: <Cloud className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

interface SidebarLinksProps {
  collapsed?: boolean;
}

const SidebarLinks: React.FC<SidebarLinksProps> = ({ collapsed = false }) => {
  const isMobile = useIsMobile();
  
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <Tooltip key={link.href} delayDuration={300}>
              <TooltipTrigger asChild>
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-center rounded-lg p-2 text-sm transition-all',
                      isActive
                        ? 'bg-gridx-blue/10 text-gridx-blue dark:bg-gridx-blue/20 dark:text-white'
                        : 'text-muted-foreground hover:bg-gridx-blue/5 hover:text-gridx-blue dark:hover:bg-gridx-blue/10 dark:hover:text-white'
                    )
                  }
                  end={link.href === '/'}
                >
                  {link.icon}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-normal">
                {link.title}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    );
  }

  return (
    <nav className="space-y-1">
      {navLinks.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
              isActive
                ? 'bg-gridx-blue/10 text-gridx-blue dark:bg-gridx-blue/20 dark:text-white'
                : 'text-muted-foreground hover:bg-gridx-blue/5 hover:text-gridx-blue dark:hover:bg-gridx-blue/10 dark:hover:text-white'
            )
          }
          end={link.href === '/'}
        >
          {link.icon}
          {link.title}
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarLinks;
