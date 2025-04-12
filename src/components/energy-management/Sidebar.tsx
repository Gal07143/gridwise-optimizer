import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BoltIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    return (
        <div className="w-64 bg-gray-800 min-h-screen">
            <div className="p-4">
                <h2 className="text-white text-xl font-bold mb-6">Energy Management</h2>
                <nav className="space-y-2">
                    <Link
                        to="/energy-management"
                        className={`flex items-center px-4 py-2 rounded-md ${
                            isActive('/energy-management') && !isActive('/energy-management/assets') && !isActive('/energy-management/signals')
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <HomeIcon className="h-5 w-5 mr-3" />
                        Dashboard
                    </Link>
                    <Link
                        to="/energy-management/assets"
                        className={`flex items-center px-4 py-2 rounded-md ${
                            isActive('/energy-management/assets')
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <BoltIcon className="h-5 w-5 mr-3" />
                        Assets
                    </Link>
                    <Link
                        to="/energy-management/signals"
                        className={`flex items-center px-4 py-2 rounded-md ${
                            isActive('/energy-management/signals')
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <ChartBarIcon className="h-5 w-5 mr-3" />
                        Grid Signals
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar; 