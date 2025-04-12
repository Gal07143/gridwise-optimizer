import React, { createContext, useContext, useState, useEffect } from 'react';
import { energyManagementService } from '../services/energyManagementService';
import { Asset, GridSignal } from '../types/energyManagement';

interface EnergyManagementContextType {
    assets: Asset[];
    signals: GridSignal[];
    loading: boolean;
    error: string | null;
    refreshAssets: () => Promise<void>;
    refreshSignals: () => Promise<void>;
}

const EnergyManagementContext = createContext<EnergyManagementContextType | undefined>(undefined);

export const EnergyManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [signals, setSignals] = useState<GridSignal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshAssets = async () => {
        try {
            const data = await energyManagementService.getAssets();
            setAssets(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch assets');
            console.error(err);
        }
    };

    const refreshSignals = async () => {
        try {
            const data = await energyManagementService.getGridSignals();
            setSignals(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch grid signals');
            console.error(err);
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            try {
                await Promise.all([refreshAssets(), refreshSignals()]);
            } catch (err) {
                setError('Failed to initialize data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    return (
        <EnergyManagementContext.Provider
            value={{
                assets,
                signals,
                loading,
                error,
                refreshAssets,
                refreshSignals,
            }}
        >
            {children}
        </EnergyManagementContext.Provider>
    );
};

export const useEnergyManagement = () => {
    const context = useContext(EnergyManagementContext);
    if (context === undefined) {
        throw new Error('useEnergyManagement must be used within an EnergyManagementProvider');
    }
    return context;
}; 