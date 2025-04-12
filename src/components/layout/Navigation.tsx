import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BoltIcon, CogIcon, ChartBarIcon } from '@heroicons/react/24/outline';

/**
 * Navigation item interface
 */
interface NavItem {
    path: string;
    label: string;
    icon: React.ElementType;
}

/**
 * Navigation component that provides the main navigation for the application
 */
const Navigation = () => {
    const location = useLocation();

    /**
     * Check if a navigation item is active based on the current path
     */
    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    /**
     * Navigation items configuration
     */
    const navItems: NavItem[] = [
        {
            path: '/energy-management',
            label: 'Energy Management',
            icon: HomeIcon
        },
        {
            path: '/energy-management/assets',
            label: 'Assets',
            icon: BoltIcon
        },
        {
            path: '/energy-management/signals',
            label: 'Grid Signals',
            icon: ChartBarIcon
        },
        {
            path: '/settings',
            label: 'Settings',
            icon: CogIcon
        }
    ];

    return (
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-white font-bold text-xl">
                                Gridwise
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`${
                                                isActive(item.path)
                                                    ? 'bg-gray-900 text-white'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            } px-3 py-2 rounded-md text-sm font-medium`}
                                        >
                                            <Icon className="h-5 w-5 inline-block mr-2" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 