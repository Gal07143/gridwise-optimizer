import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/energy-management/Sidebar';

const EnergyManagementLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default EnergyManagementLayout; 