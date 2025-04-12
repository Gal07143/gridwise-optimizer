import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/energy-management/Sidebar';

const EnergyManagementLayout = () => {
    return (
        <div className="flex h-full">
            <Sidebar />
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default EnergyManagementLayout; 