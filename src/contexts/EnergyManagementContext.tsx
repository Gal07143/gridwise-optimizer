
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { EnergyManagementService } from '../services/energyManagementService';
import { Asset, GridSignal } from '../types/energyManagement';

// Create an instance of the service
const energyManagementService = new EnergyManagementService();

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

    // Memoized refresh functions to prevent unnecessary re-renders
    const refreshAssets = useCallback(async () => {
        try {
            const data = await energyManagementService.getAssets();
            setAssets(prevAssets => {
                // Only update if data has changed
                if (JSON.stringify(prevAssets) !== JSON.stringify(data)) {
                    return data;
                }
                return prevAssets;
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch assets');
            console.error(err);
        }
    }, []);

    const refreshSignals = useCallback(async () => {
        try {
            const data = await energyManagementService.getGridSignals();
            setSignals(prevSignals => {
                // Only update if data has changed
                if (JSON.stringify(prevSignals) !== JSON.stringify(data)) {
                    return data;
                }
                return prevSignals;
            });
            setError(null);
        } catch (err) {
            setError('Failed to fetch grid signals');
            console.error(err);
        }
    }, []);

    // Memoized context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        assets,
        signals,
        loading,
        error,
        refreshAssets,
        refreshSignals,
    }), [assets, signals, loading, error, refreshAssets, refreshSignals]);

    useEffect(() => {
        let mounted = true;

        const initializeData = async () => {
            setLoading(true);
            try {
                // Use Promise.all to fetch data in parallel
                await Promise.all([refreshAssets(), refreshSignals()]);
            } catch (err) {
                if (mounted) {
                    setError('Failed to initialize data');
                    console.error(err);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        initializeData();

        // Cleanup function to prevent state updates after unmount
        return () => {
            mounted = false;
        };
    }, [refreshAssets, refreshSignals]);

    return (
        <EnergyManagementContext.Provider value={contextValue}>
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

// Export the service instance for direct use
export { energyManagementService };
