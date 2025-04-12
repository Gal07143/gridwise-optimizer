import React, { useEffect, useState, useMemo } from 'react';
import { energyManagementService } from '@/services/energyManagementService';
import { Asset, GridSignal } from '@/types/energyManagement';
import { FixedSizeList as List } from 'react-window';

const AssetItem = ({ data, index, style }: { data: Asset[], index: number, style: React.CSSProperties }) => {
    const asset = data[index];
    return (
        <div style={style} className="border-b border-gray-200">
            <div className="p-4">
                <h3 className="text-lg font-semibold">{asset.name}</h3>
                <p className="text-gray-600">Type: {asset.type}</p>
                <p className="text-gray-600">Status: {asset.status}</p>
            </div>
        </div>
    );
};

const SignalItem = ({ data, index, style }: { data: GridSignal[], index: number, style: React.CSSProperties }) => {
    const signal = data[index];
    return (
        <div style={style} className="border-b border-gray-200">
            <div className="p-4">
                <h3 className="text-lg font-semibold">{signal.type}</h3>
                <p className="text-gray-600">Value: {signal.value}</p>
                <p className="text-gray-600">Timestamp: {new Date(signal.timestamp).toLocaleString()}</p>
            </div>
        </div>
    );
};

const EnergyManagementDashboard = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [signals, setSignals] = useState<GridSignal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assetsData, signalsData] = await Promise.all([
                    energyManagementService.getAssets(),
                    energyManagementService.getGridSignals()
                ]);
                setAssets(assetsData);
                setSignals(signalsData);
                setLoading(false);
            } catch (err) {
                setError('Failed to load data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const recentSignals = useMemo(() => signals.slice(0, 5), [signals]);

    if (loading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-full text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Energy Management Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Assets Overview</h2>
                    <div className="space-y-4">
                        <List
                            height={300}
                            itemCount={assets.length}
                            itemSize={100}
                            width="100%"
                            itemData={assets}
                        >
                            {AssetItem}
                        </List>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Recent Grid Signals</h2>
                    <div className="space-y-4">
                        <List
                            height={300}
                            itemCount={recentSignals.length}
                            itemSize={100}
                            width="100%"
                            itemData={recentSignals}
                        >
                            {SignalItem}
                        </List>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnergyManagementDashboard; 