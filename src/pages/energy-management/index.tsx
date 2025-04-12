import { useEffect, useState } from 'react';
import { energyManagementService } from '../../services/energyManagementService';
import { Asset, GridSignal } from '../../types/energyManagement';

const EnergyManagementDashboard = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [signals, setSignals] = useState<GridSignal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assetsData, signalsData] = await Promise.all([
                    energyManagementService.getAssets(),
                    energyManagementService.getGridSignals()
                ]);
                setAssets(assetsData);
                setSignals(signalsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Energy Management Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Assets Overview</h2>
                    <div className="space-y-4">
                        {assets.map(asset => (
                            <div key={asset.id} className="border-b pb-4">
                                <h3 className="font-medium">{asset.name}</h3>
                                <p className="text-sm text-gray-600">Type: {asset.type}</p>
                                <p className="text-sm text-gray-600">Status: {asset.status}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Recent Grid Signals</h2>
                    <div className="space-y-4">
                        {signals.slice(0, 5).map(signal => (
                            <div key={signal.id} className="border-b pb-4">
                                <h3 className="font-medium">{signal.type}</h3>
                                <p className="text-sm text-gray-600">Value: {signal.value}</p>
                                <p className="text-sm text-gray-600">Time: {new Date(signal.timestamp).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnergyManagementDashboard; 