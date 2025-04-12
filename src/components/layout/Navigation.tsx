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
    Menu,
    X
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
}

/**
 * Navigation link props interface
 */
interface NavLinkProps {
    item: NavItem;
    isMobile?: boolean;
    onClick?: () => void;
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
        description: 'Manage connected devices'
    },
    {
        path: '/analytics',
        label: 'Analytics',
        icon: Activity,
        description: 'Data insights and reports'
    },
    {
        path: '/settings',
        label: 'Settings',
        icon: Settings,
        description: 'System configuration'
    }
];

/**
 * Navigation link component
 */
const NavLink = ({ item, isMobile, onClick }: NavLinkProps) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(item.path);
    const Icon = item.icon;

    if (isMobile) {
        return (
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
            <SheetContent side="left" className="w-80">
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