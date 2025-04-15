import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
    LayoutDashboard,
    Settings,
    Activity,
    Zap,
    Gauge,
    Cable,
    Menu,
    X,
    LineChart,
    BarChart3,
    Building2,
    Grid
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

/**
 * Navigation item interface
 */
interface NavItem {
    path: string;
    label: string;
    icon: React.ElementType;
    description?: string;
    children?: NavItem[];
}

/**
 * Navigation link props interface
 */
interface NavLinkProps {
    item: NavItem;
    isMobile?: boolean;
    onClick?: () => void;
    key?: string;
}

/**
 * Navigation items configuration
 */
const navItems: NavItem[] = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        description: 'Overview and analytics'
    },
    {
        path: '/devices',
        label: 'Devices',
        icon: Zap,
        description: 'Manage connected devices',
        children: [
            {
                path: '/devices/generation',
                label: 'Generation Devices',
                icon: Gauge,
                description: 'Solar, wind, and other generators'
            },
            {
                path: '/devices/storage',
                label: 'Storage Devices',
                icon: Cable,
                description: 'Batteries and storage systems'
            },
            {
                path: '/devices/monitoring',
                label: 'Monitoring Devices',
                icon: Gauge,
                description: 'Sensors and meters'
            }
        ]
    },
    {
        path: '/equipment',
        label: 'Equipment',
        icon: Cable,
        description: 'Manage equipment and systems'
    },
    {
        path: '/energy',
        label: 'Energy',
        icon: Grid,
        description: 'Energy management',
        children: [
            {
                path: '/energy/optimization',
                label: 'Optimization',
                icon: LineChart,
                description: 'Energy optimization tools'
            },
            {
                path: '/energy/grid',
                label: 'Grid Management',
                icon: Grid,
                description: 'Grid connection management'
            },
            {
                path: '/energy/storage',
                label: 'Storage Management',
                icon: Cable,
                description: 'Energy storage management'
            }
        ]
    },
    {
        path: '/analytics',
        label: 'Analytics',
        icon: Activity,
        description: 'Data insights and reports',
        children: [
            {
                path: '/analytics/energy',
                label: 'Energy Analytics',
                icon: BarChart3,
                description: 'Energy consumption analysis'
            },
            {
                path: '/analytics/devices',
                label: 'Device Analytics',
                icon: Gauge,
                description: 'Device performance metrics'
            },
            {
                path: '/analytics/performance',
                label: 'Performance',
                icon: LineChart,
                description: 'System performance analytics'
            }
        ]
    },
    {
        path: '/energy-management',
        label: 'Energy Management',
        icon: Building2,
        description: 'Energy management platform'
    },
    {
        path: '/settings',
        label: 'Settings',
        icon: Settings,
        description: 'System configuration'
    }
];

/**
 * Navigation link component with support for child items
 */
const NavLink: React.FC<NavLinkProps> = ({ item, isMobile, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
    const Icon = item.icon;
    const [isOpen, setIsOpen] = React.useState(false);

    if (isMobile) {
        return (
            <>
                <Link
                    to={item.path}
                    className={cn(
                        "flex items-center space-x-4 px-3 py-2 rounded-lg transition-colors",
                        isActive
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                    )}
                    onClick={onClick}
                >
                    <Icon className="h-5 w-5" />
                    <div>
                        <p className="font-medium">{item.label}</p>
                        {item.description && (
                            <p className="text-sm text-muted-foreground">
                                {item.description}
                            </p>
                        )}
                    </div>
                </Link>
                {item.children && item.children.map((child) => (
                    <Link
                        key={child.path}
                        to={child.path}
                        className={cn(
                            "flex items-center space-x-4 px-6 py-2 rounded-lg transition-colors ml-4",
                            location.pathname === child.path
                                ? "bg-accent/70 text-accent-foreground"
                                : "hover:bg-accent/30"
                        )}
                        onClick={onClick}
                    >
                        <child.icon className="h-4 w-4" />
                        <span className="text-sm">{child.label}</span>
                    </Link>
                ))}
            </>
        );
    }

    if (item.children) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full",
                        isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`ml-auto h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
                {isOpen && (
                    <div className="absolute left-0 mt-1 w-56 origin-top-left rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {item.children.map((child) => (
                                <Link
                                    key={child.path}
                                    to={child.path}
                                    className={cn(
                                        "block px-4 py-2 text-sm transition-colors",
                                        location.pathname === child.path
                                            ? "bg-accent text-accent-foreground"
                                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                    )}
                                    onClick={onClick}
                                >
                                    <div className="flex items-center space-x-2">
                                        <child.icon className="h-4 w-4" />
                                        <span>{child.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            to={item.path}
            className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
            onClick={onClick}
        >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
        </Link>
    );
};

/**
 * Mobile navigation component
 */
const MobileNav = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
                        <Zap className="h-6 w-6" />
                        <span className="font-bold text-lg">Gridwise</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <nav className="mt-8 flex flex-col space-y-2">
                    {navItems.map((item) => (
                        <NavLink 
                            key={item.path} 
                            item={item} 
                            isMobile 
                            onClick={() => setOpen(false)} 
                        />
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
};

/**
 * Main navigation component
 */
const Navigation = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="flex items-center space-x-4 md:space-x-6">
                    <Link to="/" className="flex items-center space-x-2">
                        <Zap className="h-6 w-6" />
                        <span className="hidden font-bold md:inline-block">Gridwise</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-2">
                        {navItems.map((item) => (
                            <NavLink key={item.path} item={item} />
                        ))}
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <ThemeToggle />
                    <MobileNav />
                </div>
            </div>
        </header>
    );
};

export default Navigation;
