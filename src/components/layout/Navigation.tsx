import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BoltIcon, CogIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Navigation = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

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
                                <Link
                                    to="/energy-management"
                                    className={`${
                                        isActive('/energy-management')
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    } px-3 py-2 rounded-md text-sm font-medium`}
                                >
                                    <HomeIcon className="h-5 w-5 inline-block mr-2" />
                                    Energy Management
                                </Link>
                                <Link
                                    to="/energy-management/assets"
                                    className={`${
                                        isActive('/energy-management/assets')
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    } px-3 py-2 rounded-md text-sm font-medium`}
                                >
                                    <BoltIcon className="h-5 w-5 inline-block mr-2" />
                                    Assets
                                </Link>
                                <Link
                                    to="/energy-management/signals"
                                    className={`${
                                        isActive('/energy-management/signals')
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    } px-3 py-2 rounded-md text-sm font-medium`}
                                >
                                    <ChartBarIcon className="h-5 w-5 inline-block mr-2" />
                                    Grid Signals
                                </Link>
                                <Link
                                    to="/settings"
                                    className={`${
                                        isActive('/settings')
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    } px-3 py-2 rounded-md text-sm font-medium`}
                                >
                                    <CogIcon className="h-5 w-5 inline-block mr-2" />
                                    Settings
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 